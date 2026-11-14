import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useState } from 'react';
import { useCategories } from '../hooks/categoriesContext';
import { CategoryListItem } from '../components/CategoryListItem';
import { EmptyState } from '../components/EmptyState';
import { colors, spacing, globalStyles } from '../styles/global';

export function CategoriesScreen() {
  const { categories, loading, refresh, createCategory, updateCategory, deleteCategory } = useCategories();

  const [name, setName] = useState('');
  const [color, setColor] = useState('#');

  const onCreatePress = () => {
    if (!name.trim()) {
      Alert.alert('Atenção', 'Informe o nome da categoria.');
      return;
    }
    const ok = createCategory({ name: name.trim(), color: color || undefined });
    if (ok) {
      setName('');
      setColor('#');
    }
  };

  const onRenamePress = (category: any) => {
    const newName = prompt('Novo nome para a categoria:', category.name);
    if (newName && newName.trim()) {
      updateCategory(category.id!, { name: newName.trim() });
    }
  };

  const onDeletePress = (category: any) => {
    Alert.alert(
      'Excluir categoria',
      `Tem certeza que deseja excluir "${category.name}"? Produtos vinculados ficarão sem categoria.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: () => deleteCategory(category.id!) },
      ]
    );
  };

  return (
    <View style={globalStyles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Categorias</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Nova categoria</Text>
        <TextInput
          style={styles.input}
          placeholder="Nome da categoria"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Cor (hex, ex: #2E7D32)"
          value={color}
          onChangeText={setColor}
        />
        <TouchableOpacity style={styles.button} onPress={onCreatePress}>
          <Text style={styles.buttonText}>Criar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.listContainer}>
        {loading ? (
          <EmptyState message="Carregando..." />
        ) : categories.length === 0 ? (
          <EmptyState message="Nenhuma categoria cadastrada." />
        ) : (
          <FlatList
            data={categories}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <CategoryListItem
                category={item}
                onPress={(cat) => {
                  const action = prompt('Escolha: 1 = renomear, 2 = excluir', '');
                  if (action === '1') {
                    onRenamePress(cat);
                  } else if (action === '2') {
                    onDeletePress(cat);
                  }
                }}
              />
            )}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: spacing.m,
    margin: spacing.m,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.s,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.m,
    fontSize: 16,
    color: colors.text,
    marginBottom: spacing.m,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: spacing.m,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  listContainer: {
    flex: 1,
  },
});
