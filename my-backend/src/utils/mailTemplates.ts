interface ContactData {
  name: string
  email?: string
  phone?: string
  subject: string
  message: string
  contactType: string
}

export function adminNotificationTemplate(data: ContactData): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 24px;">
  <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
    <table style="max-width: 560px; width: 100%; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
      <tr><td style="background: #1a1a2e; padding: 24px; text-align: center;">
        <h1 style="color: #fff; margin: 0; font-size: 22px;">Nepali Restaurant &amp; Bar</h1>
        <p style="color: #c9a84c; margin: 4px 0 0; font-size: 14px;">New Contact Message</p>
      </td></tr>
      <tr><td style="padding: 24px;">
        <table width="100%" cellpadding="8">
          <tr><td style="color: #888; width: 100px; vertical-align: top;">Type</td><td style="font-weight: 600; text-transform: capitalize;">${data.contactType}</td></tr>
          <tr><td style="color: #888; vertical-align: top;">Name</td><td>${data.name}</td></tr>
          ${data.email ? `<tr><td style="color: #888; vertical-align: top;">Email</td><td>${data.email}</td></tr>` : ''}
          ${data.phone ? `<tr><td style="color: #888; vertical-align: top;">Phone</td><td>${data.phone}</td></tr>` : ''}
          <tr><td style="color: #888; vertical-align: top;">Subject</td><td>${data.subject}</td></tr>
          <tr><td style="color: #888; vertical-align: top;">Message</td><td style="white-space: pre-wrap; line-height: 1.5;">${data.message}</td></tr>
        </table>
      </td></tr>
      <tr><td style="background: #fafafa; padding: 16px 24px; text-align: center; font-size: 12px; color: #aaa;">
        Nepali Restaurant &amp; Bar — Admin Notification
      </td></tr>
    </table>
  </td></tr></table>
</body>
</html>`
}

export function autoReplyTemplate(data: ContactData): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 24px;">
  <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
    <table style="max-width: 560px; width: 100%; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
      <tr><td style="background: #1a1a2e; padding: 24px; text-align: center;">
        <h1 style="color: #fff; margin: 0; font-size: 22px;">Nepali Restaurant &amp; Bar</h1>
        <p style="color: #c9a84c; margin: 4px 0 0; font-size: 14px;">We've received your message</p>
      </td></tr>
      <tr><td style="padding: 24px;">
        <p style="font-size: 15px; line-height: 1.6;">Dear <strong>${data.name}</strong>,</p>
        <p style="font-size: 15px; line-height: 1.6;">Thank you for reaching out to us. We have received your message and our team will get back to you as soon as possible.</p>
        <table width="100%" cellpadding="8" style="background: #f9f9f9; border-radius: 6px; margin: 16px 0;">
          <tr><td style="color: #888; width: 80px; vertical-align: top;">Subject</td><td style="font-weight: 500;">${data.subject}</td></tr>
          <tr><td style="color: #888; vertical-align: top;">Message</td><td style="white-space: pre-wrap; line-height: 1.5;">${data.message}</td></tr>
        </table>
        <p style="font-size: 14px; line-height: 1.6; color: #666;">If you have any urgent inquiries, please feel free to call us directly.</p>
        <p style="font-size: 15px; line-height: 1.6;">Warm regards,<br><strong>The Nepali Restaurant &amp; Bar Team</strong></p>
      </td></tr>
      <tr><td style="background: #fafafa; padding: 16px 24px; text-align: center; font-size: 12px; color: #aaa;">
        Nepali Restaurant &amp; Bar — This is an automated response. Please do not reply to this email.
      </td></tr>
    </table>
  </td></tr></table>
</body>
</html>`
}