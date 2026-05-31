import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Mic, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  CreditCard, 
  ArrowRight,
  Info
} from 'lucide-react';

function TransferPage() {
  const navigate = useNavigate();

  // 1. SYSTEM STATES
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [step, setStep] = useState(1); 

  // 2. TRANSACTION STATES
  const [accountNumber, setAccountNumber] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('Transfer via VoiceBank');
  const [error, setError] = useState('');

  // 3. VOICE LISTENING STATES
  const [isListening, setIsListening] = useState(false);
  const [voiceText, setVoiceText] = useState('Mendengarkan...');
  const [voicePulse, setVoicePulse] = useState(false);

  // Mock Database / Saved Recipients History
  const recipientHistory = [
    { name: 'Budi Santoso', accNo: '82938102', initial: 'BS' },
    { name: 'Ani Wijaya', accNo: '10294820', initial: 'AW' },
    { name: 'Candra Kirana', accNo: '93028472', initial: 'CK' },
    { name: 'Dewi Lestari', accNo: '48201948', initial: 'DL' },
  ];

  const amountShortcuts = [50000, 100000, 250000, 500000];

  useEffect(() => {
    const matched = recipientHistory.find(r => r.accNo === accountNumber.trim());
    if (matched) {
      setRecipientName(matched.name);
    } else if (accountNumber.trim().length > 4) {
      setRecipientName(`Rekening Asing (${accountNumber})`);
    } else {
      setRecipientName('');
    }
  }, [accountNumber]);

  useEffect(() => {
    let timer1, timer2, timer3;

    if (isListening) {
      setVoicePulse(true);
      setVoiceText('Silakan bicara...');

      timer1 = setTimeout(() => {
        setVoiceText('"Kirim ke Budi..."');
      }, 1200);

      timer2 = setTimeout(() => {
        setVoiceText('"Kirim ke Budi Santoso (82938102)"');
        setVoicePulse(false);
      }, 2500);

      timer3 = setTimeout(() => {
        setAccountNumber('82938102');
        setRecipientName('Budi Santoso');
        setIsListening(false);
        setStep(2); 
      }, 3800);
    }

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [isListening]);

  const handleSelectHistory = (contact) => {
    setAccountNumber(contact.accNo);
    setRecipientName(contact.name);
    setError('');
    setStep(2); 
  };

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setAmount(value);
    setError('');
  };

  const handleAddAmount = (value) => {
    const currentVal = parseInt(amount || '0', 10);
    setAmount((currentVal + value).toString());
    setError('');
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!accountNumber.trim()) {
        setError('Silakan masukkan nomor rekening tujuan.');
        return;
      }
      setError('');
      setStep(2);
    } else if (step === 2) {
      if (!amount || parseFloat(amount) <= 0) {
        setError('Nominal transfer harus lebih besar dari Rp0.');
        return;
      }
      setError('');
      setStep(3);
    } else if (step === 3) {
      setError('');
      setStep(4); 
    }
  };

  const handleReset = () => {
    setAccountNumber('');
    setRecipientName('');
    setAmount('');
    setNote('Transfer via VoiceBank');
    setError('');
    setStep(1);
  };

  return (
    <div className="w-full flex-1 flex flex-col bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 p-8 transition-all duration-300">
      
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-800 mb-8">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => {
              if (step > 1 && step < 4) {
                setStep(step - 1);
              } else {
                navigate('/dashboard');
              }
            }}
            className="p-2 -ml-2 rounded-full hover:bg-slate-800 text-gray-400 hover:text-white transition"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-3xl font-bold text-white tracking-wide">Transfer Dana</h2>
        </div>

        {/* VOICE MODE TOGGLE */}
        <div className="flex items-center space-x-3 bg-slate-950 px-5 py-3 rounded-full border border-slate-800">
          <span className="text-sm font-bold text-gray-400 tracking-wider">Mode Suara</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer"
              checked={voiceEnabled}
              onChange={() => {
                setVoiceEnabled(!voiceEnabled);
                handleReset(); 
              }}
            />
            <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
          </label>
        </div>
      </div>

      {/* ERROR ALERT */}
      {error && (
        <div className="bg-amber-950/20 border border-amber-900/30 text-amber-200 text-sm px-5 py-4 rounded-xl flex items-start space-x-3 mb-6 animate-fadeIn">
          <Info className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. MANUAL TRANSFER FLOW */}
      {/* ========================================================================= */}
      {!voiceEnabled && (
        <div className="flex-1 flex flex-col">
          
          {/* STEP 1: ACCOUNT NUMBER INPUT (ATAS) + RIWAYAT (BAWAH) */}
          {step === 1 && (
            <div className="flex-1 flex flex-col space-y-8 animate-fadeIn max-w-5xl mx-auto w-full">
              
              {/* Top: Input Panel */}
              <div className="bg-slate-950 border border-slate-800 p-8 rounded-2xl flex flex-col space-y-6 shrink-0">
                <h3 className="text-base font-semibold text-gray-400 uppercase tracking-wider">Tujuan Transfer</h3>
                
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider">Nomor Rekening</label>
                  <div className="relative">
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={accountNumber}
                      onChange={(e) => {
                        setAccountNumber(e.target.value.replace(/[^0-9]/g, ''));
                        setError('');
                      }}
                      placeholder="Masukkan nomor rekening tujuan"
                      className="w-full bg-slate-900 border border-slate-700 focus:border-red-500 focus:ring-1 focus:ring-red-500 rounded-xl p-5 pr-12 text-white placeholder-gray-600 focus:outline-none transition-all text-lg font-medium"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-5 text-gray-500">
                      <CreditCard className="w-6 h-6" />
                    </div>
                  </div>
                  {recipientName && (
                    <p className="text-sm text-red-500 font-semibold mt-2 animate-fadeIn">
                      Nama Pemilik: {recipientName}
                    </p>
                  )}
                </div>

                <button
                  onClick={handleNextStep}
                  className="w-full py-5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition active:scale-[0.98] shadow-lg shadow-red-900/20 flex items-center justify-center space-x-2 text-lg tracking-wide"
                >
                  <span>Lanjut</span>
                  <ArrowRight className="w-6 h-6" />
                </button>
              </div>

              {/* Bottom: Recipient History */}
              <div className="flex flex-col space-y-5 flex-1">
                <div className="flex items-center space-x-2 text-gray-400 pl-2">
                  <Clock className="w-5 h-5 text-gray-500" />
                  <span className="text-sm font-semibold uppercase tracking-wider">Riwayat Penerima</span>
                </div>
                
                {/* Grid diubah menjadi 4 kolom di layar besar agar tidak terlalu memanjang ke bawah */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 auto-rows-max">
                  {recipientHistory.map((contact, idx) => (
                    <div 
                      key={idx}
                      onClick={() => handleSelectHistory(contact)}
                      className="flex items-center space-x-4 p-5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl cursor-pointer transition active:scale-[0.99] group shadow-sm"
                    >
                      <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center font-bold text-white text-base flex-shrink-0">
                        {contact.initial}
                      </div>
                      <div className="overflow-hidden">
                        <h4 className="text-base font-semibold text-white group-hover:text-red-500 transition-colors truncate">{contact.name}</h4>
                        <p className="text-sm text-gray-500 mt-1 font-mono truncate">{contact.accNo}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* STEP 2: AMOUNT INPUT + NOTE SPLIT */}
          {step === 2 && (
            <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-8 items-stretch animate-fadeIn">
              
              {/* Left Column: Recipient Details */}
              <div className="xl:col-span-5 h-full">
                <div className="h-full bg-slate-950 border border-slate-800 p-8 rounded-2xl flex flex-col space-y-6">
                  <h3 className="text-base font-semibold text-gray-400 uppercase tracking-wider">Penerima Transfer</h3>
                  
                  <div className="pb-6 border-b border-slate-800 flex items-center space-x-5">
                    <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center font-extrabold text-white text-xl">
                      {recipientName ? recipientName.split(' ').map(n=>n[0]).join('') : 'U'}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white">{recipientName}</h4>
                      <p className="text-sm text-gray-500 mt-1 font-mono">Rekening: {accountNumber}</p>
                    </div>
                  </div>

                  <div className="space-y-4 flex-1 pt-2">
                    <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider">Catatan (Opsional)</label>
                    <input
                      type="text"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Tulis keterangan transfer"
                      className="w-full bg-slate-900 border border-slate-700 focus:border-red-500 focus:ring-1 focus:ring-red-500 rounded-xl p-5 text-white placeholder-gray-600 text-base focus:outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Nominal Input */}
              <div className="xl:col-span-7 h-full">
                <div className="h-full bg-slate-950 border border-slate-800 p-8 rounded-2xl flex flex-col space-y-8">
                  <h3 className="text-base font-semibold text-gray-400 uppercase tracking-wider">Nominal Saldo</h3>
                  
                  <div className="space-y-4">
                    <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider">Jumlah Transfer</label>
                    <div className="relative flex items-center bg-slate-900 border border-slate-700 focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500 rounded-xl p-6 transition-all">
                      <span className="text-3xl font-bold text-gray-400 pr-5 border-r border-slate-700 select-none">Rp</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={amount}
                        onChange={handleAmountChange}
                        placeholder="0"
                        className="w-full bg-transparent border-none text-white text-4xl font-bold font-mono tracking-wide placeholder-gray-800 focus:outline-none p-0 focus:ring-0 pl-5"
                      />
                    </div>
                    {amount && (
                      <p className="text-sm text-gray-400 font-semibold pl-2 animate-fadeIn">
                        ≈ Rp {parseInt(amount, 10).toLocaleString('id-ID')}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-4 gap-4 pt-2">
                    {amountShortcuts.map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => handleAddAmount(value)}
                        className="bg-transparent border border-slate-700 text-sm font-semibold py-4 rounded-xl text-gray-300 hover:bg-slate-800 hover:text-white transition active:scale-95"
                      >
                        +{(value / 1000)}k
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleNextStep}
                    className="w-full py-5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl mt-auto transition active:scale-[0.98] shadow-lg shadow-red-900/20 flex items-center justify-center space-x-2 text-lg tracking-wide"
                  >
                    <span>Lanjut ke Konfirmasi</span>
                    <ArrowRight className="w-6 h-6" />
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* STEP 3: CONFIRMATION */}
          {step === 3 && (
            <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-8 items-start animate-fadeIn max-w-6xl mx-auto w-full">
              
              <div className="xl:col-span-7 h-full">
                <div className="h-full bg-slate-950 border border-slate-800 p-8 rounded-2xl space-y-6 flex flex-col">
                  <h3 className="text-base font-semibold text-gray-400 uppercase tracking-wider border-b border-slate-800 pb-4">Detail Rekening & Pengiriman</h3>
                  
                  <div className="space-y-6 text-base pt-2 flex-1">
                    <div className="flex justify-between py-3 border-b border-slate-900">
                      <span className="text-gray-500">Pemilik Rekening</span>
                      <span className="font-semibold text-white">{recipientName}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-slate-900">
                      <span className="text-gray-500">Nomor Rekening Tujuan</span>
                      <span className="font-mono text-gray-300">{accountNumber}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-slate-900">
                      <span className="text-gray-500">Catatan Pesan</span>
                      <span className="text-gray-300">{note || '-'}</span>
                    </div>
                    <div className="flex justify-between py-3 text-sm text-gray-500 pt-2">
                      <span>Biaya Administrasi</span>
                      <span className="text-green-500 font-bold uppercase">GRATIS</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="xl:col-span-5 h-full">
                <div className="h-full bg-slate-950 border border-slate-800 p-8 rounded-2xl flex flex-col space-y-8">
                  <div className="text-center space-y-3 pt-4">
                    <p className="text-sm text-gray-500 uppercase font-semibold">Total Nominal Transfer</p>
                    <h4 className="text-4xl font-extrabold text-white">Rp {parseInt(amount, 10).toLocaleString('id-ID')}</h4>
                  </div>

                  <div className="bg-slate-900/50 p-5 rounded-xl border border-slate-850 text-sm text-gray-400 leading-relaxed mt-auto">
                    Pastikan semua informasi di sebelah kiri sudah benar sebelum menekan tombol transfer di bawah. Transaksi yang telah diproses tidak dapat dibatalkan.
                  </div>

                  <button
                    onClick={handleNextStep}
                    className="w-full py-5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition active:scale-[0.98] shadow-lg shadow-red-950/20 text-lg font-semibold mt-4"
                  >
                    Transfer Sekarang
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* STEP 4: SUCCESS */}
          {step === 4 && (
            <div className="w-full max-w-3xl mx-auto bg-slate-950 border border-slate-800 p-10 rounded-2xl text-center animate-scaleUp my-auto">
              <div className="flex justify-center mb-6">
                <CheckCircle2 className="w-20 h-20 text-green-500 animate-pulse" />
              </div>
              
              <div>
                <h3 className="text-3xl font-bold text-white">Transfer Berhasil</h3>
                <p className="text-sm text-gray-400 mt-2">Transaksi Anda telah sukses diproses oleh VoiceBank</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-left text-base space-y-5 my-8">
                <div className="flex justify-between">
                  <span className="text-gray-500">Nomor Referensi</span>
                  <span className="font-mono text-gray-300">TX-910283019</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Penerima</span>
                  <span className="font-semibold text-white">{recipientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Rekening Tujuan</span>
                  <span className="font-mono text-gray-300">{accountNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Catatan</span>
                  <span className="text-gray-300">{note || '-'}</span>
                </div>
                <div className="flex justify-between border-t border-slate-800 pt-5 mt-2">
                  <span className="text-gray-400 font-semibold">Total Nominal</span>
                  <span className="font-bold text-white text-xl">Rp {parseInt(amount, 10).toLocaleString('id-ID')}</span>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="w-full max-w-md mx-auto py-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition active:scale-[0.98] block text-lg"
              >
                Lakukan Transfer Lain
              </button>
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. VOICE ASSISTANT */}
      {/* ========================================================================= */}
      {voiceEnabled && (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-950 border border-slate-800 p-10 rounded-2xl animate-fadeIn relative overflow-hidden">
          
          <div className="lg:col-span-5 h-full flex flex-col items-center justify-center py-12 relative border-r border-slate-800/50">
            {isListening && (
              <>
                <div className="absolute w-80 h-80 rounded-full border border-red-500/10 animate-ping duration-3000 pointer-events-none" />
                <div className="absolute w-96 h-96 rounded-full border border-red-500/5 animate-pulse pointer-events-none" />
              </>
            )}
            
            <div className="relative">
              {isListening && (
                <div className="absolute inset-0 rounded-full bg-red-600/20 animate-ping duration-1500" />
              )}
              <button
                onClick={() => setIsListening(!isListening)}
                type="button"
                className={`w-36 h-36 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
                  isListening 
                    ? 'bg-red-500 shadow-red-900/40 ring-4 ring-red-500/20 scale-105' 
                    : 'bg-slate-900 border border-slate-700 hover:border-red-500/30 hover:bg-slate-800 text-red-500 active:scale-95'
                }`}
              >
                <Mic className={`w-16 h-16 ${isListening ? 'text-white' : 'text-red-500 animate-pulse'}`} />
              </button>
            </div>
            
            {isListening && (
              <div className="flex items-center justify-center space-x-1.5 h-8 pt-8">
                <span className="w-1.5 bg-red-500 rounded-full animate-bounce h-4" style={{ animationDelay: '0.1s' }} />
                <span className="w-1.5 bg-red-500 rounded-full animate-bounce h-7" style={{ animationDelay: '0.2s' }} />
                <span className="w-1.5 bg-red-500 rounded-full animate-bounce h-5" style={{ animationDelay: '0.3s' }} />
                <span className="w-1.5 bg-red-500 rounded-full animate-bounce h-8" style={{ animationDelay: '0.4s' }} />
                <span className="w-1.5 bg-red-500 rounded-full animate-bounce h-4" style={{ animationDelay: '0.5s' }} />
              </div>
            )}
          </div>

          <div className="lg:col-span-7 space-y-8 pl-0 lg:pl-8">
            <div className="space-y-3 text-left">
              <h3 className="text-2xl font-bold text-white tracking-wide">Asisten Suara VoiceBank</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Tekan tombol mic di sebelah kiri dan ucapkan nama penerima atau nomor rekening terdaftar untuk melakukan transfer super cepat.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-8 rounded-xl min-h-[140px] flex items-center justify-center shadow-inner">
              <p className={`text-center text-xl font-semibold tracking-wide transition-all duration-300 ${
                isListening ? 'text-white italic' : 'text-gray-500'
              }`}>
                {isListening ? voiceText : 'Silakan klik tombol Mic di sebelah kiri untuk mulai berbicara...'}
              </p>
            </div>

            <div className="space-y-3 bg-slate-900/50 p-6 rounded-xl border border-slate-800/50">
              <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Tips Berbicara:</p>
              <ul className="text-sm text-gray-500 space-y-3 list-disc pl-5">
                <li>"Kirim ke Budi Santoso"</li>
                <li>"Transfer ke nomor rekening delapan dua sembilan tiga delapan satu nol dua"</li>
                <li>Pastikan mikrofon perangkat Anda memiliki izin aktif</li>
              </ul>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default TransferPage;