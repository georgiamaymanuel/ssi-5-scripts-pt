import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { POST, splitName, md5 } from '../src/pages/api/subscribe';

const makeRequest = (body: unknown) =>
  new Request('http://localhost/api/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

const call = (body: unknown) =>
  POST({ request: makeRequest(body) } as Parameters<typeof POST>[0]);

describe('md5', () => {
  // Known vectors — matched against node:crypto.createHash('md5').
  // Block-boundary cases (55/56/63/64) catch padding bugs like the 64-bit
  // length-encoding bug that broke Mailchimp tagging.
  const vectors: Array<[string, string]> = [
    ['', 'd41d8cd98f00b204e9800998ecf8427e'],
    ['a', '0cc175b9c0f1b6a831c399e269772661'],
    ['abc', '900150983cd24fb0d6963f7d28e17f72'],
    ['test@example.com', '55502f40dc8b7c769880b10874abc9d0'],
    ['a'.repeat(55), 'ef1772b6dff9a122358552954ad0df65'],
    ['a'.repeat(56), '3b0c8ac703f828b04c6c197006d17218'],
    ['a'.repeat(63), 'b06521f39153d618550606be297466d5'],
    ['a'.repeat(64), '014842d480b571495a4a0363793f7367'],
    ['a'.repeat(120), '5f61c0ccad4cac44c75ff505e1f1e537'],
  ];

  it.each(vectors)('md5(%j) === %s', (input, expected) => {
    expect(md5(input)).toBe(expected);
  });
});

describe('splitName', () => {
  it('splits a standard "First Last"', () => {
    expect(splitName('Devin Manuel')).toEqual({ first: 'Devin', last: 'Manuel' });
  });

  it('leaves last name empty when only one word is given', () => {
    expect(splitName('Devin')).toEqual({ first: 'Devin', last: '' });
  });

  it('keeps multi-word last names intact', () => {
    expect(splitName('Devin Van Der Berg')).toEqual({
      first: 'Devin',
      last: 'Van Der Berg',
    });
  });

  it('trims leading and trailing whitespace', () => {
    expect(splitName('  Devin Manuel  ')).toEqual({ first: 'Devin', last: 'Manuel' });
  });

  it('collapses runs of internal whitespace', () => {
    expect(splitName('Devin   Manuel')).toEqual({ first: 'Devin', last: 'Manuel' });
  });

  it('returns empty fields for an empty string', () => {
    expect(splitName('')).toEqual({ first: '', last: '' });
  });
});

describe('POST /api/subscribe', () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.stubEnv('MAILCHIMP_API_KEY', 'test-key');
    vi.stubEnv('MAILCHIMP_LIST_ID', 'test-list');
    vi.stubEnv('MAILCHIMP_DC', 'us1');
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  const okMember = () =>
    new Response(JSON.stringify({ id: 'abc' }), { status: 200 });
  const okTag = () => new Response(null, { status: 204 });

  it('returns 400 when any required field is missing', async () => {
    const res = await call({ name: 'Devin', email: 'd@e.com' });
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/required/i);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('upserts the subscriber with FNAME/LNAME split and posts both tags', async () => {
    fetchMock.mockResolvedValueOnce(okMember()).mockResolvedValueOnce(okTag());

    const res = await call({
      name: 'Devin Manuel',
      email: 'Devin@Example.com',
      practiceName: 'Acme PT',
    });

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ success: true });
    expect(fetchMock).toHaveBeenCalledTimes(2);

    const expectedHash = md5('devin@example.com');

    const [memberUrl, memberOpts] = fetchMock.mock.calls[0];
    expect(memberUrl).toBe(
      `https://us1.api.mailchimp.com/3.0/lists/test-list/members/${expectedHash}`
    );
    expect(memberOpts.method).toBe('PUT');
    expect(memberOpts.headers.Authorization).toBe(
      `Basic ${btoa('anystring:test-key')}`
    );
    expect(JSON.parse(memberOpts.body)).toEqual({
      email_address: 'devin@example.com',
      status_if_new: 'subscribed',
      merge_fields: {
        FNAME: 'Devin',
        LNAME: 'Manuel',
        PRACTICE: 'Acme PT',
      },
    });

    const [tagUrl, tagOpts] = fetchMock.mock.calls[1];
    expect(tagUrl).toBe(
      `https://us1.api.mailchimp.com/3.0/lists/test-list/members/${expectedHash}/tags`
    );
    expect(tagOpts.method).toBe('POST');
    expect(JSON.parse(tagOpts.body)).toEqual({
      tags: [
        { name: '5-scripts-PT', status: 'active' },
        { name: 'PT', status: 'active' },
      ],
    });
  });

  it('sends an empty LNAME when the user provides a single-word name', async () => {
    fetchMock.mockResolvedValueOnce(okMember()).mockResolvedValueOnce(okTag());

    await call({ name: 'Devin', email: 'd@e.com', practiceName: 'X' });

    const memberBody = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(memberBody.merge_fields).toEqual({
      FNAME: 'Devin',
      LNAME: '',
      PRACTICE: 'X',
    });
  });

  it('returns 400 with the Mailchimp detail when the member API fails', async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ detail: 'Invalid resource' }), {
        status: 400,
      })
    );

    const res = await call({
      name: 'Devin Manuel',
      email: 'd@e.com',
      practiceName: 'X',
    });

    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe('Invalid resource');
    // Tag POST should not be attempted if the member upsert failed.
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('still reports success when tagging fails (logged, not fatal)', async () => {
    fetchMock
      .mockResolvedValueOnce(okMember())
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ detail: 'Tag error' }), { status: 400 })
      );

    const res = await call({
      name: 'Devin Manuel',
      email: 'd@e.com',
      practiceName: 'X',
    });

    expect(res.status).toBe(200);
    expect(console.error).toHaveBeenCalledWith(
      'Mailchimp tag error:',
      expect.objectContaining({ detail: 'Tag error' })
    );
  });

  it('returns 500 when the request body is not valid JSON', async () => {
    const badRequest = new Request('http://localhost/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'not json',
    });
    const res = await POST({ request: badRequest } as Parameters<typeof POST>[0]);
    expect(res.status).toBe(500);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
