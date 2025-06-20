export interface Category {
  id: number;
  name: string;
  description: string;
}

export class CategoryModel {
  static validate(categoryData: Partial<Category>): string[] {
    const errors: string[] = [];
    
    if (!categoryData.name?.trim()) {
      errors.push('Nome da categoria é obrigatório');
    }
    
    return errors;
  }

  static formatForDisplay(category: Category): string {
    return category.name;
  }
}