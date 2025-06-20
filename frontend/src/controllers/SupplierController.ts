import { Supplier, SupplierModel } from '../models/Supplier';
import { mockSuppliers } from '../data/mockData';

export class SupplierController {
  private suppliers: Supplier[] = [...mockSuppliers];

  getAllSuppliers(): Supplier[] {
    return this.suppliers;
  }

  getSupplierById(id: number): Supplier | null {
    return this.suppliers.find(supplier => supplier.id === id) || null;
  }

  createSupplier(supplierData: Omit<Supplier, 'id'>): { success: boolean; supplier?: Supplier; errors?: string[] } {
    const errors = SupplierModel.validate(supplierData);
    
    if (errors.length > 0) {
      return { success: false, errors };
    }

    if (this.suppliers.some(supplier => supplier.cnpj === supplierData.cnpj)) {
      return { success: false, errors: ['CNPJ já está cadastrado'] };
    }

    if (this.suppliers.some(supplier => supplier.email === supplierData.email)) {
      return { success: false, errors: ['Email já está em uso'] };
    }

    const newSupplier: Supplier = {
      ...supplierData,
      id: Math.max(...this.suppliers.map(s => s.id)) + 1
    };

    this.suppliers.push(newSupplier);
    return { success: true, supplier: newSupplier };
  }

  updateSupplier(id: number, supplierData: Partial<Supplier>): { success: boolean; supplier?: Supplier; errors?: string[] } {
    const supplierIndex = this.suppliers.findIndex(supplier => supplier.id === id);
    
    if (supplierIndex === -1) {
      return { success: false, errors: ['Fornecedor não encontrado'] };
    }

    const errors = SupplierModel.validate({ ...this.suppliers[supplierIndex], ...supplierData });
    
    if (errors.length > 0) {
      return { success: false, errors };
    }

    if (supplierData.cnpj && this.suppliers.some(supplier => supplier.cnpj === supplierData.cnpj && supplier.id !== id)) {
      return { success: false, errors: ['CNPJ já está cadastrado'] };
    }

    if (supplierData.email && this.suppliers.some(supplier => supplier.email === supplierData.email && supplier.id !== id)) {
      return { success: false, errors: ['Email já está em uso'] };
    }

    this.suppliers[supplierIndex] = { ...this.suppliers[supplierIndex], ...supplierData };
    return { success: true, supplier: this.suppliers[supplierIndex] };
  }

  deleteSupplier(id: number): { success: boolean; errors?: string[] } {
    const supplierIndex = this.suppliers.findIndex(supplier => supplier.id === id);
    
    if (supplierIndex === -1) {
      return { success: false, errors: ['Fornecedor não encontrado'] };
    }

    this.suppliers.splice(supplierIndex, 1);
    return { success: true };
  }

  searchSuppliers(term: string): Supplier[] {
    const searchTerm = term.toLowerCase();
    return this.suppliers.filter(supplier =>
      supplier.name.toLowerCase().includes(searchTerm) ||
      supplier.contactName.toLowerCase().includes(searchTerm) ||
      supplier.cnpj.includes(searchTerm)
    );
  }
}