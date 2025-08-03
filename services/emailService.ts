// Email service for sending QR codes
// This is a placeholder implementation - you'll need to configure with your email provider

export interface EmailQRCodeOptions {
  to: string;
  parcelDetails: {
    trackingNumber: string;
    recipientName: string;
    senderName: string;
    status: string;
  };
  qrCodeDataUrl: string;
  trackingUrl: string;
}

export interface BulkEmailQRCodeOptions {
  parcels: Array<{
    recipientEmail?: string;
    senderEmail?: string;
    trackingNumber: string;
    recipientName: string;
    senderName: string;
    status: string;
    qrCode: string;
    trackingUrl: string;
  }>;
  emailType: "recipient" | "sender" | "both";
}

export async function sendQRCodeEmail(
  options: EmailQRCodeOptions
): Promise<boolean> {
  try {
    // This is a placeholder implementation
    // You would integrate with services like:
    // - SendGrid
    // - Nodemailer with SMTP
    // - AWS SES
    // - Resend
    // - Postmark

    console.log("Sending QR code email to:", options.to);
    console.log("Parcel:", options.parcelDetails.trackingNumber);

    // Example with Nodemailer (commented out - needs configuration):
    /*
    const transporter = nodemailer.createTransporter({
      service: 'gmail', // or your email service
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: options.to,
      subject: `QR Code for Your Parcel - ${options.parcelDetails.trackingNumber}`,
      html: generateEmailTemplate(options),
      attachments: [
        {
          filename: `qr-${options.parcelDetails.trackingNumber}.png`,
          content: options.qrCodeDataUrl.split('base64,')[1],
          encoding: 'base64'
        }
      ]
    };

    await transporter.sendMail(mailOptions);
    */

    // Simulate email sending delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return true;
  } catch (error) {
    console.error("Failed to send QR code email:", error);
    return false;
  }
}

export async function sendBulkQRCodeEmails(
  options: BulkEmailQRCodeOptions
): Promise<{
  success: number;
  failed: number;
  results: Array<{ trackingNumber: string; success: boolean; error?: string }>;
}> {
  const results = [];
  let success = 0;
  let failed = 0;

  for (const parcel of options.parcels) {
    try {
      const emailPromises = [];

      if (options.emailType === "recipient" || options.emailType === "both") {
        if (parcel.recipientEmail) {
          emailPromises.push(
            sendQRCodeEmail({
              to: parcel.recipientEmail,
              parcelDetails: {
                trackingNumber: parcel.trackingNumber,
                recipientName: parcel.recipientName,
                senderName: parcel.senderName,
                status: parcel.status,
              },
              qrCodeDataUrl: parcel.qrCode,
              trackingUrl: parcel.trackingUrl,
            })
          );
        }
      }

      if (options.emailType === "sender" || options.emailType === "both") {
        if (parcel.senderEmail) {
          emailPromises.push(
            sendQRCodeEmail({
              to: parcel.senderEmail,
              parcelDetails: {
                trackingNumber: parcel.trackingNumber,
                recipientName: parcel.recipientName,
                senderName: parcel.senderName,
                status: parcel.status,
              },
              qrCodeDataUrl: parcel.qrCode,
              trackingUrl: parcel.trackingUrl,
            })
          );
        }
      }

      const emailResults = await Promise.allSettled(emailPromises);
      const allSuccessful = emailResults.every(
        (result) => result.status === "fulfilled" && result.value
      );

      if (allSuccessful) {
        success++;
        results.push({
          trackingNumber: parcel.trackingNumber,
          success: true,
        });
      } else {
        failed++;
        results.push({
          trackingNumber: parcel.trackingNumber,
          success: false,
          error: "Failed to send one or more emails",
        });
      }
    } catch (error) {
      failed++;
      results.push({
        trackingNumber: parcel.trackingNumber,
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  return { success, failed, results };
}

function generateEmailTemplate(options: EmailQRCodeOptions): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your Parcel QR Code</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: #2563eb;
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 8px 8px 0 0;
        }
        .content {
          background: #f8fafc;
          padding: 30px;
          border: 1px solid #e2e8f0;
        }
        .qr-container {
          text-align: center;
          margin: 20px 0;
          padding: 20px;
          background: white;
          border-radius: 8px;
        }
        .qr-code {
          max-width: 200px;
          height: auto;
        }
        .parcel-details {
          background: white;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          margin: 10px 0;
          padding: 8px 0;
          border-bottom: 1px solid #e2e8f0;
        }
        .track-button {
          display: inline-block;
          background: #2563eb;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 6px;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          color: #64748b;
          font-size: 14px;
          margin-top: 30px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Your Parcel QR Code</h1>
      </div>
      
      <div class="content">
        <p>Hello ${options.parcelDetails.recipientName},</p>
        
        <p>Here's your QR code for easy parcel tracking. You can scan this code with any QR code reader or smartphone camera to instantly track your parcel.</p>
        
        <div class="qr-container">
          <img src="${options.qrCodeDataUrl}" alt="QR Code" class="qr-code">
          <p><strong>Tracking Number: ${options.parcelDetails.trackingNumber}</strong></p>
        </div>
        
        <div class="parcel-details">
          <h3>Parcel Details</h3>
          <div class="detail-row">
            <strong>Tracking Number:</strong>
            <span>${options.parcelDetails.trackingNumber}</span>
          </div>
          <div class="detail-row">
            <strong>Sender:</strong>
            <span>${options.parcelDetails.senderName}</span>
          </div>
          <div class="detail-row">
            <strong>Recipient:</strong>
            <span>${options.parcelDetails.recipientName}</span>
          </div>
          <div class="detail-row">
            <strong>Current Status:</strong>
            <span>${options.parcelDetails.status}</span>
          </div>
        </div>
        
        <div style="text-align: center;">
          <a href="${options.trackingUrl}" class="track-button">Track Your Parcel Online</a>
        </div>
        
        <p><strong>How to use:</strong></p>
        <ul>
          <li>Open your smartphone camera app</li>
          <li>Point it at the QR code above</li>
          <li>Tap the notification to open the tracking page</li>
          <li>Or visit the link above to track manually</li>
        </ul>
      </div>
      
      <div class="footer">
        <p>This is an automated message from Bhejo Delivery Service.</p>
        <p>If you have any questions, please contact our support team.</p>
      </div>
    </body>
    </html>
  `;
}
