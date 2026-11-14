# SPEC.md — EstoqueScan

---

## 1. Nome do Projeto

**EstoqueScan** — Controle de Inventário com Leitura de Código de Barras

*(Nomes alternativos considerados: InvenScan, Estoque Fácil.)*

---

## 2. Descrição do Projeto

**O que é.**
EstoqueScan é um aplicativo mobile que permite cadastrar, consultar e movimentar
itens de um estoque usando a **câmera do celular para ler códigos de barras**. Em
vez de digitar manualmente o código de cada produto, o usuário aponta a câmera
para o código e o app preenche o identificador automaticamente.

**Que problema resolve.**
Contar e rastrear itens de estoque manualmente é lento e sujeito a erro. Pequenos
negócios, almoxarifados escolares e o controle doméstico de suprimentos costumam
usar planilhas ou papel, sem uma forma rápida de dar entrada/saída de itens no
momento da conferência física. O EstoqueScan reduz esse atrito: escanear → registrar.

**Público-alvo.**
- Pequenos comerciantes (mercadinhos, papelarias, lojas de bairro);
- Responsáveis por almoxarifado escolar ou de escritório;
- Uso pessoal/doméstico (despensa, ferramentas, coleções).

**Escopo do que o app NÃO é.**
Não é um sistema fiscal, nem ERP, nem sincroniza com servidores externos nesse primeiro momento/versão do projeto. É uma
ferramenta **local, offline e de uso individual** — o que mantém o projeto
realista para o prazo disponível.

---

## 3. Funcionalidades Principais

### 3.1 Essenciais (obrigatórias para a versão 1 funcional)

| # | Funcionalidade | O que o usuário consegue fazer |
|---|---|---|
| F1 | **Cadastro por leitura de código de barras** | Abrir a câmera, apontar para um código de barras (EAN-13, Code128 etc.) e criar um produto já com o código preenchido. |
| F2 | **Cadastro manual** | Criar um produto digitando os dados, para itens sem código de barras. |
| F3 | **Lista de inventário** | Ver todos os produtos, com nome, código, quantidade e categoria; **buscar** por nome ou código e **filtrar por categoria**. |
| F4 | **Detalhe / edição / exclusão de produto** | Abrir um produto, alterar seus dados, salvar ou excluir. |
| F5 | **Movimentação de estoque (entrada/saída)** | Registrar entrada ou saída de unidades, atualizando a quantidade do produto. |
| F6 | **Gerenciamento de categorias** | Listar, criar, renomear e excluir categorias. |
| F7 | **Persistência local (SQLite)** | Todos os dados permanecem após fechar o app, navegar entre telas ou reiniciar o dispositivo. |
| F8 | **Tratamento do código já cadastrado** | Se o código lido já existir, o app abre o produto existente em vez de duplicá-lo. |

### 3.2 Opcionais (somente se houver tempo)

| # | Funcionalidade | O que agrega |
|---|---|---|
| O1 | **Alerta de estoque baixo** | Definir uma quantidade mínima por produto e receber uma **notificação local** quando o estoque cair abaixo dela. |
| O2 | **Histórico de movimentações** | Ver o registro de entradas/saídas por produto e por data. |
| O3 | **Exportar inventário (CSV)** | Gerar um arquivo CSV do inventário e compartilhá-lo por WhatsApp/e-mail. |
| O4 | **Tema escuro** | Alternância claro/escuro. |

> **Prioridade:** F1–F8 primeiro. Os opcionais só entram se as essenciais estiverem
> estáveis e testadas.

---

## 4. APIs Nativas e Capacidades do Dispositivo

