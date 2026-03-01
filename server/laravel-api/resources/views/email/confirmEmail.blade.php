<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>Confirmation Code</title>
    </head>
    <body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="padding:20px 0 40px 0;">
            <tr>
                <td align="center">
                    <table width="500" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom: 20px;">
                        <tr>
                            <td align="left" style="padding: 0 10px;">
                                <span style="font-size: 20px; font-weight: bold; color: #111827;">Tawassol</span>
                            </td>
                            <td align="right" style="padding: 0 10px;">
                                <a href="http://localhost:3000" style="color: #4F46E5; text-decoration: none; font-size: 14px; font-weight: 500;">
                                    Visit Website &rarr;
                                </a>
                            </td>
                        </tr>
                    </table>

                    <table width="500" cellpadding="0" cellspacing="0" role="presentation"
                        style="background:#ffffff;border-radius:10px;padding:40px;text-align:center;box-shadow:0 5px 20px rgba(0,0,0,0.05);">
                        <tr>
                            <td>
                                <h2 style="margin:0 0 20px 0;color:#111827;">
                                    Confirm Your Email
                                </h2>
                                <p style="color:#6b7280;font-size:15px;margin-bottom:25px;">
                                    Use the 6-digit code below to verify your account.
                                </p>

                                <div style="
                                    font-size:42px;
                                    letter-spacing:12px;
                                    font-weight:700;
                                    font-family: 'Courier New', monospace;
                                    background:#f9fafb;
                                    padding:20px 30px;
                                    border-radius:8px;
                                    color:#111827;
                                    display:inline-block;
                                ">
                                    {{$code}}
                                </div>

                                <p style="margin-top:30px;font-size:13px;color:#9ca3af;">
                                    This code will expire in 10 minutes.
                                </p>
                </td>
            </tr>
        </table>

                </td>
            </tr>
        </table>

    </body>
</html>
