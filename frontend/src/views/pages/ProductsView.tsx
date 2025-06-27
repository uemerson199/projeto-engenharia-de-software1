import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Package, AlertTriangle, Loader2 } from 'lucide-react';
import { ProductController } from '../../controllers/ProductController';
import { Product, ProductModel } from '../../models/Product';
import { Category } from '../../models/Category';
import { Supplier } from '../../models/Supplier';
import ProductForm from '../components/ProductForm';
import Modal from '../components/Modal';
import ErrorMessage from '../components/ErrorMessage';
import SuccessMessage from '../components/SuccessMessage';

const ProductsView: React.FC = () => {
  const [productController] = useState(() => new ProductController());
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setIsPageLoading(true);
    await Promise.all([loadProducts(), loadCategories(), loadSuppliers()]);
    setIsPageLoading(false);
  };

  const loadProducts = async () => {
    const result = await productController.getAllProducts();
    if (result.success && result.products) {
      setProducts(result.products);
    } else {
      setErrors(result.errors || ['Erro ao carregar produtos']);
    }
  };

  const loadCategories = async () => {
    const result = await productController.getCategories();
    if (result.success && result.categories) {
      setCategories(result.categories);
    }
  };

  const loadSuppliers = async () => {
    const result = await productController.getSuppliers();
    if (result.success && result.suppliers) {
      setSuppliers(result.suppliers);
    }
  };

  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    if (term.trim()) {
      const categoryId = categoryFilter ? parseInt(categoryFilter) : undefined;
      const result = await productController.searchProducts(term, categoryId);
      if (result.success && result.products) {
        setProducts(result.products);
      }
    } else {
      loadProducts();
    }
  };

  const handleSubmit = async (productData: any) => {
    setIsLoading(true);
    setErrors([]);
    
    try {
      let result;
      if (editingProduct) {
        result = await productController.updateProduct(editingProduct.id, productData);
      } else {
        result = await productController.createProduct(productData);
      }

      if (result.success) {
        setSuccessMessage(editingProduct ? 'Produto atualizado com sucesso!' : 'Produto criado com sucesso!');
        setShowModal(false);
        setEditingProduct(null);
        await loadProducts();
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setErrors(result.errors || ['Erro desconhecido']);
      }
    } catch (error) {
      setErrors(['Erro interno do sistema']);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setErrors([]);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      const result = await productController.deleteProduct(id);
      if (result.success) {
        setSuccessMessage('Produto excluído com sucesso!');
        await loadProducts();
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setErrors(result.errors || ['Erro ao excluir produto']);
      }
    }
  };

  const adjustStock = async (id: number, adjustment: number) => {
    const result = await productController.adjustStock(id, adjustment);
    if (result.success) {
      await loadProducts();
    } else {
      setErrors(result.errors || ['Erro ao ajustar estoque']);
      setTimeout(() => setErrors([]), 3000);
    }
  };

  const openModal = () => {
    setEditingProduct(null);
    setErrors([]);
    setShowModal(true);
  };

  if (isPageLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Carregando produtos...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gerenciamento de Produtos</h1>
          <p className="text-gray-600">Gerencie o estoque de produtos</p>
        </div>
        <button
          onClick={openModal}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Novo Produto</span>
        </button>
      </div>

      {successMessage && <SuccessMessage message={successMessage} />}
      {errors.length > 0 && <ErrorMessage errors={errors} />}

      {/* Filters */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por nome ou código de barras..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todas as categorias</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Código de Barras
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoria
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Preço
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estoque
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fornecedor
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {product.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.barcode}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      {product.category.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {ProductModel.formatPrice(product.price)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm font-medium ${
                        ProductModel.isLowStock(product) ? 'text-red-600' : 'text-gray-900'
                      }`}>
                        {product.stockQuantity}
                      </span>
                      {ProductModel.isLowStock(product) && (
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                      )}
                      <div className="flex space-x-1">
                        <button
                          onClick={() => adjustStock(product.id, -1)}
                          className="w-6 h-6 bg-red-100 text-red-600 rounded text-xs hover:bg-red-200"
                        >
                          -
                        </button>
                        <button
                          onClick={() => adjustStock(product.id, 1)}
                          className="w-6 h-6 bg-green-100 text-green-600 rounded text-xs hover:bg-green-200"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.supplier.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {products.length === 0 && !isPageLoading && (
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum produto encontrado</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 'Tente ajustar sua busca.' : 'Comece criando um novo produto.'}
          </p>
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingProduct ? 'Editar Produto' : 'Novo Produto'}
        size="lg"
      >
        {errors.length > 0 && <ErrorMessage errors={errors} className="mb-4" />}
        <ProductForm
          product={editingProduct}
          categories={categories}
          suppliers={suppliers}
          onSubmit={handleSubmit}
          onCancel={() => setShowModal(false)}
          isLoading={isLoading}
        />
      </Modal>
    </div>
  );
};

export default ProductsView;