| Capacidade / API | Para que será usada | Por que o app precisa | Como contribui |
|---|---|---|---|
| **Câmera + leitura de código de barras** (`expo-camera` / `expo-barcode-scanner`) | Escanear códigos de barras dos produtos. | É a **capacidade nativa central** do app: sem ela, o cadastro volta a ser digitação manual, perdendo a proposta do produto. | Preenche o código do produto automaticamente e acelera o cadastro em campo. |
| **Armazenamento local — SQLite** (`expo-sqlite`) | Guardar produtos, categorias e (opcional) movimentações. | Os dados precisam sobreviver ao fechamento do app e ao reinício do aparelho. | Permite uso 100% offline, sem backend. |
| **Permissão de câmera** (runtime permission) | Solicitar acesso à câmera na primeira leitura. | O sistema Android/iOS exige consentimento para usar a câmera. | Se negada, o app **não deve travar** — deve avisar e oferecer o cadastro manual (F2). |
| *(Opcional)* **Notificações locais** (`expo-notifications`) | Avisar sobre estoque baixo (O1). | Reforça o valor prático sem depender de servidor. | Dispara um alerta quando a quantidade de um produto cruza o mínimo definido. |
| *(Opcional)* **Arquivos / Compartilhamento** (`expo-file-system`, `expo-sharing`) | Exportar o inventário em CSV (O3). | Permite levar os dados para fora do app. | Gera e compartilha o arquivo via apps do sistema. |

> **Requisito do enunciado atendido:** o app usa **no mínimo uma capacidade de
> hardware via API nativa** — a **câmera (leitura de código de barras)** —, além do
> armazenamento local.

---

## 5. Arquitetura Técnica

### 5.1 Stack

- **Framework:** React Native com **Expo** (SDK atual), em **TypeScript**.
- **Justificativa:** reaproveita o conhecimento de React do autor; o Expo oferece
  módulos prontos de câmera/código de barras e SQLite, reduzindo o risco de travar
  em configuração de build dentro de um prazo curto.
- **Navegação:** **expo-router** (navegação baseada em arquivos), com *tabs*
  (Inventário / Categorias) e *stack* para as telas de Scanner e Editor.

### 5.2 Modelo de dados (SQLite)

**`categories`**

| Campo | Tipo | Observação |
|---|---|---|
| `id` | INTEGER PK | Auto-incremento. |
| `name` | TEXT NOT NULL | Obrigatório, único. |
| `color` | TEXT | Opcional (cor de destaque). |

**`products`**

| Campo | Tipo | Observação |
|---|---|---|
| `id` | INTEGER PK | Auto-incremento. |
| `barcode` | TEXT UNIQUE | Código de barras; pode ser nulo (item sem código). |
| `name` | TEXT NOT NULL | Obrigatório. |
| `description` | TEXT | Opcional. |
| `quantity` | INTEGER NOT NULL DEFAULT 0 | Quantidade em estoque. |
| `min_quantity` | INTEGER | Opcional (usado pelo O1). |
| `price` | REAL | Opcional. |
| `category_id` | INTEGER FK → categories(id) | Opcional, `ON DELETE SET NULL`. |
| `created_at` | TEXT | Data/hora ISO de criação. |
| `updated_at` | TEXT | Data/hora ISO da última alteração. |

**`movements`** *(opcional — suporta O2)*

| Campo | Tipo | Observação |
|---|---|---|
| `id` | INTEGER PK | Auto-incremento. |
| `product_id` | INTEGER FK → products(id) | `ON DELETE CASCADE`. |
| `type` | TEXT | `'in'` ou `'out'`. |
| `quantity` | INTEGER | Unidades movimentadas. |
| `created_at` | TEXT | Data/hora ISO. |

**Regra de exclusão de categoria:** ao excluir uma categoria em uso, os produtos
ficam **sem categoria** (`category_id = NULL`) — a exclusão não é bloqueada. Essa
decisão está alinhada ao `ON DELETE SET NULL` acima.

### 5.3 Telas e navegação

