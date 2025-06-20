import { Category, CategoryModel } from '../models/Category';
import { mockCategories } from '../data/mockData';

export class CategoryController {
  private categories: Category[] = [...mockCategories];

  getAllCategories(): Category[] {
    return this.categories;
  }

  getCategoryById(id: number): Category | null {
    return this.categories.find(category => category.id === id) || null;
  }

  createCategory(categoryData: Omit<Category, 'id'>): { success: boolean; category?: Category; errors?: string[] } {
    const errors = CategoryModel.validate(categoryData);
    
    if (errors.length > 0) {
      return { success: false, errors };
    }

    if (this.categories.some(category => category.name.toLowerCase() === categoryData.name.toLowerCase())) {
      return { success: false, errors: ['Nome da categoria já existe'] };
    }

    const newCategory: Category = {
      ...categoryData,
      id: Math.max(...this.categories.map(c => c.id)) + 1
    };

    this.categories.push(newCategory);
    return { success: true, category: newCategory };
  }

  updateCategory(id: number, categoryData: Partial<Category>): { success: boolean; category?: Category; errors?: string[] } {
    const categoryIndex = this.categories.findIndex(category => category.id === id);
    
    if (categoryIndex === -1) {
      return { success: false, errors: ['Categoria não encontrada'] };
    }

    const errors = CategoryModel.validate({ ...this.categories[categoryIndex], ...categoryData });
    
    if (errors.length > 0) {
      return { success: false, errors };
    }

    if (categoryData.name && this.categories.some(category => 
      category.name.toLowerCase() === categoryData.name!.toLowerCase() && category.id !== id)) {
      return { success: false, errors: ['Nome da categoria já existe'] };
    }

    this.categories[categoryIndex] = { ...this.categories[categoryIndex], ...categoryData };
    return { success: true, category: this.categories[categoryIndex] };
  }

  deleteCategory(id: number): { success: boolean; errors?: string[] } {
    const categoryIndex = this.categories.findIndex(category => category.id === id);
    
    if (categoryIndex === -1) {
      return { success: false, errors: ['Categoria não encontrada'] };
    }

    this.categories.splice(categoryIndex, 1);
    return { success: true };
  }

  searchCategories(term: string): Category[] {
    const searchTerm = term.toLowerCase();
    return this.categories.filter(category =>
      category.name.toLowerCase().includes(searchTerm) ||
      category.description.toLowerCase().includes(searchTerm)
    );
  }
}