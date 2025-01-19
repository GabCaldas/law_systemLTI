
Guia do Projeto

## Introdução
Este guia explica o funcionamento do projeto, focando no código fornecido. Ele cobre a lógica de funcionamento, a separação de dados e a gravação no Firebase. Comentários foram adicionados ao código para auxiliar no entendimento.

---

## Estrutura Geral

### Diretórios e Componentes
- **pages/MainPage.jsx**: Página principal do sistema. Contém lógica de interação com o Firebase e exibição de dados.
- **components/**: Contém componentes reutilizáveis, como Header, PersonCard, Timeline, etc.
- **auth/firebase.js**: Arquivo de configuração e inicialização do Firebase.
- **public/database.json**: Contém dados locais referenciados pelo sistema.

---

## Funcionalidades Principais

### Conexão com o Firebase
O projeto utiliza o Firebase para autenticação e armazenamento de dados. As configurações do Firebase estão em `firebaseConfig`, e os principais serviços utilizados são:
- **Firestore**: Para armazenamento de dados.
- **Auth**: Para autenticação de usuários.

### Atualização de Status no Firestore
A função `updateFirestoreOnStatusChange` atualiza o status de uma pessoa no Firestore, registrando também o usuário que realizou a mudança e a data/hora.

**Fluxo:**
1. Verifica se o usuário está autenticado.
2. Monta os dados do documento com o novo status.
3. Atualiza ou cria o documento no Firestore com `setDoc`.

### Escuta de Alterações
A função `onSnapshot` escuta alterações em tempo real no Firestore para atualizar os status exibidos.

**Fluxo:**
1. É ativada ao selecionar uma prefeitura.
2. Atualiza o estado `statuses` com as mudanças recebidas do Firestore.

---

## Principais Estados
- `prefeitura`: Identifica a prefeitura selecionada.
- `pessoas`: Dados das pessoas carregados do arquivo JSON.
- `statuses`: Status das pessoas, sincronizados com o Firestore.

---

## Componentes Relevantes

### Header
Componente que permite selecionar a prefeitura e configurações gerais.

### PersonCard
Exibe informações individuais de uma pessoa, permitindo alterar o status.

### Timeline
Mostra uma linha do tempo com os processos de uma pessoa.

### Pagination
Gerencia a navegação entre páginas de registros.

---

## Rotas e Proteção de Acesso
A rota principal é protegida pelo componente `ProtectedRoute`, que verifica se o usuário está autenticado antes de permitir o acesso.

---

## Registro e Login
Os componentes `Register` e `Login` implementam cadastro e autenticação de usuários utilizando o Firebase Auth.

---

## Comentários no Código
**MainPage.jsx**: Foram adicionados comentários ao código original para facilitar o entendimento das funções e lógica de negócios.

**Exemplo de Comentário:**
// Atualiza os estados quando o usuário seleciona uma nova prefeitura.

---

## Conclusão
Este guia serve como base para novos desenvolvedores entenderem a lógica do projeto e como ele interage com o Firebase. Qualquer dúvida ou melhoria pode ser encaminhada ao time responsável.
