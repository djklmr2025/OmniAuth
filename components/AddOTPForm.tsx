
import React, { useState } from 'react';
import { OTPAccount } from '../types';
import { Shield, Key, User, Landmark } from 'lucide-react';

interface AddOTPFormProps {
  onAdd: (account: OTPAccount) => void;
}

const AddOTPForm: React.FC<AddOTPFormProps> = ({ onAdd }) => {
  const [issuer, setIssuer] = useState('');
  const [account, setAccount] = useState('');
  const [secret, setSecret] = useState('');
  const [digits, setDigits] = useState(6);
  const [period, setPeriod] = useState(30);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issuer || !account || !secret) return;

    const newAccount: OTPAccount = {
      id: crypto.randomUUID(),
      issuer,
      account,
      secret: secret.replace(/\s/g, '').toUpperCase(),
      algorithm: 'SHA1',
      digits,
      period,
      createdAt: Date.now(),
    };

    onAdd(newAccount);
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
          <Key size={24} />
        </div>
        <div>
          <h2 className="font-bold text-lg tracking-tight">Registro Manual</h2>
          <p className="text-xs text-slate-500 font-medium">Introduce la llave secreta del servicio</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Proveedor / Servicio</label>
          <div className="relative">
            <Landmark className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input 
              required
              type="text" 
              placeholder="Ej: Google, GitHub, Coinbase" 
              className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-sm"
              value={issuer}
              onChange={(e) => setIssuer(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Cuenta / Correo</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input 
              required
              type="text" 
              placeholder="usuario@ejemplo.com" 
              className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-sm"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Código Secreto (Secret Key)</label>
          <div className="relative">
            <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input 
              required
              type="text" 
              placeholder="JBSWY3DPEHPK3PXP" 
              className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono tracking-widest text-sm uppercase"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Dígitos</label>
            <select 
              className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-sm cursor-pointer"
              value={digits}
              onChange={(e) => setDigits(Number(e.target.value))}
            >
              <option value={6}>6 Dígitos</option>
              <option value={8}>8 Dígitos</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Periodo (Seg)</label>
            <select 
              className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-sm cursor-pointer"
              value={period}
              onChange={(e) => setPeriod(Number(e.target.value))}
            >
              <option value={30}>30 Segundos</option>
              <option value={60}>60 Segundos</option>
            </select>
          </div>
        </div>

        <button 
          type="submit"
          className="w-full mt-4 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          Guardar Cuenta
        </button>
      </form>
    </div>
  );
};

export default AddOTPForm;
