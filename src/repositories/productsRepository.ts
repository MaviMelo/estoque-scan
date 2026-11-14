import { db } from '../db/connection';
import { Product, ProductInput } from '../models/product';

export const productsRepository = {
  /** Lista todos os produtos com o nome da categoria (se houver). */
  listAll(): Product[] {
    const rows = db.getAllSync(`
      SELECT p.id, p.barcode, p.name, p.description, p.quantity,
             p.min_quantity, p.unit_type, p.unit_price, p.price,
             p.category_id, p.created_at, p.updated_at,
             c.name AS category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.name ASC
    `) as any[];
    return rows.map((row) => ({
      id: row.id as number,
      barcode: row.barcode as string | undefined,
      name: row.name as string,
      description: row.description as string | undefined,
      quantity: row.quantity as number,
      min_quantity: row.min_quantity as number | undefined,
      unit_type: row.unit_type as string,
      unit_price: row.unit_price as number | undefined,
      price: row.price as number | undefined,
      category_id: row.category_id as number | undefined,
      category_name: row.category_name as string | undefined,
      created_at: row.created_at as string | undefined,
      updated_at: row.updated_at as string | undefined,
    }));
  },

  /** Busca produto pelo ID. Retorna undefined se não encontrar. */
  findById(id: number): Product | undefined {
    const rows = db.getAllSync(
      `SELECT p.id, p.barcode, p.name, p.description, p.quantity,
             p.min_quantity, p.unit_type, p.unit_price, p.price,
             p.category_id, p.created_at, p.updated_at,
             c.name AS category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?`,
      [id]
    ) as any[];
    if (rows.length === 0) return undefined;
    return mapProductRow(rows[0]);
  },

  /** Busca produto pelo código de barras. Retorna undefined se não encontrar. */
  findByBarcode(barcode: string): Product | undefined {
    const rows = db.getAllSync(
      `SELECT p.id, p.barcode, p.name, p.description, p.quantity,
             p.min_quantity, p.unit_type, p.unit_price, p.price,
             p.category_id, p.created_at, p.updated_at,
             c.name AS category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.barcode = ?`,
      [barcode]
    ) as any[];
    if (rows.length === 0) return undefined;
    return mapProductRow(rows[0]);
  },

  /** Lista produtos filtrando por categoria (se categoryId for fornecido) e/ou busca por texto. */
  listFiltered({
    categoryId,
    search,
  }: { categoryId?: number; search?: string } = {}): Product[] {
    let sql = `
      SELECT p.id, p.barcode, p.name, p.description, p.quantity,
             p.min_quantity, p.unit_type, p.unit_price, p.price,
             p.category_id, p.created_at, p.updated_at,
             c.name AS category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1 = 1
    `;
    const params: (string | number)[] = [];

    if (categoryId !== undefined) {
      sql += ` AND p.category_id = ?`;
      params.push(categoryId);
    }

    if (search) {
      sql += ` AND (p.name LIKE ? OR p.barcode LIKE ?)`;
      const like = `%${search}%`;
      params.push(like, like);
    }

    sql += ` ORDER BY p.name ASC`;

    const rows = db.getAllSync(sql, params) as any[];
    return rows.map((row) => mapProductRow(row));
  },

  /** Cria um novo produto e retorna o objeto com o ID gerado. */
  create(input: ProductInput): Product {
    const now = new Date().toISOString();
    const result = db.runSync(
      `INSERT INTO products (barcode, name, description, quantity, min_quantity,
        unit_type, unit_price, price, category_id, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        input.barcode ?? null,
        input.name,
        input.description ?? null,
        input.quantity ?? 0,
        input.min_quantity ?? null,
        input.unit_type ?? 'unidade(s)',
        input.unit_price ?? null,
        input.price ?? null,
        input.category_id ?? null,
        now,
        now,
      ]
    );
    const id = result.lastInsertRowId as number;
    return this.findById(id)!;
  },

  /** Atualiza um produto existente. Retorna true se atualizou algo. */
  update(id: number, input: Partial<ProductInput>): boolean {
    const fields: string[] = [];
    const params: (string | number | null)[] = [];

    const writable: (keyof ProductInput)[] = [
      'barcode', 'name', 'description', 'quantity', 'min_quantity',
      'unit_type', 'unit_price', 'price', 'category_id',
    ];

    for (const key of writable) {
      if (input[key] !== undefined) {
        fields.push(`${key} = ?`);
        params.push(input[key]);
      }
    }

    if (fields.length === 0) return false;

    fields.push('updated_at = ?');
    params.push(new Date().toISOString());
    params.push(id);

    const result = db.runSync(
      `UPDATE products SET ${fields.join(', ')} WHERE id = ?`,
      params
    );
    return (result.changes as number) > 0;
  },

  /** Exclui um produto pelo ID. Movimentações vinculadas são excluídas em cascata. */
  delete(id: number): boolean {
    const result = db.runSync(`DELETE FROM products WHERE id = ?`, [id]);
    return (result.changes as number) > 0;
  },

  /** Atualiza a quantidade de um produto (usado por entrada/saída de estoque). */
  updateQuantity(id: number, quantity: number): boolean {
    const result = db.runSync(
      `UPDATE products SET quantity = ?, updated_at = ? WHERE id = ?`,
      [quantity, new Date().toISOString(), id]
    );
    return (result.changes as number) > 0;
  },

  /** Soma/subtrai quantidade (entrada adiciona, saída subtrai). */
  adjustQuantity(id: number, delta: number): boolean {
    const product = this.findById(id);
    if (!product) return false;
    const newQty = Math.max(0, (product.quantity ?? 0) + delta);
    return this.updateQuantity(id, newQty);
  },
};

function mapProductRow(row: any): Product {
  return {
    id: row.id as number,
    barcode: row.barcode as string | undefined,
    name: row.name as string,
    description: row.description as string | undefined,
    quantity: row.quantity as number,
    min_quantity: row.min_quantity as number | undefined,
    unit_type: row.unit_type as string,
    unit_price: row.unit_price as number | undefined,
    price: row.price as number | undefined,
    category_id: row.category_id as number | undefined,
    category_name: row.category_name as string | undefined,
    created_at: row.created_at as string | undefined,
    updated_at: row.updated_at as string | undefined,
  };
}
