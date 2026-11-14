import { db } from '../db/connection';
import { Category, CategoryInput } from '../models/category';

export const categoriesRepository = {
  /** Lista todas as categorias ordenadas por nome. */
  listAll(): Category[] {
    const rows = db.getAllSync(
      `SELECT id, name, color FROM categories ORDER BY name ASC`
    ) as any[];
    return rows.map((row) => ({
      id: row.id as number,
      name: row.name as string,
      color: row.color as string | undefined,
    }));
  },

  /** Busca uma categoria pelo ID. Retorna undefined se não encontrar. */
  findById(id: number): Category | undefined {
    const rows = db.getAllSync(
      `SELECT id, name, color FROM categories WHERE id = ?`,
      [id]
    ) as any[];
    if (rows.length === 0) return undefined;
    const row = rows[0];
    return {
      id: row.id as number,
      name: row.name as string,
      color: row.color as string | undefined,
    };
  },

  /** Busca categoria pelo nome. Retorna undefined se não encontrar. */
  findByName(name: string): Category | undefined {
    const rows = db.getAllSync(
      `SELECT id, name, color FROM categories WHERE name = ?`,
      [name]
    ) as any[];
    if (rows.length === 0) return undefined;
    const row = rows[0];
    return {
      id: row.id as number,
      name: row.name as string,
      color: row.color as string | undefined,
    };
  },

  /** Cria uma nova categoria e retorna o objeto com o ID gerado. */
  create(input: CategoryInput): Category {
    const result = db.runSync(
      `INSERT INTO categories (name, color) VALUES (?, ?)`,
      [input.name, input.color ?? null]
    );
    const id = result.lastInsertRowId as number;
    return { id, name: input.name, color: input.color };
  },

  /** Renomeia uma categoria existente. Retorna true se atualizou algo. */
  update(id: number, input: Partial<CategoryInput>): boolean {
    const fields: string[] = [];
    const params: (string | number | null)[] = [];

    if (input.name !== undefined) {
      fields.push('name = ?');
      params.push(input.name);
    }
    if (input.color !== undefined) {
      fields.push('color = ?');
      params.push(input.color);
    }

    if (fields.length === 0) return false;

    params.push(id);
    const result = db.runSync(
      `UPDATE categories SET ${fields.join(', ')} WHERE id = ?`,
      params
    );
    return (result.changes as number) > 0;
  },

  /** Exclui uma categoria pelo ID. Produtos vinculados ficam sem categoria (SET NULL). */
  delete(id: number): boolean {
    const result = db.runSync(`DELETE FROM categories WHERE id = ?`, [id]);
    return (result.changes as number) > 0;
  },
};
