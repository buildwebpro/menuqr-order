"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Download } from "lucide-react";
import { Button } from "./ui/button";
import { th } from "@/lib/i18n";

interface QRCodeDisplayProps {
  url: string;
  restaurantName: string;
}

export function QRCodeDisplay({ url, restaurantName }: QRCodeDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dataUrl, setDataUrl] = useState<string>("");

  useEffect(() => {
    if (!canvasRef.current) return;
    QRCode.toCanvas(canvasRef.current, url, {
      width: 280,
      margin: 2,
      color: { dark: "#1a1a1a", light: "#ffffff" },
    }).then(() => {
      setDataUrl(canvasRef.current?.toDataURL("image/png") || "");
    });
  }, [url]);

  const handleDownload = () => {
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `${restaurantName.replace(/\s+/g, "-").toLowerCase()}-qr-code.png`;
    a.click();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 inline-flex">
        <canvas ref={canvasRef} />
      </div>
      <p className="text-sm text-gray-500 text-center max-w-xs">
        สแกน QR Code นี้เพื่อดูเมนูสำหรับ <strong>{restaurantName}</strong>
      </p>
      <Button
        onClick={handleDownload}
        disabled={!dataUrl}
        variant="outline"
        size="md"
      >
        <Download size={16} />
        {th.qrCode.download}
      </Button>
    </div>
  );
}
