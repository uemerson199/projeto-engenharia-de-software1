import { User } from './User';
import { Product } from './Product';

export interface Sale {
  id: number;
  saleDate: string;
  totalAmount: number;
  paymentMethod: string;
  user: User;
  items: SaleItem[];
  status: 'COMPLETED' | 'CANCELLED' | 'REFUNDED';
}

export interface SaleItem {
  id: number;
  quantity: number;
  priceAtSale: number;
  product: Product;
}

export interface CartItem {
  product: Product;
  quantity: number;
  subtotal: number;
}

export class SaleModel {
  static calculateTotal(items: CartItem[]): number {
    return items.reduce((total, item) => total + item.subtotal, 0);
  }

  static validateSale(items: CartItem[], paymentMethod: string): string[] {
    const errors: string[] = [];
    
    if (items.length === 0) {
      errors.push('Adicione pelo menos um produto à venda');
    }
    
    if (!paymentMethod) {
      errors.push('Selecione um método de pagamento');
    }
    
    return errors;
  }

  static formatPaymentMethod(method: string): string {
    const methods: { [key: string]: string } = {
      'DINHEIRO': 'Dinheiro',
      'CARTAO': 'Cartão',
      'PIX': 'PIX'
    };
    return methods[method] || method;
  }

  static formatStatus(status: string): string {
    const statuses: { [key: string]: string } = {
      'COMPLETED': 'Concluída',
      'CANCELLED': 'Cancelada',
      'REFUNDED': 'Estornada'
    };
    return statuses[status] || status;
  }

  static getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'COMPLETED': 'bg-green-100 text-green-800',
      'CANCELLED': 'bg-red-100 text-red-800',
      'REFUNDED': 'bg-yellow-100 text-yellow-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  }
}