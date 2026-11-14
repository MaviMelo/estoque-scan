import { openDatabaseSync } from 'expo-sqlite';

// ============================================================
// 1. CONEXÃO COM O BANCO SQLite
// ============================================================
// O SQLite armazena os dados em um arquivo no próprio celular.
// Não precisamos de servidor nem de internet.
//
// 'openDatabaseSync' abre (ou cria, se não existir) o banco de dados.
// O nome do arquivo será 'estoque.db'.
// ============================================================

export const db = openDatabaseSync('estoque.db');

/**
 * Fecha a conexão com o banco de dados.
 * Útil para liberar recursos quando o app é encerrado.
 */
export function closeDatabase(): void {
  // expo-sqlite não expõe um close direto em todas as versões.
  // Por enquanto, deixamos a conexão aberta enquanto o app roda.
}