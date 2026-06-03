import { QRCodeCanvas } from "qrcode.react";

function QRDisplay() {
  const qrValue = " http://192.168.100.5:5173/check-in";

  return (
    <div className="flex flex-col items-center justify-center bg-white p-6 rounded-2xl shadow-lg">
      <h2 className="text-black text-lg font-semibold mb-4">
        Scan to Check In
      </h2>

      <QRCodeCanvas value={qrValue} size={220} />

      <p className="text-black mt-4 text-sm">
        Use your phone camera to scan
      </p>
    </div>
  );
}

export default QRDisplay;