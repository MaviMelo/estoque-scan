# Referência de Sintaxe e Stack — EstoqueScan

Material de consulta rápida para o aluno. Didática enxuta, orientada a objetos (POO) e focada no que será usado no projeto.

**Convenção do projeto:** interface do usuário (UI) em português do Brasil; nomes de variáveis, funções, classes e arquivos **em inglês**.

---

## Índice

1. [Stack e o papel de cada peça](#1-stack-e-o-papel-de-cada-peça)
2. [TypeScript — tipos, variáveis e funções](#2-typescript---tipos-variáveis-e-funções)
3. [TypeScript — Programação Orientada a Objetos (POO)](#3-typescript---programação-orientada-a-objetos-poo)
4. [React Native — componentes e estilo](#4-react-native---componentes-e-estilo)
5. [React Native — hooks e estado](#5-react-native---hooks-e-estado)
6. [Expo Router — navegação entre telas](#6-expo-router---navegação-entre-telas)
7. [Expo SQLite — banco local](#7-expo-sqlite---banco-local)
8. [Estrutura de pastas do projeto](#8-estrutura-de-pastas-do-projeto)
9. [Glossário rápido](#9-glossário-rápido)

---

## 1. Stack e o papel de cada peça

| Tecnologia | O que é | Papel no EstoqueScan |
|------------|---------|----------------------|
| **TypeScript** | JavaScript com tipos | Garante que variáveis, funções e componentes recebam os dados corretos, evitando erros comuns. |
| **React** | Biblioteca para interfaces | Define componentes (peças reutilizáveis de UI) e como eles reagem a mudanças de dados. |
| **React Native** | React para mobile | Substitui HTML por componentes nativos do celular (`View`, `Text`, `TextInput`, etc.). |
| **Expo** | Ferramenta/framework | Facilita criar, buildar e rodar apps React Native sem configurar Xcode/Android Studio manualmente. |
| **Expo Router** | Navegação baseada em arquivos | Cada arquivo na pasta `app/` vira uma tela (rota) do app. |
| **Expo SQLite** | Banco de dados local | Armazena produtos, categorias e movimentações no próprio celular, sem internet. |

---

## 2. TypeScript — tipos, variáveis e funções

### 2.1 Declaração de variáveis

Use `const` por padrão. Use `let` apenas se o valor mudar. Nunca use `var`.

```ts
const appName: string = "EstoqueScan";      // texto fixo
let productCount: number = 0;               // número que pode mudar
const isActive: boolean = true;             // verdadeiro ou falso
```

### 2.2 Tipos primitivos e compostos

```ts
// Primitivos
const name: string = "Arroz";
const price: number = 4.99;
const inStock: boolean = true;

// Array (lista)
const categories: string[] = ["Grãos", "Laticínios", "Limpeza"];

// Objeto com tipo explícito
const product: { id: number; name: string; barcode: string } = {
  id: 1,
  name: "Arroz",
  barcode: "7891234567890",
};

// Tipo opcional (pode não existir)
const discount?: number = 10;   // o '?' significa que pode ser undefined
```

### 2.3 Interfaces (contratos de dados)

Interfaces definem a "forma" de um objeto. Usamos muito para modelos de dados (`Product`, `Category`, `Movement`).

```ts
interface Product {
  id: number;
  name: string;
  barcode: string;
  quantity: number;
  categoryId?: number;   // opcional
}

const myProduct: Product = {
  id: 1,
  name: "Feijão",
  barcode: "123456789",
  quantity: 5,
};
```

### 2.4 Union types (um ou outro)

```ts
type MovementType = "in" | "out";   // só aceita "in" ou "out"

const movement: MovementType = "in";
// const movement: MovementType = "entrada";  // ERRO: não aceita português
```

### 2.5 Funções

```ts
// Declaração tradicional
function calculateTotal(price: number, quantity: number): number {
  return price * quantity;
}

// Arrow function (muito usada em React Native)
const formatCurrency = (value: number): string => {
  return `R$ ${value.toFixed(2)}`;
};

// Parâmetros opcionais e com valor padrão
function saveProduct(name: string, barcode?: string, quantity: number = 0): void {
  console.log(`Salvando ${name}, código ${barcode ?? "sem código"}, qtd ${quantity}`);
}

// Função como parâmetro (callback)
// Uma função pode receber outra função como argumento.
// Isso é útil para criar operações genéricas: você define o "o quê fazer"
// na função que passa por parâmetro.

// Funções anônimas (arrow functions sem nome)
// Você pode criar uma função na hora, sem dar nome a ela.
// Isso é comum ao passar callbacks.
sayHello(() => {
  console.log("Mensagem do callback");
});

// Exemplo 1 — o mais simples possível:
function sayHello(callback: () => void): void {
  console.log("Antes");
  callback();   // executa a função recebida
  console.log("Depois");
}

sayHello(() => console.log("Mensagem do callback"));

// Exemplo 2 — com parâmetros e retorno:
type Operation = (a: number, b: number) => number;

const add: Operation = (a, b) => a + b;
const multiply: Operation = (a, b) => a * b;

function calculate(a: number, b: number, op: Operation): number {
  return op(a, b);
}

// Uso
calculate(10, 5, add);      // 15
calculate(10, 5, multiply); // 50
```

---

## 3. TypeScript — Programação Orientada a Objetos (POO)

### 3.1 Classe básica

Uma classe é um molde para criar objetos com dados (propriedades) e comportamento (métodos).

```ts
class Product {
  // Propriedades (dados do objeto)
  public id: number;
  public name: string;
  public quantity: number;

  // Construtor: executado quando criamos um novo objeto com 'new'
  constructor(id: number, name: string, quantity: number = 0) {
    this.id = id;
    this.name = name;
    this.quantity = quantity;
  }

  // Método: comportamento do objeto
  addStock(amount: number): void {
    this.quantity += amount;
  }

  removeStock(amount: number): void {
    this.quantity = Math.max(0, this.quantity - amount);
  }
}

// Uso
const rice = new Product(1, "Arroz", 10);
rice.addStock(5);        // quantity vira 15
console.log(rice.name);  // "Arroz"
```

### 3.2 Modificadores de acesso

| Modificador | Onde pode ser acessado |
|-------------|------------------------|
| `public` | Em qualquer lugar (padrão) |
| `private` | Só dentro da própria classe |
| `protected` | Dentro da classe e subclasses |

```ts
class Category {
  public name: string;
  private readonly id: number;   // readonly = não muda depois de criado

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }

  getId(): number {   // getter para acessar o privado
    return this.id;
  }
}
```

### 3.3 Herança

Uma classe herda dados e comportamento de outra usando `extends`.

```ts
class PhysicalProduct extends Product {
  public weight: number;   // propriedade extra

  constructor(id: number, name: string, weight: number) {
    super(id, name);       // chama o construtor da classe pai (Product)
    this.weight = weight;
  }

  getShippingInfo(): string {
    return `${this.name} pesa ${this.weight}kg`;
  }
}
```

### 3.4 Implementando interfaces

Uma classe pode "assinar" um contrato (`implements`) e garante que terá aqueles campos.

```ts
interface Sellable {
  price: number;
  sell(quantity: number): void;
}

class Item implements Sellable {
  public price: number;

  constructor(price: number) {
    this.price = price;
  }

  sell(quantity: number): void {
    console.log(`Vendido ${quantity} unidade(s) a R$ ${this.price} cada`);
  }
}
```

### 3.5 Métodos estáticos (`static`)

Pertencem à classe, não à instância. Úteis para utilitários.

```ts
class ProductValidator {
  static isValidBarcode(code: string): boolean {
    return code.length === 13;   // exemplo simples: EAN-13
  }
}

// Uso sem criar objeto
if (ProductValidator.isValidBarcode("7891234567890")) {
  console.log("Código válido");
}
```

---

## 4. React Native — componentes e estilo

### 4.1 Componentes principais

React Native **não usa HTML**. Use os componentes abaixo:

| Componente | Uso | Equivalente web |
|------------|-----|-----------------|
| `View` | Container / bloco | `<div>` |
| `Text` | Texto visível | `<p>`, `<span>` |
| `TextInput` | Campo de digitação | `<input>` |
| `Button` | Botão simples | `<button>` |
| `TouchableOpacity` | Área clicável com feedback | `<button>` ou `<a>` |
| `ScrollView` | Tela com scroll | container com `overflow` |
| `FlatList` | Lista eficiente de itens | `<ul>` / lista virtualizada |

### 4.2 Exemplo de componente funcional

```tsx
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

type ProductInputProps = {
  onSave: (name: string) => void;
};

export default function ProductInput({ onSave }: ProductInputProps) {
  const [name, setName] = React.useState<string>("");

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome do produto</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={(text) => setName(text)}
        placeholder="Ex.: Arroz"
      />
      <Button title="Salvar" onPress={() => onSave(name)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff' },
  label: { fontSize: 14, color: '#555', marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 10, borderRadius: 8, fontSize: 16 },
});
```

> **Regras de ouro:** todo texto visível deve estar dentro de `<Text>`. Não escreva texto "solto" dentro de `<View>`.

### 4.3 Estilização (StyleSheet)

Sem CSS comum. Usamos `StyleSheet.create` com propriedades parecidas com CSS, mas em **camelCase**.

```tsx
const styles = StyleSheet.create({
  container: {
    flex: 1,           // ocupa toda a altura disponível
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    elevation: 4,      // sombra Android
    shadowColor: '#000', // sombra iOS
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});
```

### 4.4 Estilos centralizados (reaproveitamento entre telas)

Você pode criar arquivos separados com estilos reutilizados por vários componentes. Isso é parecido com uma "folha de estilo" central, mas no React Native os estilos são objetos TypeScript/JavaScript, não classes CSS.

#### Arquivo `src/styles/global.ts`

```ts
import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

export const colors = {
  primary: '#2E7D32',
  secondary: '#1976B2',
  danger: '#C62828',
  background: '#f5f5f5',
  surface: '#ffffff',
  text: '#333333',
  textLight: '#666666',
};

export const spacing = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
};

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  } as ViewStyle,
  card: {
    backgroundColor: colors.surface,
    padding: spacing.m,
    borderRadius: 12,
  } as ViewStyle,
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.m,
  } as TextStyle,
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  } as TextStyle,
});
```

> O `as ViewStyle` e `as TextStyle` ajudam o TypeScript a entender o tipo de cada estilo.

#### Usando em um componente

```tsx
import { View, Text, StyleSheet } from 'react-native';
import { commonStyles, colors } from '@/styles/global';

export default function ProductCard() {
  return (
    <View style={[commonStyles.card, { marginVertical: 8 }]}>
      <Text style={[commonStyles.title, { color: colors.primary }]}>
        Meu Produto
      </Text>
    </View>
  );
}
```

Note o uso de **array de estilos**: `style={[commonStyles.card, { marginVertical: 8 }]}`. O React Native mescla os estilos; o último item sobrescreve propriedades iguais do anterior.

#### Boas práticas

| Faça | Não faça |
|------|----------|
| Crie `src/styles/` com cores, espaçamentos e estilos base usados em várias telas | Coloque todos os estilos de todas as telas em um único arquivo gigante |
| Mantenha estilos de uma única tela dentro daquele mesmo arquivo `.tsx` | Crie estilo global para algo usado apenas em uma tela |
| Use array de estilos para sobrescrever levemente um estilo base | Duplique o estilo inteiro só para mudar uma propriedade |
| Defina `colors` e `spacing` como constantes compartilhadas | Use valores "mágicos" (`#ff5722`, `24`) espalhados pelos componentes |

---

## 5. React Native — hooks e estado

### 5.1 `useState` — lembra dados na tela

O estado "lembra" o que o usuário digitou ou selecionou. Toda mudança redesenha o componente.

```tsx
const [quantity, setQuantity] = React.useState<number>(0);

// Para atualizar:
setQuantity(10);
// ou a partir de um texto digitado:
onChangeText={(text) => setQuantity(Number(text) || 0)}
```

### 5.2 `useEffect` — fazer algo ao abrir a tela

Executa efeitos colaterais (carregar banco, pedir permissão de câmera) quando o componente aparece.

```tsx
React.useEffect(() => {
  console.log("Tela carregada");
  // carregar produtos do banco aqui
}, []); // array vazio = roda apenas uma vez ao montar
```

### 5.3 Props (propriedades)

Props são dados que um componente **pai** envia para um **filho**.
Pense em props como parâmetros de função: o pai chama o filho e passa valores para ele.
Dentro do filho, os props são imutáveis (o filho não pode alterá-los).

#### Exemplo simples — saudação personalizada

Pai envia um nome:

```tsx
// Componente filho
type GreetingProps = {
  name: string;
};

export default function Greeting({ name }: GreetingProps) {
  return <Text>Olá, {name}!</Text>;
}

// Componente pai (usa o filho e passa o prop 'name')
export default function App() {
  return <Greeting name="Maria" />;
}
```

O que acontece aqui:
1. `App` (pai) renderiza `<Greeting name="Maria" />`.
2. `Greeting` (filho) recebe `{ name }` por destructuring.
3. `{ name }` é apenas uma forma curta de escrever:
   ```tsx
   function Greeting(props: GreetingProps) {
     return <Text>Olá, {props.name}!</Text>;
   }
   ```

#### Exemplo com produto (como usaremos no EstoqueScan)

```tsx
// Pai envia 'product' e uma função 'onEdit' para o filho
<ProductCard product={myProduct} onEdit={handleEdit} />

// Filho declara quais props espera
type ProductCardProps = {
  product: Product;          // um objeto do tipo Product
  onEdit: (id: number) => void; // uma função que recebe um id e não retorna nada
};

// Filho recebe via destructuring: extrai 'product' e 'onEdit' do objeto de props
export default function ProductCard({ product, onEdit }: ProductCardProps) {
  // 'product' e 'onEdit' já estão disponíveis aqui
  // ...
}
```

O que acontece:
1. O pai passa o objeto `myProduct` e a função `handleEdit`.
2. O filho declara o tipo `ProductCardProps` para garantir que recebeu o que espera (TypeScript avisa se faltar algo).
3. `{ product, onEdit }` faz destructuring: tira essas duas propriedades do objeto de props e cria variáveis com os mesmos nomes.

---

## 6. Expo Router — navegação entre telas

### 6.1 Como funciona

Cada arquivo dentro da pasta `app/` vira uma tela automaticamente:

| Arquivo | Rota (URL) |
|---------|------------|
| `app/index.tsx` | `/` (inicial) |
| `app/scanner.tsx` | `/scanner` |
| `app/editor/[id].tsx` | `/editor/1`, `/editor/2`, etc. |

### 6.2 Navegando

```tsx
import { Link } from 'expo-router';

// Como link (clicável)
<Link href="/scanner">Abrir leitor</Link>

// Via código
import { useRouter } from 'expo-router';

const router = useRouter();
router.push('/scanner');      // abre nova tela
router.back();                // volta uma tela
router.replace('/editor/5');  // substitui a atual (não deixa voltar)
```

### 6.3 Recebendo parâmetros (tela dinâmica)

No arquivo `app/editor/[id].tsx`:

```tsx
import { useRouter } from 'expo-router';

export default function EditorScreen() {
  const router = useRouter();
  const { id } = router.params;   // id vem como string da URL

  const productId = Number(id);   // converte para número
  // ...
}
```

---

## 7. Expo SQLite — banco local

### 7.1 Abrindo o banco

```tsx
import { openDatabaseSync } from 'expo-sqlite';

const db = openDatabaseSync('estoque.db');
```

### 7.2 Executando SQL

```tsx
// Criar tabela
db.execSync(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    barcode TEXT UNIQUE,
    quantity INTEGER DEFAULT 0
  );
`);

// Inserir
db.runSync(`INSERT INTO products (name, barcode, quantity) VALUES (?, ?, ?)`, [
  "Arroz", "7891234567890", 10,
]);

// Consultar (retorna linhas)
const rows = db.getAllSync(`SELECT * FROM products WHERE id = ?`, [1]);
const product = rows[0];  // primeiro resultado
```

### 7.3 Boa prática no projeto

Nunca escreva SQL direto nas telas. Crie uma camada de **repositório** (`src/repositories/`) que encapsule o banco, e chame essa camada das telas.

---

## 8. Estrutura de pastas do projeto

```
estoque-scan/
├── app/
│   ├── _layout.tsx         # layout raiz + providers
│   ├── index.tsx           # tela inicial: lista de inventário
│   ├── (tabs)/
│   │   ├── _layout.tsx     # abas inferiores
│   │   ├── index.tsx       # mesma tela inicial (aba Inventário)
│   │   └── categorias.tsx  # tela Categorias
│   └── (stack)/
│       ├── _layout.tsx     # pilha de telas
│       ├── scanner.tsx     # leitor de código de barras
│       ├── editor/[id].tsx # criar/editar produto
│       └── movimentacao/[id].tsx # entrada/saída de estoque
├── src/
│   ├── styles/             # estilos centralizados (cores, espaçamentos, estilos base)
│   │   └── global.ts       # cores, spacing e commonStyles reaproveitáveis
│   ├── db/
│   │   ├── connection.ts   # abrir/fechar banco SQLite
│   │   └── schema.ts       # CREATE TABLEs
│   ├── repositories/
│   │   ├── productsRepository.ts
│   │   ├── categoriesRepository.ts
│   │   └── movementsRepository.ts
│   ├── models/
│   │   ├── product.ts      # interface Product
│   │   ├── category.ts     # interface Category
│   │   └── movement.ts     # interface Movement
│   ├── hooks/
│   │   ├── productsContext.tsx
│   │   └── categoriesContext.tsx
│   ├── services/
│   │   └── barcodeScannerService.ts
│   └── components/
│       ├── ProductListItem.tsx
│       ├── CategoryListItem.tsx
│       └── EmptyState.tsx
├── package.json
├── tsconfig.json
└── app.json
```

---

## 9. Glossário rápido

| Termo | Significado simples |
|-------|---------------------|
| **Componente** | Peça reutilizável de interface (ex.: `ProductCard`, `Button`). |
| **Prop (props)** | Dados enviados de um componente pai para um filho. |
| **Estado (`useState`)** | Dados que o componente "lembra" e que, ao mudar, redesenham a tela. |
| **Hook** | Função especial do React que começa com `use` (ex.: `useState`, `useEffect`). |
| **Interface** | Contrato que diz quais campos um objeto deve ter. |
| **Classe** | Molde para criar objetos com dados (`propriedades`) e comportamento (`métodos`). |
| **Herança** | Quando uma classe reaproveita dados e métodos de outra (`extends`). |
| **Repositório** | Camada que fala diretamente com o banco de dados. |
| **Rota / Tela** | Cada página do app, acessada por uma URL (ex.: `/scanner`). |

---

## Como usar este material

- Leia a seção correspondente **antes** de cada sessão de codificação.
- Mantenha o arquivo aberto enquanto digita o código dos scaffolds.
- Se esquecer a sintaxe de algo (ex.: como criar uma classe, como navegar entre telas), consulte aqui primeiro.
- Pergunte ao mentor se algum exemplo não ficou claro.

---