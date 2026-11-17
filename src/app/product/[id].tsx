// ============================================================
// Rota: Editor de produto
//
// URLs possíveis desta rota:
//   /product/novo  →  modo criação
//   /product/5     →  modo edição do produto id 5
//
// O "[id]" no nome do arquivo é um parâmetro dinâmico.
// O router entrega o valor pelo hook useLocalSearchParams().
// ============================================================

import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Modal, ScrollView } from 'react-native';
import { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { useProducts } from '@/hooks/productsContext';
import { useCategories } from '@/hooks/categoriesContext';
import { colors, spacing, globalStyles } from '@/styles/global';

export default function EditorScreen() {
  const { products, createProduct, updateProduct, deleteProduct } = useProducts();
  const { categories } = useCategories();

  // ---------------------------------------------------------
  // Lê os parâmetros da URL.
  //
  // O useLocalSearchParams devolve os valores que vieram no
  // objeto params do router.push(...). Como a rota é
  // "product/[id]", o parâmetro se chama "id".
  //
  // Ele vem como string, porque tudo na URL é texto.
  // ---------------------------------------------------------
  const { id } = useLocalSearchParams<{ id: string }>();

  // "novo" = estamos criando. Qualquer outra coisa = edição.
  const isNew = id === 'novo';
  const productId = isNew ? undefined : Number(id);

  // ---------------------------------------------------------
  // Busca o produto na lista para preencher os campos.
  //
  // Se ele não estiver na lista (ex: foi filtrado fora), o
  // find devolve undefined e os campos ficam vazios.
  // ---------------------------------------------------------
  const product = products.find((p) => p.id === productId);

  // ---------------------------------------------------------
  // Estado dos campos do formulário.
  //
  // O useState recebe um valor inicial. Na primeira renderização
  // ele usa esse valor; depois passa a usar o setX.
  //
  // Atenção: se o produto for carregado do banco DEPOIS do
  // primeiro render, os campos não se atualizam sozinhos. Como
  // o Context já carrega os produtos antes de exibir a tela,
  // isso funciona no nosso caso.
  // ---------------------------------------------------------
  const [name, setName] = useState(product?.name ?? '');
  const [barcode, setBarcode] = useState(product?.barcode ?? '');
  const [description, setDescription] = useState(product?.description ?? '');
  const [quantity, setQuantity] = useState(String(product?.quantity ?? 0));
  const [categoryId, setCategoryId] = useState(product?.category_id);

  const onSavePress = () => {
    if (!name.trim()) {
      Alert.alert('Atenção', 'Informe o nome do produto.');
      return;
    }

    const input = {
      barcode: barcode || undefined,
      name: name.trim(),
      description: description || undefined,
      quantity: parseInt(quantity, 10) || 0,
      category_id: categoryId,
    };

    if (productId) {
      updateProduct(productId, input);
    } else {
      createProduct(input);
    }

    // Volta para a tela anterior (o inventário).
    router.back();
  };

  const onDeletePress = () => {
    if (!productId) return;
    Alert.alert(
      'Excluir produto',
      `Tem certeza que deseja excluir "${name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            deleteProduct(productId);
            router.back();
          },
        },
      ]
    );
  };

  // ---------------------------------------------------------
  // Alterna entre as categorias disponíveis.
  // Ao passar de todas, volta para "sem categoria".
  // ---------------------------------------------------------
  const onCategorySelectPress = () => {
    const options = categories.map((c) => c.name);
    const selected = categories.find((c) => c.id === categoryId);
    const idx = options.indexOf(selected?.name ?? '');
    const newIdx = (idx + 1) % (options.length + 1); // +1 para "Sem categoria"
    if (newIdx === options.length) {
      setCategoryId(undefined);
    } else {
      setCategoryId(categories[newIdx].id);
    }
  };

  return (
    <View style={globalStyles.screen}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <Text style={styles.closeText}>Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{isNew ? 'Novo Produto' : 'Editar Produto'}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder="Nome do produto"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Código de barras"
            value={barcode}
            onChangeText={setBarcode}
          />
          <TextInput
            style={styles.input}
            placeholder="Descrição"
            value={description}
            onChangeText={setDescription}
          />
          <TextInput
            style={styles.input}
            placeholder="Quantidade"
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
          />
          <Text style={styles.categoryLabel}>Categoria:</Text>
          <TouchableOpacity style={styles.categorySelect} onPress={onCategorySelectPress}>
            <Text style={styles.categoryValue}>
              {categories.find((c) => c.id === categoryId)?.name || 'Selecionar categoria'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={onSavePress}>
            <Text style={styles.buttonText}>{isNew ? 'Criar' : 'Salvar'}</Text>
          </TouchableOpacity>
          {!isNew && (
            <TouchableOpacity style={styles.buttonDelete} onPress={onDeletePress}>
              <Text style={styles.buttonDeleteText}>Excluir</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  closeButton: {
    padding: spacing.s,
  },
  closeText: {
    fontSize: 16,
    color: colors.primary,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.m,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: spacing.m,
    borderWidth: 1,
    borderColor: colors.border,
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
  categoryLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  categorySelect: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.m,
    marginBottom: spacing.m,
  },
  categoryValue: {
    fontSize: 16,
    color: colors.text,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: spacing.m,
    alignItems: 'center',
    marginTop: spacing.s,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  buttonDelete: {
    backgroundColor: colors.error,
    borderRadius: 8,
    paddingVertical: spacing.m,
    alignItems: 'center',
    marginTop: spacing.s,
  },
  buttonDeleteText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
