export const prerender = false;

import type { APIRoute } from 'astro';

export function splitName(fullName: string): { first: string; last: string } {
  const trimmed = fullName.trim().replace(/\s+/g, ' ');
  const idx = trimmed.indexOf(' ');
  if (idx === -1) return { first: trimmed, last: '' };
  return { first: trimmed.slice(0, idx), last: trimmed.slice(idx + 1) };
}

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

    const API_KEY = import.meta.env.RESEND_API_KEY;
    const AUDIENCE_ID = import.meta.env.RESEND_AUDIENCE_ID;

    const { first, last } = splitName(name);

    // 1. Add contact to Resend audience
    const contactResponse = await fetch(
      `https://api.resend.com/audiences/${AUDIENCE_ID}/contacts`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          first_name: first,
          last_name: last,
          unsubscribed: false,
        }),
      }
    );

    if (!contactResponse.ok) {
      const errorData = await contactResponse.text();
      console.error('Resend contact error:', contactResponse.status, errorData);
      // Don't fail if contact already exists — continue to send email
    }

    // 2. Send transactional email with PDF download link
    const downloadUrl = 'https://scripts.survivalstrategies.com/assets/SSI-PT-Front-Desk-Scripts.pdf';

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Craig Ferreira <noreply@send.survivalstrategies.com>',
        to: [email.toLowerCase().trim()],
        subject: 'Your 5 Front Desk Scripts Are Ready',
        html: `
          <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <div style="background: #1D2C5A; padding: 32px 40px; text-align: center;">
              <img src="https://survivalstrategies.com/wp-content/uploads/2023/05/Logo-Light.png" alt="Survival Strategies" style="height: 40px; width: auto;" />
            </div>
            <div style="padding: 40px; background: #ffffff;">
              <h1 style="font-size: 24px; color: #1D2C5A; margin: 0 0 16px;">Hi ${first},</h1>
              <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">
                Thank you for requesting the <strong>5 Front Desk Scripts That Stop Revenue From Walking Out Your Door</strong>.
              </p>
              <p style="font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
                These scripts are proven across 1,000+ private practices. Print them out, share them with your front desk team, and start using them today.
              </p>
              <div style="text-align: center; margin: 32px 0;">
                <a href="${downloadUrl}" style="display: inline-block; background: #1D2C5A; color: #ffffff; font-weight: 700; font-size: 16px; padding: 16px 40px; border-radius: 6px; text-decoration: none;">
                  Download Your Scripts (PDF)
                </a>
              </div>
              <p style="font-size: 14px; line-height: 1.6; color: #6b7280; margin: 0 0 8px;">
                If the button above doesn't work, copy and paste this link into your browser:
              </p>
              <p style="font-size: 13px; color: #4A90D9; word-break: break-all; margin: 0 0 32px;">
                ${downloadUrl}
              </p>
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;" />
              <p style="font-size: 14px; line-height: 1.6; color: #6b7280; margin: 0;">
                Over the next few weeks, I'll send you a few short emails covering what the scripts don't: the real cost of missed calls, where your biggest revenue leaks hide, and what other PT owners have done to close them.
              </p>
            </div>
            <div style="background: #f8f9fb; padding: 24px 40px; text-align: center;">
              <p style="font-size: 12px; color: #9ca3af; margin: 0;">
                Survival Strategies, Inc. | 401 East Jackson Street, Suite 2340-E58, Tampa, FL 33602
              </p>
            </div>
          </div>
        `,
      }),
    });

    if (!emailResponse.ok) {
      const emailError = await emailResponse.text();
      console.error('Resend email error:', emailResponse.status, emailError);
      return new Response(
        JSON.stringify({ error: 'Failed to send email. Please try again.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
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
