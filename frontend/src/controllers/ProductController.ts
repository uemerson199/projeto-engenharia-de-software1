import { Product, ProductModel } from '../models/Product';
import { mockProducts, mockCategories, mockSuppliers } from '../data/mockData';

export class ProductController {
  private products: Product[] = [...mockProducts];

  getAllProducts(): Product[] {
    return this.products;
  }

  getProductById(id: number): Product | null {
    return this.products.find(product => product.id === id) || null;
  }

  getProductByBarcode(barcode: string): Product | null {
    return this.products.find(product => product.barcode === barcode) || null;
  }

  createProduct(productData: Omit<Product, 'id'>): { success: boolean; product?: Product; errors?: string[] } {
    const errors = ProductModel.validate(productData);
    
    if (errors.length > 0) {
      return { success: false, errors };
    }

    if (this.products.some(product => product.barcode === productData.barcode)) {
      return { success: false, errors: ['Código de barras já está em uso'] };
    }

    const newProduct: Product = {
      ...productData,
      id: Math.max(...this.products.map(p => p.id)) + 1
    };

    this.products.push(newProduct);
    return { success: true, product: newProduct };
  }

  updateProduct(id: number, productData: Partial<Product>): { success: boolean; product?: Product; errors?: string[] } {
    const productIndex = this.products.findIndex(product => product.id === id);
    
    if (productIndex === -1) {
      return { success: false, errors: ['Produto não encontrado'] };
    }

    const errors = ProductModel.validate({ ...this.products[productIndex], ...productData });
    
    if (errors.length > 0) {
      return { success: false, errors };
    }

    if (productData.barcode && this.products.some(product => product.barcode === productData.barcode && product.id !== id)) {
      return { success: false, errors: ['Código de barras já está em uso'] };
    }

    this.products[productIndex] = { ...this.products[productIndex], ...productData };
    return { success: true, product: this.products[productIndex] };
  }

  deleteProduct(id: number): { success: boolean; errors?: string[] } {
    const productIndex = this.products.findIndex(product => product.id === id);
    
    if (productIndex === -1) {
      return { success: false, errors: ['Produto não encontrado'] };
    }

    this.products.splice(productIndex, 1);
    return { success: true };
  }

  adjustStock(id: number, adjustment: number): { success: boolean; product?: Product; errors?: string[] } {
    const productIndex = this.products.findIndex(product => product.id === id);
    
    if (productIndex === -1) {
      return { success: false, errors: ['Produto não encontrado'] };
    }

    const newQuantity = this.products[productIndex].stockQuantity + adjustment;
    
    if (newQuantity < 0) {
      return { success: false, errors: ['Estoque não pode ser negativo'] };
    }

    this.products[productIndex].stockQuantity = newQuantity;
    return { success: true, product: this.products[productIndex] };
  }

  searchProducts(term: string, categoryId?: number): Product[] {
    const searchTerm = term.toLowerCase();
    return this.products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm) ||
                           product.barcode.includes(searchTerm);
      const matchesCategory = !categoryId || product.category.id === categoryId;
      return matchesSearch && matchesCategory;
    });
  }

  getLowStockProducts(threshold: number = 10): Product[] {
    return this.products.filter(product => ProductModel.isLowStock(product, threshold));
  }

  getCategories() {
    return mockCategories;
  }

  getSuppliers() {
    return mockSuppliers;
  }
}