import QRCode from "qrcode";

export interface QRCodeOptions {
  width?: number;
  height?: number;
  margin?: number;
  color?: {
    dark?: string;
    light?: string;
  };
  errorCorrectionLevel?: "L" | "M" | "Q" | "H";
}

/**
 * Generate QR code for parcel tracking
 * @param trackingNumber - The parcel tracking number
 * @param baseUrl - Base URL for the tracking page (optional)
 * @param options - QR code styling options
 * @returns Promise<string> - Base64 data URL of the QR code image
 */
export async function generateTrackingQRCode(
  trackingNumber: string,
  baseUrl?: string,
  options: QRCodeOptions = {}
): Promise<string> {
  const defaultOptions = {
    width: 256,
    height: 256,
    margin: 2,
    color: {
      dark: "#000000",
      light: "#FFFFFF",
    },
    errorCorrectionLevel: "M" as const,
    ...options,
  };

  // Generate tracking URL or just the tracking number
  const qrData = baseUrl
    ? `${baseUrl}/customer/tracking?trackingNumber=${trackingNumber}`
    : trackingNumber;

  try {
    const qrCodeDataUrl = await QRCode.toDataURL(qrData, defaultOptions);
    return qrCodeDataUrl;
  } catch (error) {
    console.error("Error generating QR code:", error);
    throw new Error("Failed to generate QR code");
  }
}

/**
 * Generate QR code as SVG string
 * @param trackingNumber - The parcel tracking number
 * @param baseUrl - Base URL for the tracking page (optional)
 * @param options - QR code styling options
 * @returns Promise<string> - SVG string of the QR code
 */
export async function generateTrackingQRCodeSVG(
  trackingNumber: string,
  baseUrl?: string,
  options: QRCodeOptions = {}
): Promise<string> {
  const defaultOptions = {
    width: 256,
    margin: 2,
    color: {
      dark: "#000000",
      light: "#FFFFFF",
    },
    errorCorrectionLevel: "M" as const,
    ...options,
  };

  const qrData = baseUrl
    ? `${baseUrl}/customer/tracking?trackingNumber=${trackingNumber}`
    : trackingNumber;

  try {
    const qrCodeSVG = await QRCode.toString(qrData, {
      type: "svg",
      ...defaultOptions,
    });
    return qrCodeSVG;
  } catch (error) {
    console.error("Error generating QR code SVG:", error);
    throw new Error("Failed to generate QR code SVG");
  }
}

/**
 * Generate QR code for parcel details (includes more information)
 * @param parcel - Parcel object with tracking details
 * @param baseUrl - Base URL for the tracking page
 * @param options - QR code styling options
 * @returns Promise<string> - Base64 data URL of the QR code image
 */
export async function generateParcelQRCode(
  parcel: {
    trackingNumber: string;
    _id: string;
    senderName?: string;
    recipientName?: string;
  },
  baseUrl: string,
  options: QRCodeOptions = {}
): Promise<string> {
  const qrData = JSON.stringify({
    trackingNumber: parcel.trackingNumber,
    parcelId: parcel._id,
    url: `${baseUrl}/customer/tracking?trackingNumber=${parcel.trackingNumber}`,
    sender: parcel.senderName,
    recipient: parcel.recipientName,
    generatedAt: new Date().toISOString(),
  });

  const defaultOptions = {
    width: 300,
    height: 300,
    margin: 3,
    color: {
      dark: "#1f2937",
      light: "#ffffff",
    },
    errorCorrectionLevel: "H" as const, // Higher error correction for more data
    ...options,
  };

  try {
    const qrCodeDataUrl = await QRCode.toDataURL(qrData, defaultOptions);
    return qrCodeDataUrl;
  } catch (error) {
    console.error("Error generating parcel QR code:", error);
    throw new Error("Failed to generate parcel QR code");
  }
}

/**
 * Download QR code as image file
 * @param dataUrl - Base64 data URL of the QR code
 * @param filename - Name for the downloaded file
 */
export function downloadQRCode(
  dataUrl: string,
  filename: string = "qr-code.png"
): void {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
