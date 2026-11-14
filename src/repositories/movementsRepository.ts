import { db } from '../db/connection';
import { Movement, MovementInput, MovementType } from '../models/movement';

export const movementsRepository = {
  /** Lista todas as movimentações de um produto, ordenadas por data decrescente. */
  listByProduct(productId: number): Movement[] {
    const rows = db.getAllSync(
      `SELECT id, product_id, type, quantity, created_at
       FROM movements
       WHERE product_id = ?
       ORDER BY created_at DESC, id DESC`,
      [productId]
    ) as any[];
    return rows.map((row) => ({
      id: row.id as number,
      product_id: row.product_id as number,
      type: row.type as MovementType,
      quantity: row.quantity as number,
      created_at: row.created_at as string | undefined,
    }));
  },

  /** Lista todas as movimentações de todos os produtos, ordenadas por data decrescente. */
  listAll(): Movement[] {
    const rows = db.getAllSync(
      `SELECT id, product_id, type, quantity, created_at
       FROM movements
       ORDER BY created_at DESC, id DESC`
    ) as any[];
    return rows.map((row) => ({
      id: row.id as number,
      product_id: row.product_id as number,
      type: row.type as MovementType,
      quantity: row.quantity as number,
      created_at: row.created_at as string | undefined,
    }));
  },

  /** Registra uma movimentação e atualiza a quantidade do produto. */
  create(input: MovementInput): Movement {
    const now = new Date().toISOString();
    const result = db.runSync(
      `INSERT INTO movements (product_id, type, quantity, created_at)
       VALUES (?, ?, ?, ?)`,
      [input.product_id, input.type, input.quantity, now]
    );
    const id = result.lastInsertRowId as number;

    // Atualiza a quantidade do produto conforme o tipo
    if (input.type === 'in') {
      db.runSync(
        `UPDATE products SET quantity = quantity + ?, updated_at = ? WHERE id = ?`,
        [input.quantity, now, input.product_id]
      );
    } else {
      db.runSync(
        `UPDATE products SET quantity = MAX(0, quantity - ?), updated_at = ? WHERE id = ?`,
        [input.quantity, now, input.product_id]
      );
    }

    return { id, ...input, created_at: now };
  },
};
