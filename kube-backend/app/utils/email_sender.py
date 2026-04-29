import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from app.config import settings


def send_otp_email(to_email: str, otp: str) -> bool:
    """Send OTP verification email. Falls back to console print in dev mode."""
    if not settings.SMTP_HOST or not settings.SMTP_USERNAME or "your_email" in settings.SMTP_USERNAME:
        # Dev mode: just print the OTP
        print(f"\n\n[DEV] OTP for {to_email}: {otp}\n\n")
        return True

    try:
        subject = "Your Kube Verification Code"
        html_body = f"""
        <!DOCTYPE html>
        <html>
        <body style="margin:0;padding:0;font-family:'Helvetica Neue',Arial,sans-serif;background:#f4f4f4;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 0;">
            <tr>
              <td align="center">
                <table width="480" cellpadding="0" cellspacing="0"
                  style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
                  <!-- Header -->
                  <tr>
                    <td style="background:linear-gradient(135deg,#1a1a2e 0%,#c8702a 100%);padding:32px 40px;text-align:center;">
                      <h1 style="margin:0;color:#ffffff;font-size:28px;letter-spacing:4px;font-weight:800;">KUBE</h1>
                      <p style="margin:6px 0 0;color:rgba(255,255,255,0.75);font-size:13px;">Verified Used Goods Marketplace</p>
                    </td>
                  </tr>
                  <!-- Body -->
                  <tr>
                    <td style="padding:40px;">
                      <h2 style="margin:0 0 12px;color:#1a1a2e;font-size:20px;">Verify your email address</h2>
                      <p style="margin:0 0 24px;color:#666;font-size:15px;line-height:1.6;">
                        Use the code below to complete your registration. This code expires in
                        <strong>5 minutes</strong>.
                      </p>
                      <!-- OTP Box -->
                      <div style="background:#f8f4f0;border:2px dashed #c8702a;border-radius:10px;
                                  padding:24px;text-align:center;margin-bottom:28px;">
                        <span style="font-size:42px;font-weight:900;letter-spacing:14px;color:#1a1a2e;
                                     font-family:'Courier New',monospace;">{otp}</span>
                      </div>
                      <p style="margin:0;color:#999;font-size:13px;line-height:1.6;">
                        If you did not create a Kube account, you can safely ignore this email.
                        Do not share this code with anyone.
                      </p>
                    </td>
                  </tr>
                  <!-- Footer -->
                  <tr>
                    <td style="background:#f8f4f0;padding:20px 40px;text-align:center;">
                      <p style="margin:0;color:#bbb;font-size:12px;">&copy; 2026 Kube Marketplace. All rights reserved.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
        """

        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = f"Kube <{settings.SMTP_USERNAME}>"
        msg["To"] = to_email
        msg.attach(MIMEText(html_body, "html"))

        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=5) as server:
            server.ehlo()
            server.starttls()
            server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
            server.sendmail(settings.SMTP_USERNAME, to_email, msg.as_string())

        return True

    except Exception as e:
        print(f"[EMAIL ERROR] Failed to send OTP to {to_email}: {e}")
        return False
