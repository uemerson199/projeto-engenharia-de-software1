import { Sale, SaleItem, CartItem, SaleModel } from '../models/Sale';
import { User } from '../models/User';
import { mockSales } from '../data/mockData';

export class SaleController {
  private sales: Sale[] = [...mockSales];

  getAllSales(): Sale[] {
    return this.sales;
  }

  getSaleById(id: number): Sale | null {
    return this.sales.find(sale => sale.id === id) || null;
  }

  createSale(cartItems: CartItem[], paymentMethod: string, user: User): { success: boolean; sale?: Sale; errors?: string[] } {
    const errors = SaleModel.validateSale(cartItems, paymentMethod);
    
    if (errors.length > 0) {
      return { success: false, errors };
    }

    const totalAmount = SaleModel.calculateTotal(cartItems);
    
    const saleItems: SaleItem[] = cartItems.map((item, index) => ({
      id: index + 1,
      quantity: item.quantity,
      priceAtSale: item.product.price,
      product: item.product
    }));

    const newSale: Sale = {
      id: Math.max(...this.sales.map(s => s.id)) + 1,
      saleDate: new Date().toISOString(),
      totalAmount,
      paymentMethod,
      user,
      items: saleItems,
      status: 'COMPLETED'
    };

    this.sales.push(newSale);
    return { success: true, sale: newSale };
  }

  updateSaleStatus(id: number, status: Sale['status']): { success: boolean; sale?: Sale; errors?: string[] } {
    const saleIndex = this.sales.findIndex(sale => sale.id === id);
    
    if (saleIndex === -1) {
      return { success: false, errors: ['Venda não encontrada'] };
    }

    this.sales[saleIndex].status = status;
    return { success: true, sale: this.sales[saleIndex] };
  }

  searchSales(term: string): Sale[] {
    const searchTerm = term.toLowerCase();
    return this.sales.filter(sale =>
      sale.id.toString().includes(searchTerm) ||
      sale.user.firstName.toLowerCase().includes(searchTerm) ||
      sale.user.lastName.toLowerCase().includes(searchTerm) ||
      sale.paymentMethod.toLowerCase().includes(searchTerm)
    );
  }

  getSalesByDateRange(startDate: string, endDate: string): Sale[] {
    return this.sales.filter(sale => {
      const saleDate = new Date(sale.saleDate).toISOString().split('T')[0];
      return saleDate >= startDate && saleDate <= endDate;
    });
  }

  getSalesByUser(userId: number): Sale[] {
    return this.sales.filter(sale => sale.user.id === userId);
  }

  getTotalRevenue(): number {
    return this.sales
      .filter(sale => sale.status === 'COMPLETED')
      .reduce((total, sale) => total + sale.totalAmount, 0);
  }

  getSalesCount(): number {
    return this.sales.filter(sale => sale.status === 'COMPLETED').length;
  }
}