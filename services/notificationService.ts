import nodemailer from "nodemailer";
import twilio from "twilio";

// Email configuration
const emailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// SMS configuration
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export interface NotificationData {
  trackingNumber: string;
  recipientName: string;
  recipientEmail?: string;
  recipientPhone?: string;
  senderName: string;
  status: string;
  estimatedDelivery?: string;
  currentLocation?: string;
  agentName?: string;
  agentPhone?: string;
}

export class NotificationService {
  // Email templates
  private static getEmailTemplate(
    data: NotificationData,
    type: "status_update" | "pickup_confirmation" | "delivery_confirmation"
  ): { subject: string; html: string } {
    const baseStyle = `
      <style>
        .container { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #3b82f6; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background-color: #f8fafc; padding: 20px; border: 1px solid #e2e8f0; }
        .footer { background-color: #64748b; color: white; padding: 15px; border-radius: 0 0 8px 8px; text-align: center; }
        .status-badge { background-color: #10b981; color: white; padding: 5px 10px; border-radius: 4px; display: inline-block; }
        .info-row { margin: 10px 0; }
        .label { font-weight: bold; color: #374151; }
      </style>
    `;

    switch (type) {
      case "status_update":
        return {
          subject: `Parcel Update: ${
            data.trackingNumber
          } - ${this.getStatusLabel(data.status)}`,
          html: `
            ${baseStyle}
            <div class="container">
              <div class="header">
                <h1>📦 Parcel Status Update</h1>
              </div>
              <div class="content">
                <p>Hello ${data.recipientName},</p>
                <p>Your parcel has been updated:</p>
                
                <div class="info-row">
                  <span class="label">Tracking Number:</span> ${
                    data.trackingNumber
                  }
                </div>
                <div class="info-row">
                  <span class="label">Status:</span> <span class="status-badge">${this.getStatusLabel(
                    data.status
                  )}</span>
                </div>
                ${
                  data.currentLocation
                    ? `<div class="info-row"><span class="label">Current Location:</span> ${data.currentLocation}</div>`
                    : ""
                }
                ${
                  data.estimatedDelivery
                    ? `<div class="info-row"><span class="label">Estimated Delivery:</span> ${data.estimatedDelivery}</div>`
                    : ""
                }
                ${
                  data.agentName
                    ? `<div class="info-row"><span class="label">Assigned Agent:</span> ${data.agentName} (${data.agentPhone})</div>`
                    : ""
                }
                
                <p>You can track your parcel anytime at our tracking portal.</p>
              </div>
              <div class="footer">
                <p>© 2025 CourierPro - Professional Logistics Solutions</p>
              </div>
            </div>
          `,
        };

      case "pickup_confirmation":
        return {
          subject: `Pickup Confirmed: ${data.trackingNumber}`,
          html: `
            ${baseStyle}
            <div class="container">
              <div class="header">
                <h1>✅ Pickup Confirmed</h1>
              </div>
              <div class="content">
                <p>Hello ${data.recipientName},</p>
                <p>Great news! Your parcel has been picked up and is now on its way.</p>
                
                <div class="info-row">
                  <span class="label">Tracking Number:</span> ${
                    data.trackingNumber
                  }
                </div>
                <div class="info-row">
                  <span class="label">Picked up from:</span> ${data.senderName}
                </div>
                <div class="info-row">
                  <span class="label">Agent:</span> ${data.agentName} (${
            data.agentPhone
          })
                </div>
                ${
                  data.estimatedDelivery
                    ? `<div class="info-row"><span class="label">Estimated Delivery:</span> ${data.estimatedDelivery}</div>`
                    : ""
                }
                
                <p>Your parcel is now in transit and will be delivered soon!</p>
              </div>
              <div class="footer">
                <p>© 2025 CourierPro - Professional Logistics Solutions</p>
              </div>
            </div>
          `,
        };

      case "delivery_confirmation":
        return {
          subject: `Delivered: ${data.trackingNumber}`,
          html: `
            ${baseStyle}
            <div class="container">
              <div class="header">
                <h1>🎉 Package Delivered Successfully!</h1>
              </div>
              <div class="content">
                <p>Hello ${data.recipientName},</p>
                <p>Your parcel has been successfully delivered!</p>
                
                <div class="info-row">
                  <span class="label">Tracking Number:</span> ${
                    data.trackingNumber
                  }
                </div>
                <div class="info-row">
                  <span class="label">Delivered by:</span> ${data.agentName} (${
            data.agentPhone
          })
                </div>
                <div class="info-row">
                  <span class="label">Delivery Time:</span> ${new Date().toLocaleString()}
                </div>
                
                <p>Thank you for choosing CourierPro! We hope you're satisfied with our service.</p>
                <p>Please rate your experience and let us know how we did.</p>
              </div>
              <div class="footer">
                <p>© 2025 CourierPro - Professional Logistics Solutions</p>
              </div>
            </div>
          `,
        };

      default:
        throw new Error("Invalid email template type");
    }
  }

