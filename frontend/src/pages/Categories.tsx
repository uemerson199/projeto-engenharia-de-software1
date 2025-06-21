import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Tag, Loader2 } from 'lucide-react';
import { CategoryController } from '../controllers/CategoryController';
import { Category } from '../models/Category';
import ErrorMessage from '../views/components/ErrorMessage';
import SuccessMessage from '../views/components/SuccessMessage';

const Categories: React.FC = () => {
  const [categoryController] = useState(() => new CategoryController());
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setIsPageLoading(true);
    const result = await categoryController.getAllCategories();
    if (result.success && result.categories) {
      setCategories(result.categories);
    } else {
      setErrors(result.errors || ['Erro ao carregar categorias']);
    }
    setIsPageLoading(false);
  };

  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    if (term.trim()) {
      const result = await categoryController.searchCategories(term);
      if (result.success && result.categories) {
        setCategories(result.categories);
      }
    } else {
      loadCategories();
    }
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors([]);

    try {
      let result;
      if (editingCategory) {
        result = await categoryController.updateCategory(editingCategory.id, formData);
      } else {
        result = await categoryController.createCategory(formData);
      }

      if (result.success) {
        setSuccessMessage(editingCategory ? 'Categoria atualizada com sucesso!' : 'Categoria criada com sucesso!');
        setShowModal(false);
        setEditingCategory(null);
        setFormData({ name: '', description: '' });
        await loadCategories();
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

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description
    });
    setErrors([]);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir esta categoria?')) {
      const result = await categoryController.deleteCategory(id);
      if (result.success) {
        setSuccessMessage('Categoria excluída com sucesso!');
        await loadCategories();
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setErrors(result.errors || ['Erro ao excluir categoria']);
      }
    }
  };

  const openModal = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '' });
    setErrors([]);
    setShowModal(true);
  };

  if (isPageLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Carregando categorias...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gerenciamento de Categorias</h1>
          <p className="text-gray-600">Gerencie as categorias de produtos</p>
        </div>
        <button
          onClick={openModal}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Nova Categoria</span>
        </button>
      </div>

      {successMessage && <SuccessMessage message={successMessage} />}
      {errors.length > 0 && <ErrorMessage errors={errors} />}

      {/* Search */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar categorias..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category) => (
          <div key={category.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Tag className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(category)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Editar"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Excluir"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-gray-600 text-sm">
              {category.description || 'Sem descrição'}
            </p>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredCategories.length === 0 && (
        <div className="text-center py-12">
          <Tag className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma categoria encontrada</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 'Tente ajustar sua busca.' : 'Comece criando uma nova categoria.'}
          </p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
            </h2>
            
            {errors.length > 0 && <ErrorMessage errors={errors} className="mb-4" />}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome da Categoria
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Bebidas, Limpeza, Alimentação"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição (Opcional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Descreva o tipo de produtos desta categoria..."
                  disabled={isLoading}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  disabled={isLoading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                  {isLoading ? 'Salvando...' : (editingCategory ? 'Salvar' : 'Criar')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;