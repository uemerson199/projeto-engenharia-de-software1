import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, UserCheck, UserX, Loader2 } from 'lucide-react';
import { UserController } from '../../controllers/UserController';
import { User, Role } from '../../models/User';
import UserForm from '../components/UserForm';
import Modal from '../components/Modal';
import ErrorMessage from '../components/ErrorMessage';
import SuccessMessage from '../components/SuccessMessage';

const UsersView: React.FC = () => {
  const [userController] = useState(() => new UserController());
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setIsPageLoading(true);
    await Promise.all([loadUsers(), loadRoles()]);
    setIsPageLoading(false);
  };

  const loadUsers = async () => {
    const result = await userController.getAllUsers();
    if (result.success && result.users) {
      setUsers(result.users);
    } else {
      setErrors(result.errors || ['Erro ao carregar usuários']);
    }
  };

  const loadRoles = async () => {
    const result = await userController.getRoles();
    if (result.success && result.roles) {
      setRoles(result.roles);
    } else {
      setErrors(result.errors || ['Erro ao carregar cargos']);
    }
  };

  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    if (term.trim()) {
      const result = await userController.searchUsers(term);
      if (result.success && result.users) {
        setUsers(result.users);
      }
    } else {
      loadUsers();
    }
  };

  const handleSubmit = async (userData: any) => {
    setIsLoading(true);
    setErrors([]);
    
    try {
      let result;
      if (editingUser) {
        result = await userController.updateUser(editingUser.id, userData);
      } else {
        result = await userController.createUser(userData);
      }

      if (result.success) {
        setSuccessMessage(editingUser ? 'Usuário atualizado com sucesso!' : 'Usuário criado com sucesso!');
        setShowModal(false);
        setEditingUser(null);
        await loadUsers();
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

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setErrors([]);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      const result = await userController.deleteUser(id);
      if (result.success) {
        setSuccessMessage('Usuário excluído com sucesso!');
        await loadUsers();
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setErrors(result.errors || ['Erro ao excluir usuário']);
      }
    }
  };

  const toggleUserStatus = async (id: number) => {
    const result = await userController.toggleUserStatus(id);
    if (result.success) {
      setSuccessMessage('Status do usuário atualizado!');
      await loadUsers();
      setTimeout(() => setSuccessMessage(''), 3000);
    } else {
      setErrors(result.errors || ['Erro ao atualizar status']);
    }
  };

  const openModal = () => {
    setEditingUser(null);
    setErrors([]);
    setShowModal(true);
  };

  if (isPageLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Carregando usuários...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gerenciamento de Funcionários</h1>
          <p className="text-gray-600">Gerencie os usuários do sistema</p>
        </div>
        <button
          onClick={openModal}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Novo Funcionário</span>
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
            placeholder="Buscar por nome ou email..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Funcionário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Função
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data de Cadastro
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">
                          {user.firstName[0]}{user.lastName[0]}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {user.role.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.isActive ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => toggleUserStatus(user.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          user.isActive
                            ? 'text-red-600 hover:bg-red-50'
                            : 'text-green-600 hover:bg-green-50'
                        }`}
                        title={user.isActive ? 'Desativar' : 'Ativar'}
                      >
                        {user.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleEdit(user)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
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
      {users.length === 0 && !isPageLoading && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum usuário encontrado</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 'Tente ajustar sua busca.' : 'Comece criando um novo funcionário.'}
          </p>
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingUser ? 'Editar Funcionário' : 'Novo Funcionário'}
      >
        {errors.length > 0 && <ErrorMessage errors={errors} className="mb-4" />}
        <UserForm
          user={editingUser}
          roles={roles}
          onSubmit={handleSubmit}
          onCancel={() => setShowModal(false)}
          isLoading={isLoading}
        />
      </Modal>
    </div>
  );
};

export default UsersView;