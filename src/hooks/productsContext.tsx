import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { productsRepository } from '../repositories/productsRepository';
import { Product, ProductInput } from '../models/product';

interface ProductsContextType {
  products: Product[];
  loading: boolean;
  refresh: () => void;
  createProduct: (input: ProductInput) => Product | undefined;
  updateProduct: (id: number, input: Partial<ProductInput>) => boolean;
  deleteProduct: (id: number) => boolean;
  findByBarcode: (barcode: string) => Product | undefined;
  adjustQuantity: (id: number, delta: number) => boolean;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = () => {
    setLoading(true);
    try {
      setProducts(productsRepository.listAll());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const createProduct = (input: ProductInput): Product | undefined => {
    try {
      const created = productsRepository.create(input);
      refresh();
      return created;
    } catch {
      return undefined;
    }
  };

  const updateProduct = (id: number, input: Partial<ProductInput>): boolean => {
    const ok = productsRepository.update(id, input);
    if (ok) refresh();
    return ok;
  };

  const deleteProduct = (id: number): boolean => {
    const ok = productsRepository.delete(id);
    if (ok) refresh();
    return ok;
  };

  const findByBarcode = (barcode: string): Product | undefined => {
    return productsRepository.findByBarcode(barcode);
  };

  const adjustQuantity = (id: number, delta: number): boolean => {
    const ok = productsRepository.adjustQuantity(id, delta);
    if (ok) refresh();
    return ok;
  };

  return (
    <ProductsContext.Provider
      value={{
        products,
        loading,
        refresh,
        createProduct,
        updateProduct,
        deleteProduct,
        findByBarcode,
        adjustQuantity,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) {
    throw new Error('useProducts deve ser usado dentro de um ProductsProvider');
  }
  return ctx;
}
