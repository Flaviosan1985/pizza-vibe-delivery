# 🚀 Guia de Deploy no Vercel

## 📋 Opções de Deploy

Você tem **2 opções**:

### Opção 1: Deploy Rápido (Modo Local - Recomendado) ✅
**Funcionamento**: Usa apenas localStorage, sem Firebase
**Vantagem**: Deploy imediato, zero configuração adicional
**Limitação**: Dados não sincronizam entre dispositivos

### Opção 2: Deploy com Firebase (Sincronização em Tempo Real) 🔥
**Funcionamento**: Dados sincronizados na nuvem
**Vantagem**: Múltiplos admins, sincronização entre dispositivos
**Requer**: Configurar projeto Firebase (15-20 minutos)

---

## 🎯 Opção 1: Deploy Rápido (Modo Local)

### Passo 1: Configure a API do Gemini

1. Acesse o **painel do Vercel**: https://vercel.com/dashboard
2. Clique no seu projeto `pizza-vibe-delivery`
3. Vá em **Settings** → **Environment Variables**
4. Adicione a variável:
   ```
   Nome: GEMINI_API_KEY
   Valor: SUA_CHAVE_GEMINI_AQUI
   ```
   > **Como obter**: https://aistudio.google.com/apikey

5. Clique **Save**
6. Volte para **Deployments** → Clique nos 3 pontos do último deploy → **Redeploy**

✅ **Pronto!** Seu site estará no ar em 2-3 minutos com modo local ativo.

---

## 🔥 Opção 2: Deploy com Firebase (Completo)

### Passo 1: Criar Projeto Firebase

1. Acesse: https://console.firebase.google.com/
2. Clique **"Adicionar projeto"**
3. Nome do projeto: `pizza-vibe-app` (ou outro nome)
4. Desabilite Google Analytics (opcional)
5. Clique **"Criar projeto"**

### Passo 2: Configurar Firestore

1. No menu lateral → **"Firestore Database"**
2. Clique **"Criar banco de dados"**
3. Modo: **"Produção"** (vamos ajustar as regras depois)
4. Localização: **"southamerica-east1"** (São Paulo)
5. Clique **"Ativar"**

### Passo 3: Configurar Regras do Firestore

Na aba **"Regras"**, cole este código:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Leitura pública, escrita apenas para usuários autenticados (opcional)
    match /{document=**} {
      allow read: if true;
      allow write: if true;
    }
  }
}
```

> ⚠️ **Atenção**: Essas regras permitem leitura/escrita livre. Para produção real, implemente autenticação.

Clique **"Publicar"**

### Passo 4: Obter Credenciais Firebase

1. Clique no ícone **⚙️ Configurações** → **"Configurações do projeto"**
2. Role até **"Seus apps"**
3. Clique no ícone **Web** `</>`
4. Apelido do app: `Pizza Vibe Web`
5. **NÃO** marque Firebase Hosting
6. Clique **"Registrar app"**
7. **Copie** o objeto `firebaseConfig`

### Passo 5: Adicionar Variáveis no Vercel

Volte para o **Vercel** → Seu projeto → **Settings** → **Environment Variables**

Adicione **TODAS** estas variáveis (uma por vez):

```env
GEMINI_API_KEY=SUA_CHAVE_GEMINI

VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-projeto
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abc123
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

> 💡 **Dica**: Cole os valores do `firebaseConfig` que você copiou

### Passo 6: Redeploy

1. Vá em **Deployments**
2. Clique nos **3 pontos (...)** do último deploy
3. Clique **"Redeploy"**
4. Aguarde 2-3 minutos

✅ **Pronto!** Agora você tem sincronização em tempo real!

---

## 🔍 Como Verificar se Funcionou

### Modo Local (Opção 1):
1. Acesse seu site no Vercel
2. Faça login como admin (senha: `admin123`)
3. No header do painel, veja o badge: **"Modo Local"** 🟠

### Modo Firebase (Opção 2):
1. Acesse seu site no Vercel
2. Faça login como admin
3. No header do painel, veja o badge: **"Firebase"** 🟢 (verde pulsante)
4. Abra o Console do navegador (F12): deve aparecer ✅ mensagens de conexão Firebase

---

## 🐛 Problemas Comuns

### ❌ Site não atualiza após mudanças no Git
**Solução**: Vercel auto-deploya quando você faz `git push`. Aguarde 2-3 minutos.

### ❌ Badge mostra "Modo Local" mas configurei Firebase
**Soluções**:
1. Verifique se **TODAS** as variáveis `VITE_FIREBASE_*` estão no Vercel
2. Nomes devem ser **EXATOS** (com `VITE_` no início)
3. Faça **Redeploy** depois de adicionar variáveis
4. Limpe cache do navegador (Ctrl + Shift + R)

### ❌ Erro "Firebase: Error (auth/...)"
**Solução**: Regras do Firestore muito restritivas. Use as regras do Passo 3 acima.

### ❌ PDV não mostra pedidos
**No Modo Local**: Pedidos só aparecem no mesmo navegador
**No Modo Firebase**: Verifique se as regras do Firestore estão publicadas

---

## 🎯 Resumo Rápido

| Ação | Opção 1 (Local) | Opção 2 (Firebase) |
|------|-----------------|-------------------|
| Tempo de setup | 5 minutos | 20 minutos |
| Configuração | Apenas `GEMINI_API_KEY` | `GEMINI_API_KEY` + 7 vars Firebase |
| Sincronização | ❌ Apenas localStorage | ✅ Tempo real |
| Múltiplos admins | ❌ Não | ✅ Sim |
| Melhor para | Testes, uso pessoal | Produção, equipe |

---

## 📞 Precisa de Ajuda?

1. **Verificar variáveis**: Vercel → Settings → Environment Variables
2. **Ver logs de build**: Vercel → Deployments → Clique no deploy → View Build Logs
3. **Testar localmente**: `npm run dev` (deve funcionar igual ao Vercel)

---

## 🔄 Atualizações Futuras

Sempre que fizer `git push`:
1. Vercel detecta automaticamente
2. Faz build e deploy
3. Novo deploy fica pronto em ~2 minutos
4. URL permanece a mesma

**Variáveis de ambiente não são sobrescritas** nos deploys automáticos.
