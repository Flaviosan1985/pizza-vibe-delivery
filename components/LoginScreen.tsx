
import React, { useState } from 'react';
import { Pizza, ArrowRight, Phone, User as UserIcon, Lock } from 'lucide-react';
import { User } from '../types';

interface LoginScreenProps {
  onLogin: (user: User) => void;
  logo?: string;
  storeName?: string;
  backgroundImage?: string;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, logo, storeName, backgroundImage }) => {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [error, setError] = useState('');

  // Phone mask logic: (11) 99999-9999
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length > 11) value = value.slice(0, 11);
    if (value.length > 2) value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    if (value.length > 9) value = `${value.slice(0, 9)}-${value.slice(9)}`;
    setPhone(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isAdminMode) {
      // Simple Admin Check (In production, use backend auth)
      if (adminPass === 'admin123') {
        onLogin({ name: 'Administrador', phone: '000', isAdmin: true });
      } else {
        setError('Senha de administrador incorreta.');
      }
      return;
    }
    
    if (name.trim().length < 3) {
      setError('Por favor, digite seu nome completo.');
      return;
    }
    
    const rawPhone = phone.replace(/\D/g, '');
    if (rawPhone.length < 10) {
      setError('Por favor, digite um telefone válido.');
      return;
    }

    // Mock cashback for demo: Random balance between 5 and 20 if user not admin
    const mockCashback = Math.floor(Math.random() * 1500) / 100 + 5; 
    onLogin({ name, phone, cashbackBalance: mockCashback });
  };

  const displayName = storeName || 'PizzaVibe';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-brand-dark">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: `url("${backgroundImage || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop'}")` }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md p-6 mx-4">
        <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl animate-slide-up">
          
          <div className="text-center mb-8">
            {logo ? (
               <img src={logo} alt={displayName} className="w-24 h-24 mx-auto rounded-full object-cover shadow-2xl border-4 border-white/20 mb-4" />
            ) : (
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-orange text-white mb-4 shadow-lg shadow-orange-500/30">
                <Pizza size={32} />
              </div>
            )}
            <h1 className="text-3xl font-display font-extrabold text-white mb-2 tracking-tight">
              {displayName}
            </h1>
            <p className="text-gray-300">
              {isAdminMode ? 'Acesso Administrativo' : 'Identifique-se para acessar nosso cardápio exclusivo.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {isAdminMode ? (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5 ml-1">Senha Admin</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    value={adminPass}
                    onChange={(e) => setAdminPass(e.target.value)}
                    className="w-full bg-black/40 border border-gray-600 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange rounded-xl py-3.5 pl-10 pr-4 text-white placeholder-gray-500 outline-none transition-all"
                    placeholder="••••••"
                  />
                </div>
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5 ml-1">Seu Nome</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <UserIcon size={18} />
                    </div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-black/40 border border-gray-600 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange rounded-xl py-3.5 pl-10 pr-4 text-white placeholder-gray-500 outline-none transition-all"
                      placeholder="Ex: João da Silva"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5 ml-1">Seu WhatsApp / Telefone</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Phone size={18} />
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={handlePhoneChange}
                      className="w-full bg-black/40 border border-gray-600 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange rounded-xl py-3.5 pl-10 pr-4 text-white placeholder-gray-500 outline-none transition-all"
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                </div>
              </>
            )}

            {error && (
              <div className="text-brand-red text-sm font-medium text-center bg-red-900/20 py-2 rounded-lg border border-red-500/20">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-brand-orange hover:bg-orange-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-500/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 mt-4 font-display uppercase tracking-wider"
            >
              {isAdminMode ? 'Entrar no Painel' : 'Acessar Cardápio'}
              <ArrowRight size={20} />
            </button>
          </form>

          <div className="mt-6 text-center">
            <button 
              onClick={() => { setIsAdminMode(!isAdminMode); setError(''); }}
              className="text-xs text-gray-500 hover:text-white underline"
            >
              {isAdminMode ? 'Voltar para Login de Cliente' : 'Sou Administrador'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
