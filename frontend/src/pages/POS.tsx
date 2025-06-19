import React, { useState } from 'react';
import { Search, ShoppingCart, Trash2, CreditCard, Banknote, Smartphone } from 'lucide-react';
import { Product, CartItem } from '../types';
import { mockProducts } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

const POS: React.FC = () => {
  const { user } = useAuth();
  const [barcode, setBarcode] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState('DINHEIRO');
  const [showPayment, setShowPayment] = useState(false);

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.product.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * product.price }
          : item
      ));
    } else {
      setCart([...cart, {
        product,
        quantity: 1,
        subtotal: product.price
      }]);
    }
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(cart.map(item =>
      item.product.id === productId
        ? { ...item, quantity, subtotal: quantity * item.product.price }
        : item
    ));
  };

  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const product = mockProducts.find(p => p.barcode === barcode);
    
    if (product) {
      addToCart(product);
      setBarcode('');
    } else {
      alert('Produto não encontrado!');
    }
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + item.subtotal, 0);
  };

  const handleFinalizeSale = () => {
    if (cart.length === 0) {
      alert('Adicione produtos ao carrinho antes de finalizar a venda!');
      return;
    }
    setShowPayment(true);
  };

  const completeSale = () => {
    alert(`Venda finalizada com sucesso!\nTotal: R$ ${getTotalAmount().toFixed(2)}\nPagamento: ${paymentMethod}`);
    setCart([]);
    setShowPayment(false);
    setPaymentMethod('DINHEIRO');
  };

  const clearCart = () => {
    if (confirm('Tem certeza que deseja limpar o carrinho?')) {
      setCart([]);
    }
  };

  return (
    <div className="h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">PDV - Ponto de Venda</h1>
        <p className="text-gray-600">Operador: {user?.firstName} {user?.lastName}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        {/* Product Search */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <form onSubmit={handleBarcodeSubmit} className="flex space-x-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  placeholder="Digite ou escaneie o código de barras..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Adicionar
              </button>
            </form>
          </div>

          {/* Product Grid */}
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Produtos Disponíveis</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
              {mockProducts.filter(p => p.stockQuantity > 0).map((product) => (
                <div
                  key={product.id}
                  onClick={() => addToCart(product)}
                  className="p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 cursor-pointer transition-colors"
                >
                  <h4 className="font-medium text-gray-900 text-sm">{product.name}</h4>
                  <p className="text-xs text-gray-600 mb-2">{product.category.name}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-green-600">
                      R$ {product.price.toFixed(2)}
                    </span>
                    <span className="text-xs text-gray-500">
                      Est: {product.stockQuantity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-fit">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Carrinho ({cart.length})
              </h3>
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Limpar
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 p-4">
            {cart.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Carrinho vazio
              </p>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">
                        {item.product.name}
                      </h4>
                      <p className="text-xs text-gray-600">
                        R$ {item.product.price.toFixed(2)} cada
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-6 h-6 bg-red-100 text-red-600 rounded text-xs hover:bg-red-200"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-6 h-6 bg-green-100 text-green-600 rounded text-xs hover:bg-green-200"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="ml-2 text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="p-4 border-t border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold text-gray-900">Total:</span>
                <span className="text-2xl font-bold text-green-600">
                  R$ {getTotalAmount().toFixed(2)}
                </span>
              </div>
              <button
                onClick={handleFinalizeSale}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Finalizar Venda
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Finalizar Pagamento</h2>
            
            <div className="mb-4">
              <p className="text-gray-600 mb-2">Total da venda:</p>
              <p className="text-2xl font-bold text-green-600">
                R$ {getTotalAmount().toFixed(2)}
              </p>
            </div>

            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-3">Método de Pagamento:</p>
              <div className="space-y-2">
                {[
                  { value: 'DINHEIRO', label: 'Dinheiro', icon: Banknote },
                  { value: 'CARTAO', label: 'Cartão', icon: CreditCard },
                  { value: 'PIX', label: 'PIX', icon: Smartphone }
                ].map((method) => (
                  <label key={method.value} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      value={method.value}
                      checked={paymentMethod === method.value}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-blue-600"
                    />
                    <method.icon className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-900">{method.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowPayment(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={completeSale}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Confirmar Pagamento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default POS;