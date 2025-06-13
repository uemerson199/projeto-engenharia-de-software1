import { User, Product, Category, Supplier, Sale, Role } from '../types';

export const mockRoles: Role[] = [
  { id: 1, authority: 'GERENTE', name: 'Gerente' },
  { id: 2, authority: 'CAIXA', name: 'Caixa' },
  { id: 3, authority: 'ESTOQUISTA', name: 'Estoquista' }
];

export const mockUsers: User[] = [
  {
    id: 1,
    firstName: 'João',
    lastName: 'Silva',
    email: 'gerente@supermarket.com',
    password: '123456',
    role: mockRoles[0],
    isActive: true,
    createdAt: '2024-01-15'
  },
  {
    id: 2,
    firstName: 'Maria',
    lastName: 'Santos',
    email: 'caixa@supermarket.com',
    password: '123456',
    role: mockRoles[1],
    isActive: true,
    createdAt: '2024-01-20'
  },
  {
    id: 3,
    firstName: 'Pedro',
    lastName: 'Costa',
    email: 'estoque@supermarket.com',
    password: '123456',
    role: mockRoles[2],
    isActive: true,
    createdAt: '2024-01-25'
  }
];

export const mockCategories: Category[] = [
  { id: 1, name: 'Bebidas', description: 'Refrigerantes, sucos e água' },
  { id: 2, name: 'Limpeza', description: 'Produtos de limpeza doméstica' },
  { id: 3, name: 'Alimentação', description: 'Alimentos em geral' },
  { id: 4, name: 'Higiene', description: 'Produtos de higiene pessoal' }
];

export const mockSuppliers: Supplier[] = [
  {
    id: 1,
    name: 'Distribuidora ABC Ltda',
    contactName: 'Carlos Mendes',
    phone: '(11) 99999-1234',
    email: 'contato@abc.com.br',
    cnpj: '12.345.678/0001-90',
    isActive: true
  },
  {
    id: 2,
    name: 'Fornecedora XYZ S.A.',
    contactName: 'Ana Paula',
    phone: '(11) 88888-5678',
    email: 'vendas@xyz.com.br',
    cnpj: '98.765.432/0001-10',
    isActive: true
  }
];

export const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Coca-Cola 2L',
    description: 'Refrigerante de cola 2 litros',
    price: 8.99,
    stockQuantity: 50,
    barcode: '7894900011517',
    category: mockCategories[0],
    supplier: mockSuppliers[0],
    isActive: true
  },
  {
    id: 2,
    name: 'Detergente Ypê',
    description: 'Detergente líquido para louças 500ml',
    price: 2.49,
    stockQuantity: 30,
    barcode: '7891150047303',
    category: mockCategories[1],
    supplier: mockSuppliers[1],
    isActive: true
  },
  {
    id: 3,
    name: 'Arroz Tio João 5kg',
    description: 'Arroz branco tipo 1',
    price: 12.90,
    stockQuantity: 25,
    barcode: '7896036097892',
    category: mockCategories[2],
    supplier: mockSuppliers[0],
    isActive: true
  }
];

export const mockSales: Sale[] = [
  {
    id: 1,
    saleDate: '2024-01-15T10:30:00',
    totalAmount: 24.37,
    paymentMethod: 'DINHEIRO',
    user: mockUsers[1],
    status: 'COMPLETED',
    items: [
      {
        id: 1,
        quantity: 2,
        priceAtSale: 8.99,
        product: mockProducts[0]
      },
      {
        id: 2,
        quantity: 3,
        priceAtSale: 2.49,
        product: mockProducts[1]
      }
    ]
  }
];