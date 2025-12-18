import { NextResponse } from 'next/server';
import { sendContactMail } from '../config/smtp'; 

export async function POST(request: Request) {
  if (request.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const { name, email, message } = await request.json();

    // Basic validation (add more as needed, e.g., with Zod)
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Send the email using your existing function
    await sendContactMail({ name, email, message });

    return NextResponse.json({ success: true, message: 'Message sent successfully!' });
  } catch (error: any) {
    console.error('Email send error:', error);
    return NextResponse.json(
      { error: 'Failed to send message', details: error.message },
      { status: 500 }
    );
  }
}