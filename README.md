# 🦅 Granna - Controle Financeiro Pessoal

![Version](https://img.shields.io/badge/version-1.1.6-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Electron](https://img.shields.io/badge/Electron-30.0.4-47848F.svg)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB.svg)

Aplicação desktop multiplataforma para controle financeiro pessoal desenvolvida com Electron, React e TypeScript. Oferece uma interface moderna e intuitiva para gerenciar transações, categorias, metas financeiras e lembretes.

## ✨ Funcionalidades

### 📊 Dashboard
- Visualização consolidada das finanças
- Gráficos interativos de receitas e despesas
- Alertas de limites de gastos excedidos
- Acompanhamento de progresso de metas financeiras
- Lembretes diários

### 💰 Gestão de Transações
- Registro de receitas e despesas
- Categorização de transações
- Filtros e busca avançada
- Histórico completo de movimentações

### 🏷️ Categorias
- Criação e gerenciamento de categorias personalizadas
- Segmentação por tipo (receita/despesa)
- Personalização de cores
- Definição de metas por categoria

### 🎯 Metas Financeiras
- Estabelecimento de objetivos financeiros por categoria
- Visualização de progresso em tempo real
- Acompanhamento baseado em transações

### 📈 Estatísticas
- Análise detalhada de gastos
- Gráficos e relatórios visuais
- Insights sobre padrões de consumo

### ⚠️ Limites de Gastos
- Definição de limites mensais por categoria
- Alertas automáticos no dashboard
- Controle de orçamento

### 📅 Agendamentos
- Criação de lembretes financeiros
- Agendamentos recorrentes
- Notificações de vencimentos

### 👤 Usuários
- Gerenciamento de perfis
- Controle de acesso

## 🛠️ Tecnologias

### Core
- **[Electron](https://www.electronjs.org/)** 30.0.4 - Framework para aplicações desktop
- **[React](https://react.dev/)** 18.3.1 - Biblioteca UI
- **[TypeScript](https://www.typescriptlang.org/)** ~4.5.4 - Superset JavaScript tipado
- **[Vite](https://vitejs.dev/)** ^5.0.12 - Build tool e dev server

### UI/UX
- **[Material-UI](https://mui.com/)** ^5.13.4 - Componentes React
- **[Emotion](https://emotion.sh/)** ^11.11.0 - CSS-in-JS
- **[MUI X Charts](https://mui.com/x/react-charts/)** ^8.20.0 - Gráficos
- **[MUI X Date Pickers](https://mui.com/x/react-date-pickers/)** ^7.11.1 - Seleção de datas
- **[Lottie](https://www.npmjs.com/package/@lottiefiles/react-lottie-player)** ^3.5.4 - Animações

### Roteamento e Estado
- **[React Router DOM](https://reactrouter.com/)** ^6.24.0 - Roteamento
- **[Electron Router DOM](https://www.npmjs.com/package/electron-router-dom)** ^1.0.5 - Roteamento Electron
- **[Redux](https://redux.js.org/)** ^5.0.1 - Gerenciamento de estado
- **[Redux Persist](https://www.npmjs.com/package/redux-persist)** ^6.0.0 - Persistência de estado

### Banco de Dados
- **[SQLite3](https://www.npmjs.com/package/sqlite3)** ^5.1.7 - Banco de dados local

### Formulários e Validação
- **[Formik](https://formik.org/)** ^2.4.6 - Gerenciamento de formulários
- **[Yup](https://www.npmjs.com/package/yup)** ^1.4.0 - Validação de schemas

### Utilitários
- **[Lodash](https://lodash.com/)** ^4.17.21 - Funções utilitárias
- **[Day.js](https://day.js.org/)** ^1.11.12 - Manipulação de datas
- **[date-fns](https://date-fns.org/)** ^3.6.0 - Utilitários de data
- **[Immer](https://immerjs.github.io/immer/)** ^10.1.1 - Estado imutável

### Qualidade de Código
- **[ESLint](https://eslint.org/)** ^8.0.1 - Linter
- **[Husky](https://typicode.github.io/husky/)** ^9.1.7 - Git hooks

## 📋 Pré-requisitos

- **Node.js** 16.x ou superior
- **Yarn** 1.22.x ou superior
- **Git**

## 🚀 Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/wellcec/app-fin-eagle.git
cd app-fin-eagle
```

2. **Instale as dependências**
```bash
yarn install
```

3. **Configure o Husky (Git hooks)**
```bash
yarn prepare
```

## 💻 Desenvolvimento

### Executar em modo desenvolvimento
```bash
yarn start
```

Isso iniciará a aplicação com:
- Hot reload ativado
- DevTools aberto automaticamente
- Servidor de desenvolvimento Vite

### Lint do código
```bash
yarn lint
```

## 📦 Build e Distribuição

### Criar instaladores
```bash
yarn make
```

Isso gerará instaladores para:
- **Windows**: Squirrel (`.exe`)
- **macOS**: ZIP
- **Linux**: DEB e RPM

Os arquivos serão gerados no diretório `out/`.

## 📁 Estrutura do Projeto

```
app-fin-eagle/
├── src/
│   ├── assets/          # Imagens, ícones e recursos estáticos
│   ├── client/          # Camada de acesso a dados
│   │   ├── models/      # Modelos de dados
│   │   └── repository/  # Repositórios SQLite
│   ├── components/      # Componentes React reutilizáveis
│   ├── constants/       # Constantes da aplicação
│   ├── layout/          # Componentes de layout
│   │   └── theme/       # Configurações de tema
│   ├── models/          # Tipos e interfaces TypeScript
│   ├── pages/           # Páginas da aplicação
│   │   ├── Dashboard/
│   │   ├── Transactions/
│   │   ├── Categories/
│   │   ├── Limits/
│   │   ├── Stats/
│   │   ├── Schedules/
│   │   └── Users/
│   ├── routes/          # Configuração de rotas
│   └── shared/          # Utilitários compartilhados
├── main.ts              # Processo principal do Electron
├── preload.ts           # Script de preload
├── renderer.tsx         # Ponto de entrada do renderer
├── app.tsx              # Componente raiz React
├── database.db          # Banco de dados SQLite
├── forge.config.ts      # Configuração Electron Forge
└── package.json         # Dependências e scripts

```

## 🗄️ Banco de Dados

A aplicação utiliza **SQLite** como banco de dados local com as seguintes tabelas:

- **Categories** - Categorias de transações
- **Transactions** - Registro de receitas e despesas
- **Limits** - Limites de gastos por categoria
- **Schedules** - Lembretes e agendamentos
- **users** - Usuários do sistema

O banco é criado automaticamente na primeira execução em `database.db`.

## 👨‍💻 Autor

**Wellington Félix**
- Email: 48068047+wellcec@users.noreply.github.com
- GitHub: [@wellcec](https://github.com/wellcec)

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer um fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abrir um Pull Request

## 📝 Notas de Desenvolvimento

- O DevTools abre automaticamente apenas em modo de desenvolvimento
- O ícone da aplicação está localizado em `src/assets/images/logogranna.png`
- A aplicação usa auto-versionamento via Husky hooks
- Configurado para build em múltiplas plataformas (Windows, macOS, Linux)

---

⭐ Se este projeto foi útil para você, considere dar uma estrela no repositório!
