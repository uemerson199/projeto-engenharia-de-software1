import { useEffect, useState } from 'react';
import { api } from '../services/api';
import type { StockMovement, ProductMin, Department, Page } from '../types';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Table } from '../components/ui/Table';
import { Pagination } from '../components/ui/Pagination';
import { Plus, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

export function StockMovements() {
  const [movements, setMovements] = useState<Page<StockMovement>>({
    content: [],
    totalElements: 0,
    totalPages: 0,
    size: 20,
    number: 0,
  });
  const [products, setProducts] = useState<ProductMin[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const [formData, setFormData] = useState({
    productId: 0,
    departmentId: 0,
    type: 'ENTRADA' as 'ENTRADA' | 'SAIDA',
    quantity: 0,
    observation: '',
    userId: 1,
  });

  useEffect(() => {
    loadMovements();
    loadProducts();
    loadDepartments();
  }, [currentPage]);

  const loadMovements = async () => {
    try {
      setLoading(true);
      const result = await api.getStockMovements(currentPage, 20);
      setMovements(result);
    } catch (error) {
      console.error('Failed to load movements:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const result = await api.getActiveProducts();
      setProducts(result);
    } catch (error) {
      console.error('Failed to load products:', error);
    }
  };

  const loadDepartments = async () => {
    try {
      const result = await api.getActiveDepartments();
      setDepartments(result);
    } catch (error) {
      console.error('Failed to load departments:', error);
    }
  };

  const handleOpenModal = () => {
    setFormData({
      productId: products[0]?.id || 0,
      departmentId: departments[0]?.id || 0,
      type: 'ENTRADA',
      quantity: 0,
      observation: '',
      userId: 1,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createStockMovement(formData);
      setModalOpen(false);
      loadMovements();
    } catch (error) {
      console.error('Failed to save movement:', error);
      alert('Erro ao salvar movimentação');
    }
  };

  const columns = [
    {
      key: 'dateTime',
      header: 'Data/Hora',
      render: (item: StockMovement) =>
        new Date(item.dateTime).toLocaleString('pt-BR'),
    },
    { key: 'productName', header: 'Produto' },
    { key: 'departmentName', header: 'Departamento' },
    {
      key: 'type',
      header: 'Tipo',
      render: (item: StockMovement) => (
        <span
          className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded ${
            item.type === 'ENTRADA'
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {item.type === 'ENTRADA' ? (
            <ArrowUpCircle size={14} />
          ) : (
            <ArrowDownCircle size={14} />
          )}
          {item.type}
        </span>
      ),
    },
    {
      key: 'quantity',
      header: 'Quantidade',
      render: (item: StockMovement) => (
        <span className="font-medium">
          {item.type === 'ENTRADA' ? '+' : '-'}
          {Math.abs(item.quantity)}
        </span>
      ),
    },
    { key: 'observation', header: 'Observação' },
    { key: 'userName', header: 'Usuário' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Movimentações de Estoque</h1>
        <Button onClick={handleOpenModal}>
          <Plus size={20} className="mr-2" />
          Nova Movimentação
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <Table data={movements.content} columns={columns} />
            {movements.totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={movements.totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Nova Movimentação"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Movimentação
            </label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value as 'ENTRADA' | 'SAIDA' })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="ENTRADA">Entrada</option>
              <option value="SAIDA">Saída</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Produto
            </label>
            <select
              value={formData.productId}
              onChange={(e) =>
                setFormData({ ...formData, productId: parseInt(e.target.value) })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Selecione...</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} ({product.sku})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Departamento
            </label>
            <select
              value={formData.departmentId}
              onChange={(e) =>
                setFormData({ ...formData, departmentId: parseInt(e.target.value) })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Selecione...</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Quantidade"
            type="number"
            min="1"
            required
            value={formData.quantity || ''}
            onChange={(e) =>
              setFormData({ ...formData, quantity: parseInt(e.target.value) })
            }
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observação
            </label>
            <textarea
              value={formData.observation}
              onChange={(e) => setFormData({ ...formData, observation: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">Registrar</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
