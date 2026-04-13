export const prerender = false;

import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { name, email, practiceName } = body;

    if (!name || !email || !practiceName) {
      return new Response(
        JSON.stringify({ error: 'All fields are required.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const API_KEY = import.meta.env.MAILCHIMP_API_KEY;
    const LIST_ID = import.meta.env.MAILCHIMP_LIST_ID;
    const DC = import.meta.env.MAILCHIMP_DC;

    // 1. Add or update the subscriber
    const subscriberHash = md5(email.toLowerCase().trim());

    const memberResponse = await fetch(
      `https://${DC}.api.mailchimp.com/3.0/lists/${LIST_ID}/members/${subscriberHash}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Basic ${btoa(`anystring:${API_KEY}`)}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email_address: email.toLowerCase().trim(),
          status_if_new: 'subscribed',
          merge_fields: {
            FNAME: name,
            PRACTICE: practiceName,
          },
        }),
      }
    );

    if (!memberResponse.ok) {
      const errorData = await memberResponse.json();
      console.error('Mailchimp member error:', errorData);
      return new Response(
        JSON.stringify({ error: errorData.detail || 'Failed to subscribe.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 2. Add the tag "5-scripts-PT"
    const tagResponse = await fetch(
      `https://${DC}.api.mailchimp.com/3.0/lists/${LIST_ID}/members/${subscriberHash}/tags`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${btoa(`anystring:${API_KEY}`)}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tags: [
            { name: '5-scripts-PT', status: 'active' },
            { name: 'PT', status: 'active' },
          ],
        }),
      }
    );

    if (!tagResponse.ok) {
      const tagError = await tagResponse.json();
      console.error('Mailchimp tag error:', tagError);
      // Don't fail the whole request if tagging fails — subscriber is already added
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('Subscribe error:', err);
    return new Response(
      JSON.stringify({ error: 'Internal server error.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// MD5 hash for Mailchimp subscriber hash (pure JS, no dependencies)
function md5(input: string): string {
  const k = [
    0xd76aa478,0xe8c7b756,0x242070db,0xc1bdceee,0xf57c0faf,0x4787c62a,0xa8304613,0xfd469501,
    0x698098d8,0x8b44f7af,0xffff5bb1,0x895cd7be,0x6b901122,0xfd987193,0xa679438e,0x49b40821,
    0xf61e2562,0xc040b340,0x265e5a51,0xe9b6c7aa,0xd62f105d,0x02441453,0xd8a1e681,0xe7d3fbc8,
    0x21e1cde6,0xc33707d6,0xf4d50d87,0x455a14ed,0xa9e3e905,0xfcefa3f8,0x676f02d9,0x8d2a4c8a,
    0xfffa3942,0x8771f681,0x6d9d6122,0xfde5380c,0xa4beea44,0x4bdecfa9,0xf6bb4b60,0xbebfbc70,
    0x289b7ec6,0xeaa127fa,0xd4ef3085,0x04881d05,0xd9d4d039,0xe6db99e5,0x1fa27cf8,0xc4ac5665,
    0xf4292244,0x432aff97,0xab9423a7,0xfc93a039,0x655b59c3,0x8f0ccc92,0xffeff47d,0x85845dd1,
    0x6fa87e4f,0xfe2ce6e0,0xa3014314,0x4e0811a1,0xf7537e82,0xbd3af235,0x2ad7d2bb,0xeb86d391,
  ];
  const s = [
    7,12,17,22,7,12,17,22,7,12,17,22,7,12,17,22,
    5,9,14,20,5,9,14,20,5,9,14,20,5,9,14,20,
    4,11,16,23,4,11,16,23,4,11,16,23,4,11,16,23,
    6,10,15,21,6,10,15,21,6,10,15,21,6,10,15,21,
  ];

  const bytes: number[] = [];
  for (let i = 0; i < input.length; i++) {
    bytes.push(input.charCodeAt(i) & 0xff);
  }
  bytes.push(0x80);
  while (bytes.length % 64 !== 56) bytes.push(0);
  const bitLen = input.length * 8;
  for (let i = 0; i < 8; i++) bytes.push((bitLen >>> (i * 8)) & 0xff);

  let a0 = 0x67452301, b0 = 0xefcdab89, c0 = 0x98badcfe, d0 = 0x10325476;

  for (let i = 0; i < bytes.length; i += 64) {
    const m: number[] = [];
    for (let j = 0; j < 16; j++) {
      m[j] = bytes[i+j*4] | (bytes[i+j*4+1]<<8) | (bytes[i+j*4+2]<<16) | (bytes[i+j*4+3]<<24);
    }
    let a = a0, b = b0, c = c0, d = d0;
    for (let j = 0; j < 64; j++) {
      let f: number, g: number;
      if (j < 16) { f = (b & c) | (~b & d); g = j; }
      else if (j < 32) { f = (d & b) | (~d & c); g = (5*j+1) % 16; }
      else if (j < 48) { f = b ^ c ^ d; g = (3*j+5) % 16; }
      else { f = c ^ (b | ~d); g = (7*j) % 16; }
      const tmp = d; d = c; c = b;
      const x = (a + f + k[j] + m[g]) >>> 0;
      b = (b + ((x << s[j]) | (x >>> (32 - s[j])))) >>> 0;
      a = tmp;
    }
    a0 = (a0 + a) >>> 0; b0 = (b0 + b) >>> 0; c0 = (c0 + c) >>> 0; d0 = (d0 + d) >>> 0;
  }

  const hex = (n: number) => Array.from({length:4},(_,i)=>((n>>>(i*8))&0xff).toString(16).padStart(2,'0')).join('');
  return hex(a0) + hex(b0) + hex(c0) + hex(d0);
}
