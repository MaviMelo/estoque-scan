import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Product } from '../models/product';
import { Category  } from '../models/category';

type Props = {
  product: Product;
  category?: Category;
  onPress: (product: Product) => void;
};

export function ProductListItem({ product, category, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.item} onPress={() => onPress(product)}>
      <View style={styles.body}>
        <Text style={styles.name}>{product.name}</Text>
        <View style={[styles.flexRow, ]}>
          <Text style={styles.meta}>
            {product.barcode ? `Código: ${product.barcode}` : 'Sem código'}
          </Text>
          {product.category_name && (
            <Text style={[
              styles.categoryTag, 
              { backgroundColor: category?.color }
            ]}>
              {product.category_name}
            </Text>
          )}
        </View>
        <Text style={styles.qty}>Qtd: {product.quantity} {product.unit_type}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  body: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
  },
  meta: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryTag: {
    fontSize: 11,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
    overflow: 'hidden',
  },
  qty: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
});
