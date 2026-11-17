// ============================================================
// Layout das abas.
//
// Este arquivo define as ABAS do rodapé do app.
// A pasta "(tabs)" agrupa os arquivos, mas NÃO aparece na URL:
//   src/app/(tabs)/categories.tsx  →  /categories
//
// O componente <Tabs> abaixo cria a barra de abas.
// ============================================================

import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { colors } from '@/styles/global';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        // Cor de fundo da barra de abas
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: '#fff',
      }}
    >
      {/* Aba 1 — Inventário
          O arquivo index.tsx dentro de (tabs) é a rota "/" */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inventário',
          // Ícone: uso de emoji para não depender de @expo/vector-icons
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>📦</Text>,
        }}
      />

      {/* Aba 2 — Categorias */}
      <Tabs.Screen
        name="categories"
        options={{
          title: 'Categorias',
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>🏷️</Text>,
        }}
      />
    </Tabs>
  );
}