  // SMS templates
  private static getSMSTemplate(
    data: NotificationData,
    type: "status_update" | "pickup_confirmation" | "delivery_confirmation"
  ): string {
    switch (type) {
      case "status_update":
        return `CourierPro Update: Your parcel ${
          data.trackingNumber
        } is now ${this.getStatusLabel(data.status)}. ${
          data.estimatedDelivery
            ? `Est. delivery: ${data.estimatedDelivery}`
            : ""
        } Track online anytime.`;

      case "pickup_confirmation":
        return `CourierPro: Pickup confirmed! Your parcel ${
          data.trackingNumber
        } is now in transit. Agent: ${data.agentName} (${data.agentPhone}). ${
          data.estimatedDelivery
            ? `Est. delivery: ${data.estimatedDelivery}`
            : ""
        }`;

      case "delivery_confirmation":
        return `CourierPro: Package ${data.trackingNumber} delivered successfully by ${data.agentName}! Thank you for choosing us. Rate your experience online.`;

      default:
        throw new Error("Invalid SMS template type");
    }
  }

  private static getStatusLabel(status: string): string {
    const statusLabels: { [key: string]: string } = {
      pending: "Pending Pickup",
      assigned: "Assigned to Agent",
      "picked-up": "Picked Up",
      "in-transit": "In Transit",
      "out-for-delivery": "Out for Delivery",
      delivered: "Delivered",
      "failed-delivery": "Delivery Failed",
      returned: "Returned to Sender",
    };
    return statusLabels[status] || status;
  }

  // Send email notification
  static async sendEmail(
    data: NotificationData,
    type: "status_update" | "pickup_confirmation" | "delivery_confirmation"
  ): Promise<boolean> {
    if (!data.recipientEmail || !process.env.SMTP_USER) {
      console.log(
        "Email notification skipped: missing email or SMTP configuration"
      );
      return false;
    }

    try {
      const { subject, html } = this.getEmailTemplate(data, type);

      await emailTransporter.sendMail({
        from: `"CourierPro" <${process.env.SMTP_USER}>`,
        to: data.recipientEmail,
        subject,
        html,
      });

      console.log(
        `Email sent successfully to ${data.recipientEmail} for ${data.trackingNumber}`
      );
      return true;
    } catch (error) {
      console.error("Email sending failed:", error);
      return false;
    }
  }

  // Send SMS notification
  static async sendSMS(
    data: NotificationData,
    type: "status_update" | "pickup_confirmation" | "delivery_confirmation"
  ): Promise<boolean> {
    if (!data.recipientPhone || !process.env.TWILIO_ACCOUNT_SID) {
      console.log(
        "SMS notification skipped: missing phone or Twilio configuration"
      );
      return false;
    }

    try {
      const message = this.getSMSTemplate(data, type);

      await twilioClient.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: data.recipientPhone,
      });

      console.log(
        `SMS sent successfully to ${data.recipientPhone} for ${data.trackingNumber}`
      );
      return true;
    } catch (error) {
      console.error("SMS sending failed:", error);
      return false;
    }
  }

  // Send both email and SMS
  static async sendNotification(
    data: NotificationData,
    type: "status_update" | "pickup_confirmation" | "delivery_confirmation"
  ): Promise<{ email: boolean; sms: boolean }> {
    const [emailResult, smsResult] = await Promise.all([
      this.sendEmail(data, type),
      this.sendSMS(data, type),
    ]);

    return {
      email: emailResult,
      sms: smsResult,
    };
  }

  // Bulk notification for multiple recipients
  static async sendBulkNotifications(
    notifications: Array<{
      data: NotificationData;
      type: "status_update" | "pickup_confirmation" | "delivery_confirmation";
    }>
  ): Promise<Array<{ trackingNumber: string; email: boolean; sms: boolean }>> {
    const results = await Promise.all(
      notifications.map(async ({ data, type }) => {
        const result = await this.sendNotification(data, type);
        return {
          trackingNumber: data.trackingNumber,
          ...result,
        };
      })
    );

    return results;
  }
}
