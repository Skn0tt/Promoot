import * as QRCode from "qrcode";

export const renderQrCode = async (url: string) => {
  const dataUrl: string = await QRCode.toDataURL(
    url,
    {
      errorCorrectionLevel: "Q",
      type: "image/png"
    }
  );

  return dataUrl;
}