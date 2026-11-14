import { db } from './connection';

// ============================================================
// 2. SCHEMA — CRIAÇÃO DAS TABELAS
// ============================================================
// Aqui definimos a estrutura do banco. Cada tabela corresponde a uma
// entidade do nosso app de estoque.
//
// As tabelas são:
//   - categories  : categorias de produtos (ex: Grãos, Laticínios)
//   - products    : produtos do inventário
//   - movements   : entrada e saída de estoque
//
// Usamos 'IF NOT EXISTS' para não dar erro se o banco já foi criado.
// ============================================================

export function initDatabase(): void {
  
/*
   db.execSync(`
    DROP TABLE IF EXISTS categories;
    DROP TABLE IF EXISTS products; 
    DROP TABLE IF EXISTS movements; 
  `);
 */  

  // ----------------------------------------------------------
  // Tabela: categories
  // ----------------------------------------------------------
  db.execSync(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      color TEXT
    );
  `);

  // ----------------------------------------------------------
  // Tabela: products
  // ----------------------------------------------------------
  db.execSync(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      barcode TEXT UNIQUE,
      name TEXT NOT NULL,
      description TEXT,
      quantity INTEGER NOT NULL DEFAULT 0,
      min_quantity INTEGER,
      unit_type TEXT NOT NULL DEFAULT 'unidade(s)',
      unit_price REAL,
      price REAL,
      category_id INTEGER,
      created_at TEXT,
      updated_at TEXT,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
    );
  `);

  // ----------------------------------------------------------
  // Tabela: movements
  // ----------------------------------------------------------
  db.execSync(`
    CREATE TABLE IF NOT EXISTS movements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('in', 'out')),
      quantity INTEGER NOT NULL,
      created_at TEXT,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );
  `);
}

/**
 * Verifica se as tabelas foram criadas com sucesso.
 * Retorna true se todas as três tabelas existirem.
 */
export function checkTables(): boolean {
  const categories = db.getAllSync(`SELECT name FROM sqlite_master WHERE type='table' AND name='categories'`);
  const products = db.getAllSync(`SELECT name FROM sqlite_master WHERE type='table' AND name='products'`);
  const movements = db.getAllSync(`SELECT name FROM sqlite_master WHERE type='table' AND name='movements'`);

  const allOk = categories.length > 0 && products.length > 0 && movements.length > 0;

  console.log('Tabelas criadas:', {
    categories: categories.length > 0,
    products: products.length > 0,
    movements: movements.length > 0,
  });

  return allOk;
}