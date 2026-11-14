import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { categoriesRepository } from '../repositories/categoriesRepository';
import { Category, CategoryInput } from '../models/category';

interface CategoriesContextType {
  categories: Category[];
  loading: boolean;
  refresh: () => void;
  createCategory: (input: CategoryInput) => Category | undefined;
  updateCategory: (id: number, input: Partial<CategoryInput>) => boolean;
  deleteCategory: (id: number) => boolean;
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

export function CategoriesProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = () => {
    setLoading(true);
    try {
      setCategories(categoriesRepository.listAll());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const createCategory = (input: CategoryInput): Category | undefined => {
    try {
      const created = categoriesRepository.create(input);
      refresh();
      return created;
    } catch {
      return undefined;
    }
  };

  const updateCategory = (id: number, input: Partial<CategoryInput>): boolean => {
    const ok = categoriesRepository.update(id, input);
    if (ok) refresh();
    return ok;
  };

  const deleteCategory = (id: number): boolean => {
    const ok = categoriesRepository.delete(id);
    if (ok) refresh();
    return ok;
  };

  return (
    <CategoriesContext.Provider
      value={{
        categories,
        loading,
        refresh,
        createCategory,
        updateCategory,
        deleteCategory,
      }}
    >
      {children}
    </CategoriesContext.Provider>
  );
}

export function useCategories() {
  const ctx = useContext(CategoriesContext);
  if (!ctx) {
    throw new Error('useCategories deve ser usado dentro de um CategoriesProvider');
  }
  return ctx;
}
