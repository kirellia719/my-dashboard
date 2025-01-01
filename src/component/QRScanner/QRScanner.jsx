import "./QRScanner.scss";
import { useRef, useEffect } from "react";
import QrScanner from "qr-scanner";

const QRScanner = ({ onScan, onError }) => {
   const videoRef = useRef(null);
   const qrScannerRef = useRef(null);

   const startScanner = () => {
      if (videoRef.current && !qrScannerRef.current) {
         qrScannerRef.current = new QrScanner(videoRef.current, onScanSuccess, {
            onDecodeError: onScanError,
            highlightScanRegion: true,
         });
         qrScannerRef.current.start(); // Bắt đầu quét
      }
   };

   const onScanSuccess = (result) => {
      onScan && onScan(result);
   };

   const onScanError = (error) => {
      onError && onError(error);
   };

   useEffect(() => {
      startScanner();

      return () => {
         qrScannerRef.current?.destroy(); // Dọn dẹp khi component unmount
         qrScannerRef.current = null;
      };
   }, []);

   return (
      <div className="qr-scanner">
         <video ref={videoRef} style={{ width: "100%", border: "1px solid black" }} playsInline />
      </div>
   );
};

export default QRScanner;