| Tela | Responsabilidade |
|---|---|
| **Lista de Inventário** (home) | Busca + filtro por categoria; lista de produtos com nome, código e quantidade; botões para **escanear** e **adicionar manualmente**. |
| **Leitor (Scanner)** | Abre a câmera, lê o código e encaminha: produto **existente** → tela de movimentação/edição; produto **novo** → editor pré-preenchido. |
| **Editor de Produto** | Criar/editar: nome (obrigatório), código, descrição, quantidade, estoque mínimo, preço, categoria. Ações: salvar, cancelar, excluir. |
| **Movimentação** | Entrada/saída rápida de unidades para um produto. |
| **Categorias** | Listar, criar, renomear e excluir categorias. |

**Passagem de dados:** as telas de editor e movimentação recebem apenas o
**`id` do produto**; os dados são lidos do repositório. Evita duplicar estado e
mantém uma única fonte de verdade.

### 5.4 Camadas e estado

```
models  →  repository (acesso ao SQLite)  →  hooks/context  →  telas (expo-router)
```

- **Persistência:** `expo-sqlite` com **SQL direto** e uma camada de repositório
  (sem ORM pesado — princípio "menos é mais").
- **Estado:** React `Context` + *hooks* customizados (`useProducts`,
  `useCategories`) que expõem dados e operações; após cada mutação a lista é
  recarregada. Sem biblioteca de estado pesada.

### 5.5 Dependências principais

| Dependência | Propósito |
|---|---|
| `expo` + `expo-router` | Base do app e navegação. |
| `expo-camera` / `expo-barcode-scanner` | Leitura de código de barras (F1). |
| `expo-sqlite` | Persistência local (F7). |
| `expo-notifications` | *(Opcional)* alerta de estoque baixo (O1). |
| `expo-file-system` + `expo-sharing` | *(Opcional)* exportar CSV (O3). |

---

## 6. Escopo e Restrições de Tempo

**Prazo total:** ~3–4 semanas. O plano abaixo dá prioridade ao essencial e deixa
os opcionais como buffer.

| Semana | Foco |
|---|---|
| **1** | Criar o projeto Expo + navegação + banco SQLite + modelos + CRUD de produtos (sem scanner). |
| **2** | Implementar o **leitor de código de barras** e integrá-lo ao cadastro; CRUD de categorias; busca e filtro. |
| **3** | Movimentação de estoque; polimento da UI; testes de persistência; correção de bugs. |
| **4 (buffer)** | Opcionais (O1–O4) apenas se o essencial estiver estável; testes finais e revisão. |

> **Regra de ouro do escopo:** nada de backend, login, multiusuário ou sincronização
> nesta versão. O essencial precisa funcionar bem antes de qualquer extensão.

---

## 7. Critérios de Aceitação (versão 1)

- [ ] O app compila e abre no emulador/dispositivo.
- [ ] É possível **criar um produto lendo um código de barras** pela câmera.
- [ ] É possível **criar um produto manualmente**.
- [ ] Ler um código **já cadastrado** abre o produto existente (sem duplicar).
- [ ] É possível **editar** e **excluir** produtos.
- [ ] É possível **registrar entrada/saída** e a quantidade é atualizada.
- [ ] É possível **criar, renomear e excluir** categorias.
- [ ] É possível **buscar** e **filtrar por categoria** no inventário.
- [ ] Os dados **persistem** após fechar e reabrir o app.
- [ ] **Negar a permissão da câmera não trava** o app (oferece cadastro manual).

---

## 8. Próximos Passos (fases seguintes)

0. Opcional porém recomendado: criar wireframes, mockup e/ou protótipos da UI para ter como base de referência de layout do frontend (mockups construidos no Figma: https://www.figma.com/proto/wEvnjJzfK1dajTRfCnPg79/Untitled?node-id=7-3416&t=wzSgZkm0PXjGagmb-1&scaling=scale-down&content-scaling=fixed );
1. Inicializar o projeto Expo e configurar a navegação;
2. Criar o banco SQLite e a camada de repositório;
3. Implementar o CRUD de produtos e a leitura de código de barras;
4. Implementar categorias, busca/filtro e movimentações;
5. Testar persistência e permissões; então avaliar os opcionais.



