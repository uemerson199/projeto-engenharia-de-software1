import React, { useState, useEffect } from 'react';
import {
  Users,
  Package,
  ShoppingCart,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  Loader2,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
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
    totalUsers: 0,
  });

  const [recentSales, setRecentSales] = useState<Sale[]>([]);
  const [lowStockItems, setLowStockItems] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);

  const monthlySalesData = [
    { month: 'Jan', total: 4200 },
    { month: 'Fev', total: 5300 },
    { month: 'Mar', total: 4900 },
    { month: 'Abr', total: 6100 },
    { month: 'Mai', total: 7300 },
    { month: 'Jun', total: 6800 },
  ];

  const paymentData = [
    { method: 'Dinheiro', value: 3200 },
    { method: 'Cartão', value: 5400 },
    { method: 'PIX', value: 2800 },
  ];

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    setErrors([]);

    try {
      const productsResult = await productController.getAllProducts();
      let totalProducts = 0;
      let lowStockProducts: Product[] = [];

      if (productsResult.success && productsResult.products) {
        totalProducts = productsResult.products.length;
        lowStockProducts = productsResult.products.filter((p) => p.stockQuantity < 10);
      }

      const salesResult = await saleController.getAllSales();
      let totalSales = 0;
      let recentSalesData: Sale[] = [];

      if (salesResult.success && salesResult.sales) {
        totalSales = salesResult.sales.length;
        recentSalesData = salesResult.sales.slice(0, 3);
      }

      const revenueResult = await saleController.getTotalRevenue();
      const totalRevenue = revenueResult.success ? revenueResult.revenue || 0 : 0;

      let totalUsers = 0;
      if (user?.role.authority === 'GERENTE') {
        const usersResult = await userController.getAllUsers();
        if (usersResult.success && usersResult.users) {
          totalUsers = usersResult.users.filter((u) => u.isActive).length;
        }
      }

      setStats({
        totalProducts,
        lowStockProducts: lowStockProducts.length,
        totalSales,
        totalRevenue,
        totalUsers,
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
      textColor: 'text-blue-600 dark:text-blue-300',
      bgColor: 'bg-blue-50 dark:bg-blue-900/30',
    },
    {
      name: 'Produtos em Baixo Estoque',
      value: stats.lowStockProducts,
      icon: AlertTriangle,
      textColor: 'text-orange-600 dark:text-orange-300',
      bgColor: 'bg-orange-50 dark:bg-orange-900/30',
    },
    {
      name: 'Vendas Hoje',
      value: stats.totalSales,
      icon: ShoppingCart,
      textColor: 'text-green-600 dark:text-green-300',
      bgColor: 'bg-green-50 dark:bg-green-900/30',
    },
    {
      name: 'Receita Total',
      value: `R$ ${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      textColor: 'text-purple-600 dark:text-purple-300',
      bgColor: 'bg-purple-50 dark:bg-purple-900/30',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-300" />
        <span className="ml-2 text-gray-600 dark:text-gray-300">Carregando dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-900 dark:to-blue-950 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Bem-vindo, {user?.firstName}!</h1>
        <p className="text-blue-100 dark:text-blue-300">
          Aqui está um resumo das atividades do sistema hoje.
        </p>
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/40 border border-red-200 dark:border-red-700 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-500 dark:text-red-300 mr-3" />
            <div>
              {errors.map((error, index) => (
                <p key={index} className="text-sm text-red-700 dark:text-red-300">{error}</p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                  {stat.name}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent sales & low stock */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent Sales */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Vendas Recentes</h2>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="space-y-4">
            {recentSales.length > 0 ? (
              recentSales.map((sale) => (
                <div
                  key={sale.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Venda #{sale.id}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {new Date(sale.saleDate).toLocaleDateString('pt-BR')} - {sale.user.firstName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600 dark:text-green-300">
                      R$ {sale.totalAmount.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {sale.paymentMethod}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-300 text-center py-4">
                Nenhuma venda recente
              </p>
            )}
          </div>
        </div>

        {/* Low Stock */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Estoque Baixo</h2>
            <AlertTriangle className="w-5 h-5 text-orange-500" />
          </div>
          <div className="space-y-4">
            {lowStockItems.length > 0 ? (
              lowStockItems.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{product.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {product.category.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-orange-600 dark:text-orange-300">
                      {product.stockQuantity} unidades
                    </p>
                    <p className="text-xs text-orange-500 dark:text-orange-300">
                      Estoque baixo
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-300 text-center py-4">
                Todos os produtos com estoque adequado
              </p>
            )}
          </div>
        </div>

      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Bar chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Vendas por Mês
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlySalesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#99999920" />
              <XAxis dataKey="month" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', color: '#fff' }} />
              <Bar dataKey="total" fill="#3b82f6" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Vendas por Método de Pagamento
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={paymentData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(props) => {
                  const { name, percent } = props as { name?: string; percent?: number };
                  return (
                    <text
                      x={(props as any).cx}
                      y={(props as any).cy}
                      dy={(props as any).index * 18 - 30}
                      textAnchor="middle"
                      fill="#ccc"
                      fontSize={12}
                    >
                      {name}: {((percent || 0) * 100).toFixed(0)}%
                    </text>
                  );
                }}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {paymentData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={['#3b82f6', '#22c55e', '#f59e0b'][index % 3]}
                  />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', color: '#fff' }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Ações Rápidas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {user?.role.authority === 'GERENTE' && (
            <>
              <button className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors text-left">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-300 mb-2" />
                <p className="font-medium text-gray-900 dark:text-white">Gerenciar Usuários</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Adicionar ou editar funcionários
                </p>
              </button>

              <button className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors text-left">
                <Package className="w-6 h-6 text-green-600 dark:text-green-300 mb-2" />
                <p className="font-medium text-gray-900 dark:text-white">Cadastrar Produto</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Adicionar novo produto ao estoque
                </p>
              </button>
            </>
          )}

          {user?.role.authority === 'CAIXA' && (
            <button className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors text-left">
              <ShoppingCart className="w-6 h-6 text-purple-600 dark:text-purple-300 mb-2" />
              <p className="font-medium text-gray-900 dark:text-white">Abrir PDV</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Iniciar ponto de venda
              </p>
            </button>
          )}

          {user?.role.authority === 'ESTOQUISTA' && (
            <button className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-colors text-left">
              <Package className="w-6 h-6 text-orange-600 dark:text-orange-300 mb-2" />
              <p className="font-medium text-gray-900 dark:text-white">Ajustar Estoque</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Atualizar quantidades
              </p>
            </button>
          )}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
