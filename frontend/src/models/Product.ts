import { Category } from './Category';
import { Supplier } from './Supplier';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  barcode: string;
  category: Category;
  supplier: Supplier;
  isActive: boolean;
}

export class ProductModel {
  static validate(productData: Partial<Product>): string[] {
    const errors: string[] = [];
    
    if (!productData.name?.trim()) {
      errors.push('Nome do produto é obrigatório');
    }
    
    if (!productData.barcode?.trim()) {
      errors.push('Código de barras é obrigatório');
    }
    
    if (productData.price === undefined || productData.price <= 0) {
      errors.push('Preço deve ser maior que zero');
    }
    
    if (productData.stockQuantity === undefined || productData.stockQuantity < 0) {
      errors.push('Quantidade em estoque não pode ser negativa');
    }
    
    return errors;
  }

  static isLowStock(product: Product, threshold: number = 10): boolean {
    return product.stockQuantity < threshold;
  }

  static calculateSubtotal(product: Product, quantity: number): number {
    return product.price * quantity;
  }

  static formatPrice(price: number): string {
    return `R$ ${price.toFixed(2)}`;
  }

  static isAvailable(product: Product): boolean {
    return product.isActive && product.stockQuantity > 0;
  }
}