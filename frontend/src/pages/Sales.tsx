import React, { useState } from 'react';
import { Search, Eye, RefreshCw, Calendar } from 'lucide-react';
import { Sale } from '../types';
import { mockSales } from '../data/mockData';

const Sales: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>(mockSales);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [showModal, setShowModal] = useState(false);

  const filteredSales = sales.filter(sale =>
    sale.id.toString().includes(searchTerm) ||
    sale.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRefund = (saleId: number) => {
    if (confirm('Tem certeza que deseja estornar esta venda?')) {
      setSales(sales.map(sale =>
        sale.id === saleId ? { ...sale, status: 'REFUNDED' } : sale
      ));
    }
  };

  const viewSaleDetails = (sale: Sale) => {
    setSelectedSale(sale);
    setShowModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'REFUNDED':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'Concluída';
      case 'CANCELLED':
        return 'Cancelada';
      case 'REFUNDED':
        return 'Estornada';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Consultar Vendas</h1>
          <p className="text-gray-600">Histórico de vendas realizadas</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por ID, vendedor ou método de pagamento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID Venda
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data/Hora
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vendedor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pagamento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{sale.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                      <div>
                        <div>{new Date(sale.saleDate).toLocaleDateString('pt-BR')}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(sale.saleDate).toLocaleTimeString('pt-BR')}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {sale.user.firstName} {sale.user.lastName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                    R$ {sale.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {sale.paymentMethod}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(sale.status)}`}>
                      {getStatusText(sale.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => viewSaleDetails(sale)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Ver detalhes"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {sale.status === 'COMPLETED' && (
                        <button
                          onClick={() => handleRefund(sale.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Estornar venda"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sale Details Modal */}
      {showModal && selectedSale && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Detalhes da Venda #{selectedSale.id}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Informações da Venda</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Data/Hora:</span> {new Date(selectedSale.saleDate).toLocaleString('pt-BR')}</p>
                    <p><span className="font-medium">Vendedor:</span> {selectedSale.user.firstName} {selectedSale.user.lastName}</p>
                    <p><span className="font-medium">Método de Pagamento:</span> {selectedSale.paymentMethod}</p>
                    <p><span className="font-medium">Status:</span> 
                      <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedSale.status)}`}>
                        {getStatusText(selectedSale.status)}
                      </span>
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Resumo Financeiro</h3>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-lg font-bold text-green-600">
                      Total: R$ {selectedSale.totalAmount.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Itens da Venda</h3>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Produto</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Qtd</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Preço Unit.</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedSale.items.map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 py-2 text-sm text-gray-900">{item.product.name}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{item.quantity}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">R$ {item.priceAtSale.toFixed(2)}</td>
                          <td className="px-4 py-2 text-sm font-medium text-gray-900">
                            R$ {(item.quantity * item.priceAtSale).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sales;