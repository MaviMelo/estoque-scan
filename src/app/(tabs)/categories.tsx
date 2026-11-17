import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Alert, Modal } from 'react-native';
import { useState } from 'react';
import { useCategories } from '@/hooks/categoriesContext';
import { CategoryListItem } from '@/components/CategoryListItem';
import { EmptyState } from '@/components/EmptyState';
import { Category } from '@/models/category';
import { colors, spacing, globalStyles } from '@/styles/global';

export default function CategoriesScreen() {
  const { categories, loading, refresh, createCategory, updateCategory, deleteCategory } = useCategories();

  const [name, setName] = useState('');
  const [color, setColor] = useState('#');

  // ---------------------------------------------------------
  // Estado do modal de edição.
  //
  // "editing" guarda a categoria que está sendo editada.
  // null = nenhum modal aberto.
  // "editName" guarda o texto que está no campo de texto.
  //
  // Repare que NÃO existe um booleano "modalAberto".
  // Um único estado (editing) descreve tudo: se editing é
  // null, o modal está fechado. Se não é null, está aberto
  // e sabemos qual categoria está sendo editada.
  // ---------------------------------------------------------
  const [editing, setEditing] = useState<Category | null>(null);
  const [editName, setEditName] = useState('');

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

  // ---------------------------------------------------------
  // Toque na categoria → abre o modal preenchido.
  // ---------------------------------------------------------
  const onCategoryPress = (category: Category) => {
    setEditing(category);
    setEditName(category.name);
  };

  // Fecha o modal e limpa o campo. Chamado por Cancelar, pelo X
  // e depois de salvar/excluir.
  const onCancelEdit = () => {
    setEditing(null);
    setEditName('');
  };

  // ---------------------------------------------------------
  // Salva o novo nome.
  // ---------------------------------------------------------
  const onSaveEdit = () => {
    const id = editing?.id;
    if (id === undefined) return;

    const newName = editName.trim();
    if (!newName) {
      Alert.alert('Atenção', 'Informe o nome da categoria.');
      return;
    }

    try {
      updateCategory(id, { name: newName });
      onCancelEdit();
    } catch (e) {
      // O banco tem 'name UNIQUE'. Renomear para um nome que já
      // existe viola essa regra e o SQLite lança uma exceção.
      // Sem este catch, o app crasharia com a tela vermelha.
      Alert.alert('Não foi possível salvar', 'Já existe uma categoria com esse nome.');
    }
  };

  // ---------------------------------------------------------
  // Exclui a categoria (com confirmação).
  //
  // Repare que copiamos id e name para variáveis locais ANTES
  // de abrir o Alert. O onPress do botão roda depois, e se
  // lesse "editing.id" naquele momento, poderia apagar a
  // categoria errada caso o estado tivesse mudado.
  // ---------------------------------------------------------
  const onDeletePress = () => {
    const id = editing?.id;
    const name = editing?.name;
    if (id === undefined) return;

    Alert.alert(
      'Excluir categoria',
      `Tem certeza que deseja excluir "${name}"? Produtos vinculados ficarão sem categoria.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            deleteCategory(id);
            onCancelEdit();
          },
        },
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
              <CategoryListItem category={item} onPress={onCategoryPress} />
            )}
          />
        )}
      </View>

      {/* ---------------------------------------------------------
          Modal de edição da categoria (bottom sheet).

          "visible={editing !== null}" — o estado decide sozinho se
          o modal aparece. "transparent" deixa o fundo escurecido
          aparecer. "onRequestClose" é obrigatório no Android: sem
          ele, o botão de voltar do sistema não fecha o modal.
          --------------------------------------------------------- */}
      <Modal
        visible={editing !== null}
        transparent={true}
        animationType="slide"
        onRequestClose={onCancelEdit}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Editar categoria</Text>
              <TouchableOpacity onPress={onCancelEdit}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Nome da categoria"
              value={editName}
              onChangeText={setEditName}
              autoFocus={true}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.button, styles.buttonCancel]}
                onPress={onCancelEdit}
              >
                <Text style={styles.buttonCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={onSaveEdit}>
                <Text style={styles.buttonText}>Salvar</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.buttonDelete} onPress={onDeletePress}>
              <Text style={styles.buttonDeleteText}>Excluir categoria</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  listContainer: {
    flex: 1,
  },
  // ---------------------------------------------------------
  // Modal de edição (bottom sheet)
  // ---------------------------------------------------------
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',   // fundo escurecido
    justifyContent: 'flex-end',               // joga o card para BAIXO
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: spacing.m,
    paddingBottom: spacing.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.m,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  modalClose: {
    fontSize: 20,
    color: colors.textSecondary,
    paddingHorizontal: spacing.s,
  },
  modalActions: {
    flexDirection: 'row',
    gap: spacing.s,
  },
  buttonCancel: {
    flex: 1,
    backgroundColor: colors.border,
  },
  buttonCancelText: {
    color: colors.text,
    fontWeight: '600',
    fontSize: 16,
  },
  buttonDelete: {
    backgroundColor: colors.error,
    borderRadius: 8,
    paddingVertical: spacing.m,
    alignItems: 'center',
    marginTop: spacing.m,
  },
  buttonDeleteText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
