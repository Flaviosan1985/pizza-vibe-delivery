# ✅ Checklist de Deploy - Pizza Vibe Delivery

## 📋 **Antes do Deploy**

### **1. Código**
- [x] Build funcionando (`npm run build`)
- [x] Sem erros TypeScript
- [x] Sem erros de console
- [x] Loop infinito corrigido
- [x] Firebase configurado
- [x] Todas as funcionalidades testadas

### **2. Otimizações**
- [x] Imagens comprimidas
- [x] Code splitting configurado
- [x] Lazy loading implementado
- [x] Touch targets otimizados (mobile)
- [x] Animações suaves
- [x] PWA manifest criado

### **3. Arquivos de Configuração**
- [x] `vercel.json` configurado
- [x] `vite.config.ts` otimizado
- [x] `.env` com credenciais Firebase
- [x] `.gitignore` protegendo segredos
- [x] `manifest.json` para PWA

---

## 🚀 **Deploy no Vercel**

### **Passo 1: GitHub**
```bash
git add .
git commit -m "Deploy: Versão otimizada com todas as melhorias"
git push origin main
```

### **Passo 2: Vercel Dashboard**
1. [ ] Acesse https://vercel.com/dashboard
2. [ ] Clique em "Add New Project"
3. [ ] Selecione o repositório `pizza-vibe-delivery`
4. [ ] Configure as variáveis de ambiente

### **Passo 3: Variáveis de Ambiente**
Adicione no Vercel → Settings → Environment Variables:

```env
VITE_FIREBASE_API_KEY=AIzaSyCERyzJWx2Dmw-jVY6tNoCu2pVRrPTGWts
VITE_FIREBASE_AUTH_DOMAIN=pizza-vibe-delivery.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=pizza-vibe-delivery
VITE_FIREBASE_STORAGE_BUCKET=pizza-vibe-delivery.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=131496425922
VITE_FIREBASE_APP_ID=1:131496425922:web:cbb4529d5d6c1d2e12fe5b
```

**IMPORTANTE:** Marque para todos os ambientes (Production, Preview, Development)

### **Passo 4: Deploy**
1. [ ] Clique em "Deploy"
2. [ ] Aguarde 1-2 minutos
3. [ ] ✅ Deploy concluído!

---

## 🧪 **Testes Pós-Deploy**

### **Funcionalidades Principais**
- [ ] Site abre corretamente
- [ ] Logo e nome aparecem
- [ ] Status ABERTO/FECHADO funciona
- [ ] Cards de pizza carregam
- [ ] Abas de categoria funcionam
- [ ] Busca funciona
- [ ] Adicionar ao carrinho funciona
- [ ] Carrinho lateral abre
- [ ] Checkout funciona
- [ ] Favoritos funcionam
- [ ] Histórico de pedidos funciona

### **Painel Admin**
- [ ] Acesso ao painel funciona
- [ ] Adicionar pizza funciona
- [ ] Upload de imagem funciona
- [ ] Editar pizza funciona
- [ ] Pausar/ativar pizza funciona
- [ ] Deletar pizza funciona (com confirmação)
- [ ] PDV mostra pedidos
- [ ] Alterar status de pedido funciona
- [ ] Imprimir pedido funciona
- [ ] Firebase sincroniza (verde)

### **Mobile**
- [ ] Layout responsivo
- [ ] Touch funciona bem
- [ ] Carrinho desliza
- [ ] Banner ajusta tamanho
- [ ] Botões são fáceis de clicar
- [ ] Upload de foto funciona

### **Performance**
- [ ] Site carrega rápido (< 3s)
- [ ] Imagens carregam progressivamente
- [ ] Animações são suaves
- [ ] Sem travamentos
- [ ] Firebase sincroniza rápido

---

## 🔒 **Firebase Firestore Rules**

### **Configure as regras de segurança:**

