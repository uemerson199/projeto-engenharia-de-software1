export interface Supplier {
  id: number;
  name: string;
  contactName: string;
  phone: string;
  email: string;
  cnpj: string;
  isActive: boolean;
}

export class SupplierModel {
  static validate(supplierData: Partial<Supplier>): string[] {
    const errors: string[] = [];
    
    if (!supplierData.name?.trim()) {
      errors.push('Nome da empresa é obrigatório');
    }
    
    if (!supplierData.contactName?.trim()) {
      errors.push('Nome do contato é obrigatório');
    }
    
    if (!supplierData.phone?.trim()) {
      errors.push('Telefone é obrigatório');
    }
    
    if (!supplierData.email?.trim()) {
      errors.push('Email é obrigatório');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(supplierData.email)) {
      errors.push('Email deve ter um formato válido');
    }
    
    if (!supplierData.cnpj?.trim()) {
      errors.push('CNPJ é obrigatório');
    }
    
    return errors;
  }

  static formatCNPJ(cnpj: string): string {
    return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }

  static formatPhone(phone: string): string {
    return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
}