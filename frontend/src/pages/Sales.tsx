import React, { useState, useEffect } from 'react';
import { Search, Eye, RefreshCw, Calendar, Loader2, FileText, FileSpreadsheet } from 'lucide-react';
import { SaleController } from '../controllers/SaleController';
import { Sale, SaleModel } from '../models/Sale';
import ErrorMessage from '../views/components/ErrorMessage';
import SuccessMessage from '../views/components/SuccessMessage';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const Sales: React.FC = () => {
  const [saleController] = useState(() => new SaleController());
  const [sales, setSales] = useState<Sale[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    loadSales();
  }, []);

  const loadSales = async () => {
    setIsPageLoading(true);
    const result = await saleController.getAllSales();
    if (result.success && result.sales) {
      setSales(result.sales);
    } else {
      setErrors(result.errors || ['Erro ao carregar vendas']);
    }
    setIsPageLoading(false);
  };

  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    if (term.trim()) {
      const result = await saleController.searchSales(term);
      if (result.success && result.sales) {
        setSales(result.sales);
      }
    } else {
      loadSales();
    }
  };

  const filterByDate = (sales: Sale[]) => {
    if (!startDate && !endDate) return sales;
    return sales.filter((sale) => {
      const saleDate = new Date(sale.saleDate);
      const start = startDate ? new Date(startDate) : new Date('1970-01-01');
      const end = endDate ? new Date(endDate) : new Date('2999-12-31');
      return saleDate >= start && saleDate <= end;
    });
  };

  const filteredSales = filterByDate(
    sales.filter(
      (sale) =>
        sale.id.toString().includes(searchTerm) ||
        sale.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sale.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleRefund = async (saleId: number) => {
    if (confirm('Tem certeza que deseja estornar esta venda?')) {
      const result = await saleController.updateSaleStatus(saleId, 'REFUNDED');
      if (result.success) {
        setSuccessMessage('Venda estornada com sucesso!');
        await loadSales();
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setErrors(result.errors || ['Erro ao estornar venda']);
      }
    }
  };

  const viewSaleDetails = (sale: Sale) => {
    setSelectedSale(sale);
    setShowModal(true);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Relatório de Vendas', 14, 16);
    const tableData = filteredSales.map((sale) => [
      sale.id,
      new Date(sale.saleDate).toLocaleDateString('pt-BR'),
      `${sale.user.firstName} ${sale.user.lastName}`,
      `R$ ${sale.totalAmount.toFixed(2)}`,
      SaleModel.formatPaymentMethod(sale.paymentMethod),
      SaleModel.formatStatus(sale.status),
    ]);
    autoTable(doc, {
      startY: 20,
      head: [['ID', 'Data', 'Vendedor', 'Total', 'Pagamento', 'Status']],
      body: tableData,
    });
    doc.save('relatorio_vendas.pdf');
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      filteredSales.map((sale) => ({
        ID: sale.id,
        Data: new Date(sale.saleDate).toLocaleDateString('pt-BR'),
        Vendedor: `${sale.user.firstName} ${sale.user.lastName}`,
        Total: `R$ ${sale.totalAmount.toFixed(2)}`,
        Pagamento: SaleModel.formatPaymentMethod(sale.paymentMethod),
        Status: SaleModel.formatStatus(sale.status),
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Vendas');
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'relatorio_vendas.xlsx');
  };

  if (isPageLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Carregando vendas...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Relatório de Vendas</h1>
          <p className="text-gray-600">Visualize, filtre e exporte o histórico de vendas</p>
        </div>
      </div>

      {successMessage && <SuccessMessage message={successMessage} />}
      {errors.length > 0 && <ErrorMessage errors={errors} />}

      {/* Filters */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative col-span-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por ID, vendedor ou pagamento..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={exportToPDF}
            className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span>Exportar PDF</span>
          </button>
          <button
            onClick={exportToExcel}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Exportar Excel</span>
          </button>
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
                    {SaleModel.formatPaymentMethod(sale.paymentMethod)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${SaleModel.getStatusColor(
                        sale.status
                      )}`}
                    >
                      {SaleModel.formatStatus(sale.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredSales.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Nenhuma venda encontrada
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 'Tente ajustar sua busca.' : 'Nenhuma venda foi realizada ainda.'}
          </p>
        </div>
      )}

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
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Informações da Venda
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Data/Hora:</span>{' '}
                      {new Date(selectedSale.saleDate).toLocaleString('pt-BR')}
                    </p>
                    <p>
                      <span className="font-medium">Vendedor:</span>{' '}
                      {selectedSale.user.firstName} {selectedSale.user.lastName}
                    </p>
                    <p>
                      <span className="font-medium">Método de Pagamento:</span>{' '}
                      {SaleModel.formatPaymentMethod(selectedSale.paymentMethod)}
                    </p>
                    <p>
                      <span className="font-medium">Status:</span>
                      <span
                        className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${SaleModel.getStatusColor(
                          selectedSale.status
                        )}`}
                      >
                        {SaleModel.formatStatus(selectedSale.status)}
                      </span>
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Resumo Financeiro
                  </h3>
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
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                          Produto
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                          Qtd
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                          Preço Unit.
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                          Subtotal
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedSale.items.map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 py-2 text-sm text-gray-900">
                            {item.product.name}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-900">{item.quantity}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">
                            R$ {item.priceAtSale.toFixed(2)}
                          </td>
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

/**
 * PRÓXIMA SEMANA SÓ DAR O PUSH NESSE ARQUIVO AQUI
 * 
 * git add .
 * git commit -m "feat: implementar relatório de vendas com filtros, PDF e Excel export"
 * git push origin main
 * 
 */
