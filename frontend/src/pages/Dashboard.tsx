import React, { useState, useEffect } from 'react';
import { Users, Package, ShoppingCart, TrendingUp, AlertTriangle, DollarSign, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ProductController } from '../controllers/ProductController';
import { SaleController } from '../controllers/SaleController';
import { UserController } from '../controllers/UserController';
import { Product } from '../models/Product';
import { Sale } from '../models/Sale';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [productController] = useState(() => new ProductController());
  const [saleController] = useState(() => new SaleController());
  const [userController] = useState(() => new UserController());
  
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockProducts: 0,
    totalSales: 0,
    totalRevenue: 0,
    totalUsers: 0
  });
  
  const [recentSales, setRecentSales] = useState<Sale[]>([]);
  const [lowStockItems, setLowStockItems] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    setErrors([]);

    try {
      // Load products
      const productsResult = await productController.getAllProducts();
      let totalProducts = 0;
      let lowStockProducts: Product[] = [];
      
      if (productsResult.success && productsResult.products) {
        totalProducts = productsResult.products.length;
        lowStockProducts = productsResult.products.filter(p => p.stockQuantity < 10);
      }

      // Load sales
      const salesResult = await saleController.getAllSales();
      let totalSales = 0;
      let recentSalesData: Sale[] = [];
      
      if (salesResult.success && salesResult.sales) {
        totalSales = salesResult.sales.length;
        recentSalesData = salesResult.sales.slice(0, 3);
      }

      // Load revenue
      const revenueResult = await saleController.getTotalRevenue();
      const totalRevenue = revenueResult.success ? revenueResult.revenue || 0 : 0;

      // Load users (only for managers)
      let totalUsers = 0;
      if (user?.role.authority === 'GERENTE') {
        const usersResult = await userController.getAllUsers();
        if (usersResult.success && usersResult.users) {
          totalUsers = usersResult.users.filter(u => u.isActive).length;
        }
      }

      setStats({
        totalProducts,
        lowStockProducts: lowStockProducts.length,
        totalSales,
        totalRevenue,
        totalUsers
      });

      setRecentSales(recentSalesData);
      setLowStockItems(lowStockProducts);

    } catch (error) {
      setErrors(['Erro ao carregar dados do dashboard']);
    } finally {
      setIsLoading(false);
    }
  };

  const statsData = [
    {
      name: 'Total de Produtos',
      value: stats.totalProducts,
      icon: Package,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      name: 'Produtos em Baixo Estoque',
      value: stats.lowStockProducts,
      icon: AlertTriangle,
      color: 'bg-orange-500',
      textColor: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      name: 'Vendas Hoje',
      value: stats.totalSales,
      icon: ShoppingCart,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      name: 'Receita Total',
      value: `R$ ${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Carregando dashboard...</span>
      </div>
    );
  }

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

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-500 mr-3" />
            <div>
              {errors.map((error, index) => (
                <p key={index} className="text-sm text-red-700">{error}</p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
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
            {recentSales.length > 0 ? (
              recentSales.map((sale) => (
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
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">Nenhuma venda recente</p>
            )}
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