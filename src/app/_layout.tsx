// ============================================================
// Layout raiz do app.
//
// Este arquivo NÃO é uma tela — é o container de navegação que
// envolve TODAS as telas do aplicativo.
//
// Analogia: é a "casca" do app. O que está dentro dela é uma
// tela ou outro container (como as abas).
// ============================================================

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ProductsProvider } from '@/hooks/productsContext';
import { CategoriesProvider } from '@/hooks/categoriesContext';
import '@/db/schema';
import { colors } from '@/styles/global';

export default function RootLayout() {
  // ---------------------------------------------------------
  // O banco já está pronto.
  //
  // O import de '@/db/schema' acima tem um EFEITO COLATERAL: o
  // topo do módulo schema.ts chama initDatabase() assim que o
  // arquivo é carregado. Ou seja, as tabelas existem antes de
  // qualquer componente montar.
  //
  // Isso é necessário porque, no React, os efeitos dos FILHOS
  // rodam antes dos efeitos dos PAIS. Se criássemos as tabelas
  // dentro de um useEffect aqui, os Providers (que são filhos e
  // leem os dados) rodariam antes das tabelas existirem — e
  // estouraria o erro "no such table".
  // ---------------------------------------------------------
  return (
    // Os Providers ficam aqui porque TODAS as telas precisam
    // acessar o estado de produtos e categorias.
    // O hook useProducts() só funciona dentro do seu Provider.
    <ProductsProvider>
      <CategoriesProvider>
        <StatusBar style="auto" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: colors.primary },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        >
          {/* As abas (Inventário / Categorias) */}
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

          {/* Editor de produto — empilha por cima da tela atual */}
          <Stack.Screen
            name="product/[id]"
            options={{
              title: 'Produto',
              presentation: 'modal',
            }}
          />
        </Stack>
      </CategoriesProvider>
    </ProductsProvider>
  );
}
