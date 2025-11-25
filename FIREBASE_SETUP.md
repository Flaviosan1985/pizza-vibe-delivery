# 🔥 Configuração do Firebase para Pizza App

## 📋 Pré-requisitos

1. Conta no [Firebase](https://firebase.google.com/)
2. Node.js e npm instalados

## 🚀 Passo a Passo

### 1. Criar Projeto no Firebase

1. Acesse o [Console do Firebase](https://console.firebase.google.com/)
2. Clique em "Adicionar projeto"
3. Dê um nome ao projeto (ex: "pizza-vibe-app")
4. Desabilite o Google Analytics (opcional)
5. Clique em "Criar projeto"

### 2. Configurar Firestore Database

1. No menu lateral, clique em **"Firestore Database"**
2. Clique em **"Criar banco de dados"**
3. Selecione **"Modo de produção"** (vamos configurar as regras depois)
4. Escolha a localização mais próxima (ex: `southamerica-east1` para São Paulo)
5. Clique em **"Ativar"**

### 3. Configurar Regras de Segurança do Firestore

Clique na aba **"Regras"** e substitua o conteúdo por:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Orders - usuários podem ler seus próprios pedidos, admin pode tudo
    match /orders/{orderId} {
      allow read: if request.auth != null && 
        (request.auth.token.admin == true || 
         resource.data.customerId == request.auth.uid);
      allow write: if request.auth != null;
    }
    
    // Users - usuários podem ler/editar seu próprio perfil
    match /users/{userId} {
      allow read, write: if request.auth != null && 
        (request.auth.uid == userId || request.auth.token.admin == true);
    }
    
    // Favorites - usuários podem gerenciar seus favoritos
    match /favorites/{favoriteId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // Pizzas - todos podem ler, apenas admin pode escrever
    match /pizzas/{pizzaId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    
    // Coupons - todos podem ler, apenas admin pode escrever
    match /coupons/{couponId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    
    // Settings - todos podem ler, apenas admin pode escrever
    match /settings/{settingId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

### 4. Obter Credenciais do Firebase

1. No Console do Firebase, clique no ícone de **engrenagem** ⚙️ (ao lado de "Visão geral do projeto")
2. Clique em **"Configurações do projeto"**
3. Role para baixo até **"Seus apps"**
4. Clique no ícone **Web** `</>`
5. Dê um apelido ao app (ex: "Pizza Vibe Web")
6. **NÃO** marque "Firebase Hosting"
7. Clique em **"Registrar app"**
8. Copie as credenciais do `firebaseConfig`

### 5. Configurar as Credenciais no Código

1. Abra o arquivo `/services/firebaseConfig.ts`
2. Substitua os valores de `firebaseConfig` pelas suas credenciais:

```typescript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456",
  measurementId: "G-XXXXXXXXXX"
};
```

### 6. Configurar Storage (Opcional - para fotos de perfil)

1. No menu lateral do Firebase, clique em **"Storage"**
2. Clique em **"Começar"**
3. Aceite as regras padrão
4. Escolha a mesma localização do Firestore
5. Clique em **"Concluído"**

### 7. Testar a Conexão

1. Execute o app: `npm run dev`
2. Abra o Console do Navegador (F12)
3. Faça login no app
4. Faça um pedido de teste
5. Verifique no Console do Firebase se o pedido apareceu em **Firestore Database**

## 🔄 Migração de Dados do localStorage para Firebase

Se você já tem dados no localStorage e quer migrá-los para o Firebase:

1. Abra o Console do navegador (F12)
2. Execute no console:

```javascript
// Assumindo que você tem acesso à função syncLocalStorageToFirebase
import { syncLocalStorageToFirebase } from './services/firestoreService';
await syncLocalStorageToFirebase();
```

## 📊 Estrutura das Collections no Firestore

```
📁 Firestore Database
├── 📂 orders/
│   └── {orderId}
│       ├── id
│       ├── orderNumber
│       ├── customerId
│       ├── customerName
│       ├── items[]
│       ├── status
│       ├── total
│       └── createdAt
│
├── 📂 users/
│   └── {phone}
│       ├── name
│       ├── phone
│       ├── avatar
│       ├── address
│       └── isAdmin
│
├── 📂 favorites/
│   └── {userId}_{pizzaId}
│       ├── userId
│       ├── pizzaId
│       └── addedAt
│
├── 📂 pizzas/
│   └── {pizzaId}
│       ├── id
│       ├── name
│       ├── description
│       ├── price
│       ├── image
│       ├── category
│       └── available
│
├── 📂 coupons/
│   └── {couponId}
│       ├── code
│       ├── discount
│       ├── active
│       └── expiresAt
│
└── 📂 settings/
    └── theme
        ├── logo
        ├── storeName
        ├── backgroundColor
        └── ...
```

## 🔐 Segurança

⚠️ **IMPORTANTE**: 
- **NUNCA** commite suas credenciais do Firebase no Git
- Adicione `firebaseConfig.ts` ao `.gitignore` se estiver usando credenciais reais
- Use variáveis de ambiente para produção

## 🆘 Suporte

Se tiver problemas:
1. Verifique o Console do navegador (F12) para erros
2. Confira as regras do Firestore
3. Certifique-se de que o projeto Firebase está ativo
4. Verifique se as credenciais estão corretas

## 📚 Recursos

- [Documentação do Firebase](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Console](https://console.firebase.google.com/)
