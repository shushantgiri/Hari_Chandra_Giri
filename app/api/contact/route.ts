import { NextResponse } from "next/server";

// Minimal contact-form handler. It validates the payload and responds so the
// form works end-to-end out of the box. Wire up real delivery before
// deploying — e.g. Resend (resend.com) or another transactional email API —
// and keep any provider API key in an environment variable, never hard-coded
// here.

interface ContactPayload {
  name?: string;
  email?: string;
  purpose?: string;
  message?: string;
}

export async function POST(request: Request) {
  let payload: ContactPayload;

  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { name, email, purpose, message } = payload;

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // TODO: forward the enquiry, e.g.:
  //
  // await resend.emails.send({
  //   from: "enquiries@harichandragiri.com",
  //   to: "team@harichandragiri.com",
  //   subject: `New enquiry — ${purpose ?? "General"}`,
  //   text: `${name} <${email}>\n\n${message}`,
  // });

  console.log("Contact enquiry received:", { name, email, purpose });

  return NextResponse.json({ ok: true });
}
