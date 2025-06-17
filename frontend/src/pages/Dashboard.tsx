import React from 'react';
import { Users, Package, ShoppingCart, TrendingUp, AlertTriangle, DollarSign } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { mockProducts, mockSales, mockUsers } from '../data/mockData';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const totalProducts = mockProducts.length;
  const lowStockProducts = mockProducts.filter(p => p.stockQuantity < 10).length;
  const totalSales = mockSales.length;
  const totalRevenue = mockSales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  const totalUsers = mockUsers.filter(u => u.isActive).length;

  const stats = [
    {
      name: 'Total de Produtos',
      value: totalProducts,
      icon: Package,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      name: 'Produtos em Baixo Estoque',
      value: lowStockProducts,
      icon: AlertTriangle,
      color: 'bg-orange-500',
      textColor: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      name: 'Vendas Hoje',
      value: totalSales,
      icon: ShoppingCart,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      name: 'Receita Total',
      value: `R$ ${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  const recentSales = mockSales.slice(0, 3);
  const lowStockItems = mockProducts.filter(p => p.stockQuantity < 10);

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Bem-vindo, {user?.firstName}!
        </h1>
        <p className="text-blue-100">
          Aqui está um resumo das atividades do sistema hoje.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Sales */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Vendas Recentes</h2>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="space-y-4">
            {recentSales.map((sale) => (
              <div key={sale.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Venda #{sale.id}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(sale.saleDate).toLocaleDateString('pt-BR')} - {sale.user.firstName}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">R$ {sale.totalAmount.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">{sale.paymentMethod}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Estoque Baixo</h2>
            <AlertTriangle className="w-5 h-5 text-orange-500" />
          </div>
          <div className="space-y-4">
            {lowStockItems.length > 0 ? (
              lowStockItems.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.category.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-orange-600">{product.stockQuantity} unidades</p>
                    <p className="text-xs text-orange-500">Estoque baixo</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">Todos os produtos com estoque adequado</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {user?.role.authority === 'GERENTE' && (
            <>
              <button className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-left">
                <Users className="w-6 h-6 text-blue-600 mb-2" />
                <p className="font-medium text-gray-900">Gerenciar Usuários</p>
                <p className="text-sm text-gray-600">Adicionar ou editar funcionários</p>
              </button>
              <button className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-left">
                <Package className="w-6 h-6 text-green-600 mb-2" />
                <p className="font-medium text-gray-900">Cadastrar Produto</p>
                <p className="text-sm text-gray-600">Adicionar novo produto ao estoque</p>
              </button>
            </>
          )}
          {user?.role.authority === 'CAIXA' && (
            <button className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-left">
              <ShoppingCart className="w-6 h-6 text-purple-600 mb-2" />
              <p className="font-medium text-gray-900">Abrir PDV</p>
              <p className="text-sm text-gray-600">Iniciar ponto de venda</p>
            </button>
          )}
          {user?.role.authority === 'ESTOQUISTA' && (
            <button className="p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors text-left">
              <Package className="w-6 h-6 text-orange-600 mb-2" />
              <p className="font-medium text-gray-900">Ajustar Estoque</p>
              <p className="text-sm text-gray-600">Atualizar quantidades</p>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;