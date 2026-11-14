import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';
import { useProducts } from '../hooks/productsContext';
import { useCategories } from '../hooks/categoriesContext';
import { ProductListItem } from '../components/ProductListItem';
import { EmptyState } from '../components/EmptyState';
import { colors, spacing, globalStyles } from '../styles/global';

type InventoryScreenProps = {
  onAddPress: () => void;
  onProductPress: (product: any) => void;
};

export function InventoryScreen({ onAddPress, onProductPress }: InventoryScreenProps) {
  const { products, loading, refresh } = useProducts();
  const { categories } = useCategories();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<number | undefined>(undefined);

  const filtered = products.filter((p) => {
    const matchSearch = search
      ? (p.name?.toLowerCase().includes(search.toLowerCase()) ||
          p.barcode?.toLowerCase().includes(search.toLowerCase()))
      : true;
    const matchCategory = categoryFilter !== undefined
      ? p.category_id === categoryFilter
      : true;
    return matchSearch && matchCategory;
  });

  const onScanPress = () => {
    // TODO: integrar com scanner de código de barras (F1)
  };

  return (
    <View style={globalStyles.screen}>
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nome ou código"
          value={search}
          onChangeText={setSearch}
        />
        <TouchableOpacity style={styles.scanButton} onPress={onScanPress}>
          <Text style={styles.scanText}>Escanear</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterBar}>
        <Text style={styles.filterLabel}>Categoria:</Text>
        {categories.map((cat) => (
          <TouchableOpacity
            key={String(cat.id)}
            style={[styles.filterChip, categoryFilter === cat.id && styles.chipActive]}
            onPress={() => setCategoryFilter(categoryFilter === cat.id ? undefined : cat.id)}
          >
            <Text style={[styles.chipText, categoryFilter === cat.id && styles.chipActiveText]}>
              {cat.name}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={[styles.filterChip, categoryFilter === undefined && styles.chipActive]}
          onPress={() => setCategoryFilter(undefined)}
        >
          <Text style={[styles.chipText, categoryFilter === undefined && styles.chipActiveText]}>
            Todas
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.listContainer}>
        {loading ? (
          <EmptyState message="Carregando..." />
        ) : filtered.length === 0 ? (
          <EmptyState message="Nenhum produto encontrado." />
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <ProductListItem product={item} onPress={onProductPress} />
            )}
          />
        )}
      </View>

      <TouchableOpacity style={styles.fab} onPress={onAddPress}>
        <Text style={styles.fabText}>+ Adicionar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchInput: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    fontSize: 16,
    color: colors.text,
    marginRight: spacing.s,
  },
  scanButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
  },
  scanText: {
    color: '#fff',
    fontWeight: '600',
  },
  filterBar: {
    flexDirection: 'row',
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
  },
  filterLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginRight: spacing.s,
    alignSelf: 'center',
  },
  filterChip: {
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.xs,
    marginRight: spacing.s,
  },
  chipActive: {
    backgroundColor: colors.primary,
  },
  chipText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  chipActiveText: {
    color: '#fff',
  },
  listContainer: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    bottom: spacing.l,
    right: spacing.l,
    backgroundColor: colors.primary,
    borderRadius: 28,
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.m,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
