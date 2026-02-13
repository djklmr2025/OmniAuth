
import React, { useState } from 'react';
import { Scan, Upload, Loader2, AlertCircle } from 'lucide-react';
import { analyzeQRCodeImage } from '../services/geminiService';
import { parseOtpAuthUri } from '../services/otpService';
import { OTPAccount } from '../types';

interface QRScannerProps {
  onAdd: (account: OTPAccount) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onAdd }) => {
  const [status, setStatus] = useState<'idle' | 'scanning' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus('scanning');
    setErrorMessage('');

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target?.result as string;
        const base64Data = base64.split(',')[1];
        
        const uri = await analyzeQRCodeImage(base64Data);
        if (uri) {
          const parsed = parseOtpAuthUri(uri);
          if (parsed && parsed.secret) {
            onAdd({
              id: crypto.randomUUID(),
              issuer: parsed.issuer || 'Servicio Desconocido',
              account: parsed.account || 'Cuenta Desconocida',
              secret: parsed.secret,
              algorithm: parsed.algorithm || 'SHA1',
              digits: parsed.digits || 6,
              period: parsed.period || 30,
              createdAt: Date.now(),
            });
          } else {
            setStatus('error');
            setErrorMessage('No se encontraron datos válidos de 2FA en este código QR.');
          }
        } else {
          setStatus('error');
          setErrorMessage('La IA no pudo leer el código. Intenta con una imagen más clara.');
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      setStatus('error');
      setErrorMessage('Ocurrió un error inesperado al procesar la imagen.');
    }
  };

  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 text-center">
      <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-600 mx-auto mb-6 shadow-inner">
        {status === 'scanning' ? <Loader2 className="animate-spin" size={40} /> : <Scan size={40} />}
      </div>
      
      <h2 className="font-bold text-xl mb-2 tracking-tight">Escáner IA de QR</h2>
      <p className="text-sm text-slate-500 mb-8 max-w-[260px] mx-auto font-medium">
        Sube una captura de pantalla o foto del código QR de 2FA para que nuestra IA lo procese.
      </p>

      {status === 'error' && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-2xl flex items-center gap-3 text-left border border-red-100 animate-in fade-in zoom-in-95">
          <AlertCircle size={20} className="shrink-0" />
          <p className="text-xs font-bold leading-tight">{errorMessage}</p>
        </div>
      )}

      <label className="block cursor-pointer">
        <input 
          type="file" 
          accept="image/*" 
          className="hidden" 
          onChange={handleFileChange}
          disabled={status === 'scanning'}
        />
        <div className={`py-5 px-6 border-2 border-dashed rounded-2xl transition-all flex flex-col items-center gap-3 ${
          status === 'scanning' 
          ? 'bg-slate-50 border-slate-200 cursor-not-allowed opacity-50' 
          : 'bg-blue-50 border-blue-200 hover:border-blue-400 text-blue-700 hover:bg-blue-100/50'
        }`}>
          <Upload size={28} />
          <span className="font-bold text-sm tracking-wide">SELECCIONAR IMAGEN</span>
        </div>
      </label>

      <div className="mt-8 p-3 bg-slate-50 rounded-xl border border-slate-100">
        <p className="text-[10px] text-slate-400 leading-relaxed font-bold uppercase tracking-widest">
          Tecnología OmniAuth Vision AI
        </p>
        <p className="text-[9px] text-slate-300 mt-1">Detección de patrones de alta precisión</p>
      </div>
    </div>
  );
};

export default QRScanner;
