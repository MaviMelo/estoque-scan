import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Product } from '../models/product';

type Props = {
  product: Product;
  onPress: (product: Product) => void;
};

export function ProductListItem({ product, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.item} onPress={() => onPress(product)}>
      <View style={styles.body}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.meta}>
          {product.barcode ? `Código: ${product.barcode}` : 'Sem código'}
          {product.category_name ? `  |  ${product.category_name}` : ''}
        </Text>
        <Text style={styles.qty}>Qtd: {product.quantity}</Text>
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
  qty: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
});
