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

// ---------------------------------------------------------
// CHAVES ESTRANGEIRAS — importante!
//
// O SQLite vem com as chaves estrangeiras DESLIGADAS por padrão.
// Você pode confirmar com: PRAGMA foreign_keys  →  0 (desligado)
//
// Sem ligar isso, as regras do schema NÃO valem. Por exemplo, o
// 'ON DELETE SET NULL' da tabela products (que faz os produtos
// ficarem sem categoria quando a categoria é excluída) simplesmente
// não acontece: o produto ficaria apontando para uma categoria
// que não existe mais (referência pendurada).
//
// 'PRAGMA foreign_keys = ON' liga essas regras.
//
// Atenção: o PRAGMA vale por CONEXÃO, então precisa ser executado
// logo depois de abrir o banco. E ele não funciona dentro de uma
// transação — por isso usamos execSync (que roda fora de transação).
// ---------------------------------------------------------
db.execSync('PRAGMA foreign_keys = ON;');

/**
 * Fecha a conexão com o banco de dados.
 * Útil para liberar recursos quando o app é encerrado.
 */
export function closeDatabase(): void {
  // expo-sqlite não expõe um close direto em todas as versões.
  // Por enquanto, deixamos a conexão aberta enquanto o app roda.
}