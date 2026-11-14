import { StatusBar } from 'expo-status-bar';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';
import { ProductsProvider, useProducts } from './src/hooks/productsContext';
import { CategoriesProvider, useCategories } from './src/hooks/categoriesContext';
import { InventoryScreen } from './src/screens/InventoryScreen';
import { CategoriesScreen } from './src/screens/CategoriesScreen';
import { EditorScreen } from './src/screens/EditorScreen';
import { colors, spacing } from './src/styles/global';

// Inicializa o banco e verifica se as tabelas existem
import { initDatabase, checkTables } from './src/db/schema';
initDatabase();
const tablesOk = checkTables();

export default function App() {
  return (
    <ProductsProvider>
      <CategoriesProvider>
        <RootNavigator />
        <StatusBar style="auto" />
      </CategoriesProvider>
    </ProductsProvider>
  );
}

type Tab = 'inventory' | 'categories';

function RootNavigator() {
  const [tab, setTab] = useState<Tab>('inventory');
  const [editingId, setEditingId] = useState<number | undefined>(undefined);
  const [editorOpen, setEditorOpen] = useState(false);
  const { products } = useProducts();

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, tab === 'inventory' && styles.tabActive]}
          onPress={() => setTab('inventory')}
        >
          <Text style={[styles.tabText, tab === 'inventory' && styles.tabActiveText]}>
            Inventário
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === 'categories' && styles.tabActive]}
          onPress={() => setTab('categories')}
        >
          <Text style={[styles.tabText, tab === 'categories' && styles.tabActiveText]}>
            Categorias
          </Text>
        </TouchableOpacity>
      </View>

      {!tablesOk && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>Erro ao criar tabelas do banco de dados ❌</Text>
        </View>
      )}

      {tab === 'inventory' && (
        <InventoryScreen
          onAddPress={() => {
            setEditingId(undefined);
            setEditorOpen(true);
          }}
          onProductPress={(product) => {
            setEditingId(product.id);
            setEditorOpen(true);
          }}
        />
      )}

      {tab === 'categories' && (
        <CategoriesScreen />
      )}

      {editorOpen && (
        <EditorScreen
          productId={editingId}
          onSave={() => setEditorOpen(false)}
          onClose={() => setEditorOpen(false)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabBar: {
    flexDirection: 'row',
    paddingVertical: spacing.s,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.m,
  },
  tabActive: {
    borderBottomWidth: 3,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  tabActiveText: {
    color: colors.primary,
  },
  errorBox: {
    padding: spacing.m,
    backgroundColor: '#fdecea',
    borderColor: colors.error,
    borderWidth: 1,
    borderRadius: 8,
    margin: spacing.m,
  },
  errorText: {
    color: colors.error,
    fontWeight: '600',
    textAlign: 'center',
  },
});
