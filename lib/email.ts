import nodemailer from 'nodemailer';

interface ReservationEmailPayload {
  customerName: string;
  email: string;
  date: string;
  time: string;
  guests: number;
}

interface EmailDispatchResult {
  sent: boolean;
  reason?: string;
}

function isPlaceholderValue(value: string): boolean {
  const normalized = value.toLowerCase();
  return (
    normalized.includes('your-email') ||
    normalized.includes('your_email') ||
    normalized.includes('your-app-password') ||
    normalized.includes('your_email_app_password') ||
    normalized.includes('example.com')
  );
}

function getEmailConfig() {
  const user = process.env.EMAIL_USER?.trim();
  const pass = process.env.EMAIL_PASS?.trim();

  if (!user || !pass) {
    return null;
  }

  if (isPlaceholderValue(user) || isPlaceholderValue(pass)) {
    return null;
  }

  return { user, pass };
}

async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}): Promise<EmailDispatchResult> {
  const emailConfig = getEmailConfig();
  if (!emailConfig) {
    return {
      sent: false,
      reason: 'Email delivery skipped: EMAIL_USER/EMAIL_PASS are not configured with real SMTP credentials.',
    };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: emailConfig.user,
        pass: emailConfig.pass,
      },
    });

    await transporter.sendMail({
      from: `"Casa Bella Reservations" <${emailConfig.user}>`,
      to,
      subject,
      html,
    });

    return { sent: true };
  } catch (error) {
    const reason = error instanceof Error ? error.message : 'Unknown SMTP error';
    return {
      sent: false,
      reason: `Email delivery failed: ${reason}`,
    };
  }
}

export async function sendReservationConfirmedEmail(
  reservation: ReservationEmailPayload
): Promise<EmailDispatchResult> {
  return sendEmail({
    to: reservation.email,
    subject: 'Casa Bella Ristorante - Reservation Confirmed!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #D4AF37;">Casa Bella Ristorante</h2>
        <h3>Reservation Confirmed</h3>
        <p>Dear ${reservation.customerName},</p>
        <p>We are delighted to confirm your reservation at Casa Bella.</p>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Date:</strong></td> <td style="padding: 8px; border-bottom: 1px solid #eee;">${reservation.date}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Time:</strong></td> <td style="padding: 8px; border-bottom: 1px solid #eee;">${reservation.time}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Guests:</strong></td> <td style="padding: 8px; border-bottom: 1px solid #eee;">${reservation.guests} People</td></tr>
        </table>
        <p>If you need to make any changes or cancel, please contact us directly.</p>
        <p>We look forward to hosting you!</p>
        <br/>
        <p>Warm regards,<br/>The Casa Bella Team</p>
      </div>
    `,
  });
}

export async function sendReservationRejectedEmail(
  reservation: ReservationEmailPayload
): Promise<EmailDispatchResult> {
  return sendEmail({
    to: reservation.email,
    subject: 'Casa Bella Ristorante - Reservation Update',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #D4AF37;">Casa Bella Ristorante</h2>
        <h3>Reservation Update</h3>
        <p>Dear ${reservation.customerName},</p>
        <p>We regret to inform you that we are unable to accommodate your reservation request for ${reservation.guests} people on ${reservation.date} at ${reservation.time}.</p>
        <p>We apologize for any inconvenience this may cause and hope to welcome you on another occasion.</p>
        <br/>
        <p>Warm regards,<br/>The Casa Bella Team</p>
      </div>
    `,
  });
}
