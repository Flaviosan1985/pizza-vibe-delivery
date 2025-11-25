
import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  CreditCard, 
  Banknote, 
  QrCode, 
  ChevronLeft, 
  Loader2, 
  ShoppingBag,
  ArrowRight,
  Bike,
  Store,
  Trash2
} from 'lucide-react';
import { CartItem } from '../types';

interface Address {
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
}

export interface PaymentInfo {
  method: 'credit' | 'debit' | 'pix' | 'cash';
  cardType?: 'credit' | 'debit';
  changeFor?: string;
}

interface CheckoutPageProps {
  cartItems: CartItem[];
  deliveryFee: number;
  onPlaceOrder: (address: Address | null, payment: PaymentInfo, deliveryMode: 'delivery' | 'pickup') => void;
  onRemoveItem: (cartId: string) => void;
  onBack: () => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({
  cartItems,
  deliveryFee: standardDeliveryFee,
  onPlaceOrder,
  onRemoveItem,
  onBack
}) => {
  // --- State ---
  const [deliveryMode, setDeliveryMode] = useState<'delivery' | 'pickup'>('delivery');
  const [loading, setLoading] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const [address, setAddress] = useState<Address>({
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: ''
  });

  const [payment, setPayment] = useState<PaymentInfo>({
    method: 'credit',
    cardType: 'credit',
    changeFor: ''
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // --- Scroll Effect ---
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- Calculations ---
  const currentDeliveryFee = deliveryMode === 'pickup' ? 0 : standardDeliveryFee;
  const subtotal = cartItems.reduce((acc, item) => acc + (item.unitTotal * item.quantity), 0);
  const total = subtotal + currentDeliveryFee;

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  // --- Handlers ---
  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawCep = e.target.value.replace(/\D/g, '');
    setAddress(prev => ({ ...prev, cep: rawCep }));

    if (rawCep.length === 8) {
      setCepLoading(true);
      try {
        const response = await fetch(`https://viacep.com.br/ws/${rawCep}/json/`);
        const data = await response.json();
        
        if (!data.erro) {
          setAddress(prev => ({
            ...prev,
            street: data.logradouro,
            neighborhood: data.bairro,
            city: data.localidade,
            state: data.uf
          }));
          document.getElementById('address-number')?.focus();
          setErrors(prev => ({...prev, cep: ''}));
        } else {
          setErrors(prev => ({...prev, cep: 'CEP não encontrado'}));
        }
      } catch (error) {
        setErrors(prev => ({...prev, cep: 'Erro ao buscar CEP'}));
      } finally {
        setCepLoading(false);
      }
    }
  };

  const handleConfirm = () => {
    const newErrors: any = {};
    
    if (deliveryMode === 'delivery') {
      if (address.cep.length < 8) newErrors.cep = 'CEP inválido';
      if (!address.street) newErrors.street = 'Endereço obrigatório';
      if (!address.number) newErrors.number = 'Número obrigatório';
    }

    if (payment.method === 'cash' && !payment.changeFor) newErrors.change = 'Informe o troco (ou digite "Sem troco")';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setLoading(true);
    // Simulate short processing delay
    setTimeout(() => {
      onPlaceOrder(deliveryMode === 'delivery' ? address : null, payment, deliveryMode);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-brand-dark text-gray-900 dark:text-white pb-24 lg:pb-10 font-sans transition-colors duration-300">
      
      {/* Fixed Header with Scroll Effect */}
      <div 
        className={`fixed top-0 w-full z-40 transition-all duration-300 ${
          isScrolled 
            ? 'bg-black/80 backdrop-blur-md shadow-lg border-b border-white/10 py-3' 
            : 'bg-transparent py-4 border-b border-transparent'
        }`}
      >
        <div className="container mx-auto px-4 flex items-center gap-4">
          <button 
            onClick={onBack} 
            className={`group flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
              isScrolled 
                ? 'bg-white/10 hover:bg-white/20 text-white' 
                : 'bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200'
            }`}
          >
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold text-sm font-display">Voltar</span>
          </button>
          <h1 className={`text-xl font-bold transition-colors font-display ${
            isScrolled ? 'text-white' : 'text-gray-900 dark:text-white'
          }`}>
            Finalizar Pedido
          </h1>
        </div>
      </div>

      {/* Spacer for fixed header + Content */}
      <div className="pt-24 container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Delivery Mode Toggle */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setDeliveryMode('delivery')}
              className={`relative overflow-hidden p-6 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-3 ${
                deliveryMode === 'delivery' 
                  ? 'border-brand-orange bg-orange-50 dark:bg-orange-900/20 shadow-lg scale-[1.02]' 
                  : 'border-transparent bg-white dark:bg-brand-gray shadow-sm hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <div className={`p-3 rounded-full ${deliveryMode === 'delivery' ? 'bg-brand-orange text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
                <Bike size={32} />
              </div>
              <div className="text-center">
                <span className={`block font-bold text-lg font-display ${deliveryMode === 'delivery' ? 'text-brand-orange' : 'text-gray-500'}`}>Entrega</span>
                <span className="text-xs text-gray-400">{formatCurrency(standardDeliveryFee)}</span>
              </div>
            </button>

            <button
              onClick={() => setDeliveryMode('pickup')}
              className={`relative overflow-hidden p-6 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-3 ${
                deliveryMode === 'pickup' 
                  ? 'border-brand-orange bg-orange-50 dark:bg-orange-900/20 shadow-lg scale-[1.02]' 
                  : 'border-transparent bg-white dark:bg-brand-gray shadow-sm hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <div className={`p-3 rounded-full ${deliveryMode === 'pickup' ? 'bg-brand-orange text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
                <Store size={32} />
              </div>
              <div className="text-center">
                <span className={`block font-bold text-lg font-display ${deliveryMode === 'pickup' ? 'text-brand-orange' : 'text-gray-500'}`}>Retirada</span>
                <span className="text-xs text-brand-green font-bold uppercase tracking-wider">Grátis</span>
              </div>
            </button>
          </div>

          {/* Address Section (Only for Delivery) */}
          {deliveryMode === 'delivery' ? (
            <section className="bg-white dark:bg-brand-gray rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 animate-slide-up">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-800 dark:text-white font-display">
                <MapPin className="text-brand-orange" size={24} />
                Endereço de Entrega
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-1">
                  <label className="block text-sm text-gray-500 mb-1">CEP</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={address.cep}
                      onChange={handleCepChange}
                      maxLength={8}
                      placeholder="00000000"
                      className={`w-full bg-gray-50 dark:bg-gray-800 border ${errors.cep ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-3 focus:border-brand-orange focus:outline-none transition-colors dark:text-white font-sans`}
                    />
                    {cepLoading && (
                      <div className="absolute right-3 top-3">
                        <Loader2 size={20} className="animate-spin text-brand-orange" />
                      </div>
                    )}
                  </div>
                  {errors.cep && <span className="text-xs text-red-500">{errors.cep}</span>}
                </div>
                
                <div className="md:col-span-1">
                  <label className="block text-sm text-gray-500 mb-1">Cidade/UF</label>
                  <input 
                    type="text" 
                    value={address.city ? `${address.city} - ${address.state}` : ''}
                    disabled
                    className="w-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-gray-400 cursor-not-allowed font-sans"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-500 mb-1">Endereço</label>
                  <input 
                    type="text" 
                    value={address.street}
                    onChange={e => setAddress({...address, street: e.target.value})}
                    className={`w-full bg-gray-50 dark:bg-gray-800 border ${errors.street ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-3 focus:border-brand-orange focus:outline-none dark:text-white font-sans`}
                  />
                </div>

                <div className="md:col-span-1">
                  <label className="block text-sm text-gray-500 mb-1">Número</label>
                  <input 
                    id="address-number"
                    type="text" 
                    value={address.number}
                    onChange={e => setAddress({...address, number: e.target.value})}
                    className={`w-full bg-gray-50 dark:bg-gray-800 border ${errors.number ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-3 focus:border-brand-orange focus:outline-none dark:text-white font-sans`}
                  />
                </div>

                <div className="md:col-span-1">
                  <label className="block text-sm text-gray-500 mb-1">Complemento</label>
                  <input 
                    type="text" 
                    value={address.complement}
                    onChange={e => setAddress({...address, complement: e.target.value})}
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 focus:border-brand-orange focus:outline-none dark:text-white font-sans"
                  />
                </div>
                
                 <div className="md:col-span-2">
                  <label className="block text-sm text-gray-500 mb-1">Bairro</label>
                  <input 
                    type="text" 
                    value={address.neighborhood}
                    onChange={e => setAddress({...address, neighborhood: e.target.value})}
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 focus:border-brand-orange focus:outline-none dark:text-white font-sans"
                  />
                </div>
              </div>
            </section>
          ) : (
            <section className="bg-white dark:bg-brand-gray rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 animate-slide-up text-center">
              <div className="w-16 h-16 bg-brand-green/20 text-brand-green rounded-full flex items-center justify-center mx-auto mb-4">
                <Store size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 font-display">Retirar na Loja</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Rua das Pizzas, 123 - Centro<br/>
                (11) 99999-9999
              </p>
              <div className="mt-4 p-3 bg-brand-yellow/20 text-yellow-800 dark:text-yellow-200 rounded-lg text-sm inline-block font-bold">
                Tempo estimado: 30-40 min
              </div>
            </section>
          )}

          {/* Payment Section */}
          <section className="bg-white dark:bg-brand-gray rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-800 dark:text-white font-display">
               <CreditCard className="text-brand-orange" size={24} />
              Forma de Pagamento
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${payment.method === 'pix' ? 'border-brand-orange bg-orange-50 dark:bg-orange-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'}`}>
                <input type="radio" name="payment" value="pix" checked={payment.method === 'pix'} onChange={() => setPayment({...payment, method: 'pix'})} className="hidden" />
                <QrCode size={28} className={`mb-2 ${payment.method === 'pix' ? 'text-brand-orange' : 'text-gray-400'}`} />
                <span className="font-bold text-sm">PIX</span>
              </label>

              <label className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${['credit', 'debit'].includes(payment.method) ? 'border-brand-orange bg-orange-50 dark:bg-orange-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'}`}>
                <input type="radio" name="payment" value="credit" checked={['credit', 'debit'].includes(payment.method)} onChange={() => setPayment({...payment, method: 'credit'})} className="hidden" />
                <CreditCard size={28} className={`mb-2 ${['credit', 'debit'].includes(payment.method) ? 'text-brand-orange' : 'text-gray-400'}`} />
                <span className="font-bold text-sm">Cartão</span>
              </label>

              <label className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${payment.method === 'cash' ? 'border-brand-orange bg-orange-50 dark:bg-orange-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'}`}>
                <input type="radio" name="payment" value="cash" checked={payment.method === 'cash'} onChange={() => setPayment({...payment, method: 'cash'})} className="hidden" />
                <Banknote size={28} className={`mb-2 ${payment.method === 'cash' ? 'text-brand-orange' : 'text-gray-400'}`} />
                <span className="font-bold text-sm">Dinheiro</span>
              </label>
            </div>

            {/* Sub-options */}
            {['credit', 'debit'].includes(payment.method) && (
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg animate-slide-up">
                <p className="text-sm text-gray-500 mb-3">Tipo de cartão:</p>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" checked={payment.method === 'credit'} onChange={() => setPayment({...payment, method: 'credit'})} className="accent-brand-orange" />
                    <span className="text-sm dark:text-gray-300">Crédito</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" checked={payment.method === 'debit'} onChange={() => setPayment({...payment, method: 'debit'})} className="accent-brand-orange" />
                    <span className="text-sm dark:text-gray-300">Débito</span>
                  </label>
                </div>
              </div>
            )}

            {payment.method === 'cash' && (
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg animate-slide-up">
                <label className="block text-sm text-gray-500 mb-2">Precisa de troco para quanto?</label>
                <input 
                  type="text" 
                  placeholder="Ex: 50,00 (Deixe em branco se não precisar)"
                  value={payment.changeFor}
                  onChange={(e) => setPayment({...payment, changeFor: e.target.value})}
                  className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:border-brand-orange outline-none dark:text-white"
                />
                {errors.change && <span className="text-xs text-red-500 mt-1">{errors.change}</span>}
              </div>
            )}
          </section>
        </div>

        {/* Right Column - Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-brand-gray rounded-2xl p-6 border border-gray-100 dark:border-gray-800 sticky top-24 shadow-xl">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-800 dark:text-white font-display">
              <ShoppingBag size={20} className="text-brand-orange" />
              Resumo do Pedido
            </h3>
            
            {/* Items List */}
            <div className="space-y-4 mb-6 max-h-80 overflow-y-auto custom-scrollbar pr-1">
              {cartItems.map((item) => (
                <div key={item.cartId} className="flex gap-3 items-start relative group">
                  <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 overflow-hidden shrink-0">
                    <img src={item.image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-800 dark:text-white truncate font-display">{item.quantity}x {item.isHalfHalf ? 'Meio a Meio' : item.name}</p>
                    {item.isHalfHalf && <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">{item.description}</p>}
                    {item.selectedCrust && <p className="text-[10px] text-gray-500 dark:text-gray-400">Borda: {item.selectedCrust.name}</p>}
                  </div>
                  <div className="text-right">
                    <span className="block text-sm font-bold text-gray-600 dark:text-gray-300 font-display">
                      {formatCurrency(item.unitTotal * item.quantity)}
                    </span>
                    <button 
                      onClick={() => onRemoveItem(item.cartId)}
                      className="text-gray-300 hover:text-red-500 mt-1 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 dark:border-gray-700 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-500 dark:text-gray-400">
                <span>Subtotal</span>
                <span className="font-display">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-500 dark:text-gray-400">
                <span>Entrega</span>
                <span className={`font-display ${deliveryMode === 'pickup' ? 'text-brand-green font-bold' : ''}`}>
                  {deliveryMode === 'pickup' ? 'Grátis' : formatCurrency(standardDeliveryFee)}
                </span>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-lg font-bold text-gray-800 dark:text-white font-display">Total</span>
                <span className="text-2xl font-bold text-brand-orange font-display">{formatCurrency(total)}</span>
              </div>
            </div>

            {/* Desktop Button */}
            <button 
              onClick={handleConfirm}
              disabled={loading || cartItems.length === 0}
              className="hidden lg:flex w-full bg-brand-orange hover:bg-orange-600 text-white font-extrabold text-lg py-4 rounded-xl mt-6 shadow-lg shadow-orange-500/20 items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed font-display uppercase tracking-wider"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  Enviar Pedido
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </div>
        </div>

      </div>

      {/* Mobile Sticky Footer - Compact Version */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-brand-gray border-t border-gray-200 dark:border-gray-800 p-3 z-40 shadow-[0_-5px_20px_rgba(0,0,0,0.1)] pb-safe-area flex items-center justify-between gap-4">
        
        {/* Total Section (Left) */}
        <div className="flex flex-col">
           <span className="text-gray-400 text-[10px] font-medium uppercase font-display leading-tight">Total a pagar</span>
           <div className="text-xl font-black text-brand-orange leading-none font-display">{formatCurrency(total)}</div>
           <span className="text-[10px] text-gray-500 mt-0.5">{cartItems.length} itens</span>
        </div>

        {/* Button Section (Right) */}
        <button 
          onClick={handleConfirm}
          disabled={loading || cartItems.length === 0}
          className="flex-1 bg-brand-orange active:bg-orange-600 text-white font-bold text-sm h-12 rounded-lg shadow-lg shadow-orange-500/10 flex items-center justify-center gap-2 transition-transform active:scale-[0.98] disabled:opacity-70 font-display uppercase tracking-wider"
        >
           {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin" size={18} />
                <span>Enviando...</span>
              </div>
            ) : (
              <>
                Enviar WhatsApp
                <ArrowRight size={18} />
              </>
            )}
        </button>
      </div>

    </div>
  );
};

export default CheckoutPage;
