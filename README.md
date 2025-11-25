<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 🍕 Pizza Vibe Delivery - Sistema Completo de Pedidos Online

Sistema moderno de delivery de pizzas com PDV integrado, gerenciamento de pedidos em tempo real, favoritos, notificações automáticas e muito mais!

## ✨ Funcionalidades

- 🛒 **Carrinho de Compras** - Sistema completo com customizações
- 📱 **WhatsApp Integration** - Pedidos enviados automaticamente via WhatsApp
- 🎯 **PDV (Ponto de Venda)** - Painel admin para gerenciar pedidos
- 🔄 **Sincronização em Tempo Real** - Via Firebase (opcional) ou localStorage
- ⭐ **Sistema de Favoritos** - Salve suas pizzas preferidas
- 📜 **Histórico de Pedidos** - Acompanhe todos os seus pedidos
- 🔔 **Notificações Automáticas** - Cliente recebe notificação quando pedido fica pronto
- 👤 **Perfil do Cliente** - Página de conta com estatísticas e favoritos
- 🎨 **Tema Personalizável** - Customize cores, logo e design pelo painel admin
- 🤖 **AI Sommelier** - Recomendações de pizzas com Gemini AI

## 🚀 Começar

### Pré-requisitos
- Node.js 18+ instalado
- (Opcional) Conta Firebase para backend em tempo real

### Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/Flaviosan1985/pizza-vibe-delivery.git
cd pizza-vibe-delivery
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure variáveis de ambiente**

Copie o arquivo de exemplo:
```bash
cp .env.example .env.local
```

Edite `.env.local` e adicione sua chave do Gemini AI:
```env
GEMINI_API_KEY=sua_chave_gemini_aqui
```

**Firebase (OPCIONAL)**: Se quiser usar backend em tempo real, adicione também:
```env
VITE_FIREBASE_API_KEY=sua_chave_aqui
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-projeto
# ... (veja .env.example para todas as variáveis)
```

4. **Execute o app**
```bash
npm run dev
```

Acesse: `http://localhost:5173`

## 🔧 Modos de Operação

### 📦 Modo Local (Padrão)
- **Sem configuração Firebase necessária**
- Dados salvos no localStorage do navegador
- Funciona 100% offline
- Perfeito para testes e desenvolvimento
- Indicador: Badge "Modo Local" no painel admin

### 🔥 Modo Firebase (Opcional)
- Sincronização em tempo real entre dispositivos
- Dados persistidos na nuvem
- Múltiplos admins podem gerenciar simultaneamente
- Pedidos sincronizados automaticamente
- Indicador: Badge "Firebase" (verde) no painel admin

**Como ativar:** Configure as variáveis `VITE_FIREBASE_*` no `.env.local` (veja [FIREBASE_SETUP.md](FIREBASE_SETUP.md))

## 👨‍💼 Acesso Admin

1. Na tela de login, clique em **"Sou Administrador"**
2. Senha padrão: `admin123`
3. Altere a senha em **Configurações** → **Alterar Senha**

### Funcionalidades do Painel Admin:
- **Cardápio**: Gerenciar categorias, pizzas, bordas e adicionais
- **PDV**: Visualizar e gerenciar status dos pedidos
- **Cupons**: Criar e gerenciar cupons de desconto
- **Cashback**: Configurar programa de cashback
- **Tema**: Personalizar cores, logo e fundo
- **Promoções**: Configurar brindes e promoções
- **Configurações**: Alterar senha e visualizar status de sincronização

## 📱 Fluxo de Pedidos

1. **Cliente** faz pedido no site
2. Pedido vai para **PDV** (status: Pendente)
3. **Admin** marca como "Em Preparo"
4. **Admin** marca como "Pronto" → **WhatsApp abre automaticamente** + **Cliente recebe notificação**
5. **Admin** marca como "Entregue"
6. Pedido fica salvo no histórico do cliente

## 🛠️ Tecnologias

- **React 19** + **TypeScript**
- **Vite** - Build tool
- **Tailwind CSS** - Estilização
- **Framer Motion** - Animações
- **Firebase** (opcional) - Backend em tempo real
- **Gemini AI** - Recomendações inteligentes
- **Lucide React** - Ícones

## 📂 Estrutura do Projeto

```
pizza-app/
├── components/          # Componentes React
│   ├── AdminDashboard.tsx
│   ├── PizzaCard.tsx
│   ├── CartSidebar.tsx
│   ├── MyAccountPage.tsx
│   ├── MyOrdersPage.tsx
│   ├── MyFavoritesPage.tsx
│   └── ...
├── contexts/           # Context API (AdminContext)
├── services/           # Firebase e Gemini integrations
├── types.ts            # TypeScript types
├── constants.ts        # Dados iniciais
└── App.tsx             # Componente principal
```

## 🔒 Segurança

- Senhas armazenadas localmente (cliente)
- Firebase Rules configuráveis para produção
- Variáveis sensíveis em `.env.local` (não versionado)
- Autenticação básica para painel admin

## 📚 Documentação Adicional

- [FIREBASE_SETUP.md](FIREBASE_SETUP.md) - Guia completo de configuração Firebase

## 🤝 Contribuindo

Pull requests são bem-vindos! Para mudanças grandes, abra uma issue primeiro.

## 📄 Licença

MIT

## 💬 Suporte

Abra uma [issue](https://github.com/Flaviosan1985/pizza-vibe-delivery/issues) se encontrar problemas.
