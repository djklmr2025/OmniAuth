
import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  Plus, 
  Scan, 
  Settings, 
  Trash2, 
  Copy, 
  Check, 
  AlertCircle,
  HelpCircle,
  ChevronLeft,
  Search,
  Lock,
  Unlock,
  LogOut,
  Download,
  Upload
} from 'lucide-react';
import { OTPAccount, AppView, OTPCode } from './types';
import { generateCode } from './services/otpService';
import AddOTPForm from './components/AddOTPForm';
import QRScanner from './components/QRScanner';
import AIConsultant from './components/AIConsultant';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.DASHBOARD);
  const [accounts, setAccounts] = useState<OTPAccount[]>([]);
  const [codes, setCodes] = useState<Record<string, OTPCode>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  const [pin, setPin] = useState<string | null>(localStorage.getItem('omniauth_pin'));
  const [isLocked, setIsLocked] = useState<boolean>(!!localStorage.getItem('omniauth_pin'));
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('omniauth_accounts');
    if (saved) {
      try { setAccounts(JSON.parse(saved)); } catch (e) { console.error("Error cargando cuentas", e); }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('omniauth_accounts', JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    if (isLocked) return;
    const updateCodes = () => {
      const newCodes: Record<string, OTPCode> = {};
      accounts.forEach(acc => { newCodes[acc.id] = generateCode(acc); });
      setCodes(newCodes);
    };
    updateCodes();
    const interval = setInterval(updateCodes, 1000);
    return () => clearInterval(interval);
  }, [accounts, isLocked]);

  useEffect(() => {
    if (!isLocked) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        if (pinInput.length < 4) setPinInput(prev => prev + e.key);
      } else if (e.key === 'Backspace') {
        setPinInput(prev => prev.slice(0, -1));
      } else if (e.key === 'Enter' && pinInput.length === 4) {
        attemptLogin(pinInput);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLocked, pinInput]);

  const attemptLogin = (input: string) => {
    if (input === pin) {
      setIsLocked(false);
      setPinInput('');
      setPinError(false);
    } else {
      setPinError(true);
      setPinInput('');
      setTimeout(() => setPinError(false), 800);
    }
  };

  const exportData = () => {
    const dataStr = JSON.stringify(accounts, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `omniauth_backup_${new Date().toISOString().split('T')[0]}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (Array.isArray(imported)) {
          if (confirm(`Se han detectado ${imported.length} cuentas. ¿Deseas importarlas?`)) {
            setAccounts(prev => [...prev, ...imported]);
            alert('Cuentas importadas exitosamente.');
          }
        }
      } catch (err) {
        alert('Archivo de respaldo no válido.');
      }
    };
    reader.readAsText(file);
  };

  const handleAddAccount = (account: OTPAccount) => {
    setAccounts(prev => [...prev, account]);
    setView(AppView.DASHBOARD);
  };

  if (isLocked) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-white font-sans overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(37,99,235,0.15),transparent)] pointer-events-none" />
        <div className="w-full max-w-sm flex flex-col items-center relative z-10">
          <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center mb-6 shadow-2xl shadow-blue-500/40 transform rotate-3 hover:rotate-0 transition-transform duration-500">
            <Lock size={40} />
          </div>
          <h1 className="text-2xl font-bold mb-1 tracking-tight">OmniAuth Login</h1>
          <p className="text-slate-400 text-sm mb-10 font-medium">Acceso Protegido por NIP</p>
          
          <div className="flex justify-center gap-6 mb-12">
            {[0, 1, 2, 3].map((_, i) => (
              <div key={i} className={`w-3.5 h-3.5 rounded-full border-2 transition-all duration-300 ${pinInput.length > i ? 'bg-blue-500 border-blue-500 scale-125 shadow-[0_0_15px_rgba(59,130,246,0.6)]' : 'bg-white/10 border-white/20'} ${pinError ? 'bg-red-500 border-red-500 animate-pulse' : ''}`} />
            ))}
          </div>

          <div className="grid grid-cols-3 gap-3 w-full">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, 'OK'].map((btn) => (
              <button
                key={btn}
                onClick={() => {
                  if (btn === 'C') setPinInput('');
                  else if (btn === 'OK') { if(pinInput.length === 4) attemptLogin(pinInput); }
                  else if (pinInput.length < 4) setPinInput(p => p + btn);
                }}
                className={`h-16 rounded-2xl font-bold text-xl flex items-center justify-center transition-all ${btn === 'OK' ? (pinInput.length === 4 ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-white/5 text-slate-600 cursor-not-allowed') : 'bg-white/5 hover:bg-white/10 active:scale-95 border border-white/5'}`}
              >
                {btn}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center">
      <header className="w-full max-w-md bg-white shadow-sm border-b sticky top-0 z-10 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
            <ShieldCheck size={24} />
          </div>
          <div><h1 className="font-bold text-lg leading-tight">OmniAuth</h1><p className="text-xs text-slate-500 font-medium tracking-wide uppercase">Autenticador</p></div>
        </div>
        <div className="flex gap-1">
          <button onClick={() => setView(AppView.AI_HELP)} className="p-2 hover:bg-slate-100 rounded-full text-slate-600" title="Ayuda IA"><HelpCircle size={20} /></button>
          <button onClick={() => setView(AppView.SETTINGS)} className="p-2 hover:bg-slate-100 rounded-full text-slate-600" title="Ajustes"><Settings size={20} /></button>
          {pin && <button onClick={() => setIsLocked(true)} className="p-2 hover:bg-red-50 rounded-full text-red-500" title="Bloquear"><LogOut size={20} /></button>}
        </div>
      </header>

      <main className="w-full max-w-md flex-1 p-4 pb-24">
        {view === AppView.DASHBOARD && (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="text" placeholder="Buscar cuentas..." className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm font-medium" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>

            {accounts.length === 0 ? (
              <div className="text-center py-16 px-6">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                  <ShieldCheck size={32} />
                </div>
                <h3 className="font-bold text-slate-800">No hay cuentas</h3>
                <p className="text-sm text-slate-500 mt-1">Añade tu primera cuenta para generar códigos de verificación.</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {accounts.filter(acc => acc.issuer.toLowerCase().includes(searchQuery.toLowerCase()) || acc.account.toLowerCase().includes(searchQuery.toLowerCase())).map(acc => {
                  const codeData = codes[acc.id];
                  const progress = codeData ? (codeData.remainingTime / acc.period) * 100 : 0;
                  return (
                    <div key={acc.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-[10px] font-bold uppercase text-blue-600 mb-0.5 tracking-widest">{acc.issuer}</p>
                          <p className="text-sm text-slate-500 font-semibold truncate max-w-[220px]">{acc.account}</p>
                        </div>
                        <button onClick={() => { if(confirm(`¿Eliminar ${acc.issuer}?`)) setAccounts(accounts.filter(a => a.id !== acc.id)); }} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"><Trash2 size={16} /></button>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="text-3xl font-mono font-bold tracking-[0.2em] text-slate-800 flex items-center gap-2 cursor-pointer active:scale-95 transition-transform" onClick={() => { if(codeData) { navigator.clipboard.writeText(codeData.code); setCopiedId(acc.id); setTimeout(() => setCopiedId(null), 2000); } }}>
                          {codeData ? codeData.code.replace(/(\d{3})(\d{3})/, '$1 $2') : '------'}
                          {copiedId === acc.id ? <Check size={20} className="text-green-500" /> : <Copy size={14} className="text-slate-200 group-hover:text-blue-200 transition-colors" />}
                        </div>
                        <div className="relative w-9 h-9">
                          <svg className="w-full h-full transform -rotate-90"><circle cx="18" cy="18" r="16" fill="none" stroke="#f1f5f9" strokeWidth="3" /><circle cx="18" cy="18" r="16" fill="none" stroke={progress < 20 ? "#ef4444" : "#2563eb"} strokeWidth="3" strokeDasharray={100} strokeDashoffset={100 - (100 * progress) / 100} className="transition-all duration-1000 ease-linear" /></svg>
                          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-slate-400">{codeData?.remainingTime}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {view === AppView.ADD_MANUAL && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <button onClick={() => setView(AppView.DASHBOARD)} className="flex items-center gap-1 text-slate-500 mb-6 font-bold text-sm hover:text-slate-800 transition-colors"><ChevronLeft size={16} /> VOLVER AL PANEL</button>
            <AddOTPForm onAdd={handleAddAccount} />
          </div>
        )}
        
        {view === AppView.ADD_QR && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <button onClick={() => setView(AppView.DASHBOARD)} className="flex items-center gap-1 text-slate-500 mb-6 font-bold text-sm hover:text-slate-800 transition-colors"><ChevronLeft size={16} /> VOLVER AL PANEL</button>
            <QRScanner onAdd={handleAddAccount} />
          </div>
        )}

        {view === AppView.AI_HELP && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <button onClick={() => setView(AppView.DASHBOARD)} className="flex items-center gap-1 text-slate-500 mb-6 font-bold text-sm hover:text-slate-800 transition-colors"><ChevronLeft size={16} /> VOLVER AL PANEL</button>
            <AIConsultant />
          </div>
        )}

        {view === AppView.SETTINGS && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-4">
            <button onClick={() => setView(AppView.DASHBOARD)} className="flex items-center gap-1 text-slate-500 mb-6 font-bold text-sm hover:text-slate-800 transition-colors"><ChevronLeft size={16} /> VOLVER AL PANEL</button>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
              <h2 className="font-bold text-xl tracking-tight">Ajustes del Sistema</h2>
              
              <div className="space-y-6">
                <section className="space-y-3">
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Seguridad de Acceso</h3>
                  {!pin ? (
                    <button onClick={() => { const p = prompt('Crea un NIP de 4 dígitos:'); if(p?.length === 4) { localStorage.setItem('omniauth_pin', p); setPin(p); alert('¡NIP Activado!'); } }} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-100 hover:bg-blue-700 transition-colors">Activar Bloqueo por NIP</button>
                  ) : (
                    <div className="flex gap-2">
                      <div className="flex-1 p-3 bg-green-50 text-green-700 rounded-xl text-xs font-bold flex items-center justify-center border border-green-100"><Unlock size={14} className="mr-2"/> NIP ACTIVADO</div>
                      <button onClick={() => { if(confirm('¿Desactivar NIP? Tu seguridad disminuirá.')) { localStorage.removeItem('omniauth_pin'); setPin(null); } }} className="px-4 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-xs hover:bg-red-50 hover:text-red-500 transition-colors">ELIMINAR</button>
                    </div>
                  )}
                </section>

                <section className="space-y-3">
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Copia de Seguridad</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={exportData} className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-blue-50 hover:border-blue-100 transition-all gap-2 group">
                      <Download size={22} className="text-slate-400 group-hover:text-blue-500" />
                      <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">Exportar</span>
                    </button>
                    <button onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-blue-50 hover:border-blue-100 transition-all gap-2 group">
                      <Upload size={22} className="text-slate-400 group-hover:text-blue-500" />
                      <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">Importar</span>
                    </button>
                    <input type="file" ref={fileInputRef} onChange={importData} accept=".json" className="hidden" />
                  </div>
                  <div className="p-3 bg-amber-50 rounded-xl text-[10px] text-amber-800 border border-amber-100 leading-normal font-medium">
                    <AlertCircle size={12} className="inline mr-1 mb-0.5" /> Los datos se almacenan localmente. Exporta un respaldo si vas a cambiar de dispositivo o limpiar el navegador.
                  </div>
                </section>
                
                <section className="pt-4 border-t border-slate-50 text-center">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">OmniAuth Secure v1.2.0</p>
                  <p className="text-[9px] text-slate-300 mt-1">Desarrollado para máxima privacidad</p>
                </section>
              </div>
            </div>
          </div>
        )}
      </main>

      {view === AppView.DASHBOARD && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-md px-4 flex gap-2 animate-in fade-in slide-in-from-bottom-8 duration-500">
          <button onClick={() => setView(AppView.ADD_QR)} className="flex-1 py-4 bg-white text-blue-700 rounded-2xl font-bold text-sm shadow-xl flex items-center justify-center gap-2 border border-slate-100 active:scale-95 transition-all hover:bg-slate-50"><Scan size={18} /> QR AI SCAN</button>
          <button onClick={() => setView(AppView.ADD_MANUAL)} className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold text-sm shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all hover:bg-blue-700 shadow-blue-200"><Plus size={18} /> CLAVE MANUAL</button>
        </div>
      )}
    </div>
  );
};

export default App;