1. Acesse https://console.firebase.google.com
2. Selecione seu projeto: `pizza-vibe-delivery`
3. Vá em Firestore Database → Rules
4. Cole o código abaixo:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir leitura pública
    match /{document=**} {
      allow read: if true;
    }
    
    // Pizzas - qualquer um pode ler, apenas admin pode escrever
    match /pizzas/{pizzaId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Pedidos - qualquer um pode criar, apenas o dono pode ler
    match /orders/{orderId} {
      allow read: if true;
      allow create: if true;
      allow update: if request.auth != null;
    }
    
    // Cupons - leitura pública, escrita autenticada
    match /coupons/{couponId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Favoritos - usuário pode gerenciar seus favoritos
    match /favorites/{favoriteId} {
      allow read, write: if true;
    }
    
    // Configurações - leitura pública, escrita autenticada
    match /settings/{settingId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

5. [ ] Clique em "Publicar"
6. [ ] Teste a sincronização

---

## 🌐 **Domínio Próprio (Opcional)**

### **Opção 1: Usar domínio gratuito da Vercel**
- URL: `https://pizza-vibe-delivery.vercel.app`
- [ ] Copiar URL e compartilhar

### **Opção 2: Comprar domínio .com.br**
1. [ ] Acesse https://registro.br
2. [ ] Busque e compre: `seudominio.com.br` (R$ 40/ano)
3. [ ] No Vercel → Settings → Domains → Add Domain
4. [ ] Digite seu domínio
5. [ ] Copie os nameservers do Vercel:
   ```
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ```
6. [ ] No Registro.br → Altere os DNS
7. [ ] Aguarde 24h para propagação
8. [ ] ✅ Domínio funcionando!

---

## 📊 **Analytics e Monitoramento**

### **Vercel Analytics (Grátis)**
1. [ ] Vercel Dashboard → Seu projeto → Analytics
2. [ ] Habilitar "Web Analytics"
3. [ ] Ver estatísticas de acesso

### **Firebase Console**
1. [ ] https://console.firebase.google.com
2. [ ] Ver uso de Firestore (reads/writes)
3. [ ] Monitorar Storage (imagens)

---

## 🐛 **Solução de Problemas**

### **Firebase não sincroniza:**
- [ ] Verificar se variáveis de ambiente estão no Vercel
- [ ] Verificar regras do Firestore
- [ ] Fazer redeploy no Vercel
- [ ] Limpar cache do navegador

### **Imagens não carregam:**
- [ ] Verificar Firebase Storage rules
- [ ] Verificar tamanho das imagens (< 5MB)
- [ ] Testar upload novamente

### **Site lento:**
- [ ] Comprimir imagens maiores
- [ ] Verificar Vercel Analytics
- [ ] Limpar dados antigos do Firestore

### **Build falha:**
```bash
# Limpar e reinstalar
rm -rf node_modules package-lock.json dist
npm install
npm run build
```

---

## 📱 **Instalação como PWA**

### **No celular (Android/iOS):**
1. [ ] Abrir site no Chrome/Safari
2. [ ] Menu → "Adicionar à tela inicial"
3. [ ] ✅ Ícone criado como app

### **No desktop (Chrome):**
1. [ ] Abrir site no Chrome
2. [ ] Barra de endereço → ícone de instalação
3. [ ] ✅ App instalado

---

## 🎉 **Lançamento**

### **Marketing:**
- [ ] Compartilhar no WhatsApp
- [ ] Postar no Instagram/Facebook
- [ ] Criar QR Code do site
- [ ] Imprimir cardápio com QR Code
- [ ] Adicionar link no Google Meu Negócio

### **Testes com Clientes:**
- [ ] Pedir para 3 amigos testarem
- [ ] Fazer 1 pedido real
- [ ] Testar fluxo completo: pedido → PDV → WhatsApp
- [ ] Verificar se recebe notificação

---

## ✅ **Checklist Final**

- [ ] Deploy funcionando
- [ ] Firebase sincronizando
- [ ] Mobile testado
- [ ] Desktop testado
- [ ] Pedido teste feito
- [ ] WhatsApp funcionando
- [ ] Admin panel testado
- [ ] Performance ok (< 3s)
- [ ] Sem erros no console
- [ ] Analytics ativo
- [ ] Domínio configurado (opcional)
- [ ] PWA instalável
- [ ] Compartilhado com clientes

---

## 💰 **Custos Mensais**

| Item | Custo |
|------|-------|
| Vercel Hosting | **GRÁTIS** ✅ |
| Firebase (50k reads/dia) | **GRÁTIS** ✅ |
| Domínio .com.br | R$ 3,33/mês (R$ 40/ano) |
| **TOTAL** | **R$ 3,33/mês** 💰 |

---

## 📞 **Suporte**

**Documentação:**
- [DEPLOY_VERCEL.md](./DEPLOY_VERCEL.md) - Guia completo de deploy
- [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) - Configurar Firebase
- [README.md](./README.md) - Documentação geral

**Links Úteis:**
- Vercel: https://vercel.com/docs
- Firebase: https://firebase.google.com/docs
- Vite: https://vitejs.dev/

---

**🚀 Parabéns! Seu delivery está pronto para o mundo!**

Data do checklist: _________________
Realizado por: _________________
