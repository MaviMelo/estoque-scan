import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Category } from '../models/category';

type Props = {
  category: Category;
  onPress: (category: Category) => void;
};

export function CategoryListItem({ category, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.item} onPress={() => onPress(category)}>
      <View style={[styles.body, { backgroundColor: category.color || '#ddd' }]}>
        <View style={styles.colorDot} />
        <Text style={styles.name}>{category.name}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  body: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  colorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 10,
  },
  name: {
    fontSize: 16,
    color: '#111',
    textShadowColor: '#fff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15, 
    fontWeight: '600',
  },
});
