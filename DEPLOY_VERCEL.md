# 🚀 Guia de Deploy no Vercel - Pizza Vibe Delivery

## ✅ **Pré-requisitos**
- [x] Código no GitHub
- [x] Conta no Vercel (grátis)
- [x] Firebase configurado (opcional)

---

## 📋 **Passo a Passo Completo**

### **1. Preparar o Repositório GitHub** 
```bash
# Se ainda não subiu para o GitHub:
git init
git add .
git commit -m "Deploy inicial - Pizza Vibe Delivery"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/pizza-vibe-delivery.git
git push -u origin main
```

### **2. Criar Conta no Vercel**
1. Acesse https://vercel.com
2. Clique em "Sign Up"
3. Escolha "Continue with GitHub"
4. Autorize o Vercel a acessar seus repositórios

### **3. Importar Projeto**
1. No dashboard do Vercel, clique em **"Add New Project"**
2. Selecione **"Import Git Repository"**
3. Encontre o repositório `pizza-vibe-delivery`
4. Clique em **"Import"**

### **4. Configurar Build Settings**
O Vercel detecta automaticamente as configurações do Vite:

```
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

✅ **Não precisa alterar nada!** O Vercel já configura automaticamente.

### **5. Adicionar Variáveis de Ambiente** 🔑
Clique em **"Environment Variables"** e adicione:

```env
VITE_FIREBASE_API_KEY=AIzaSyCERyzJWx2Dmw-jVY6tNoCu2pVRrPTGWts
VITE_FIREBASE_AUTH_DOMAIN=pizza-vibe-delivery.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=pizza-vibe-delivery
VITE_FIREBASE_STORAGE_BUCKET=pizza-vibe-delivery.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=131496425922
VITE_FIREBASE_APP_ID=1:131496425922:web:cbb4529d5d6c1d2e12fe5b
```

**IMPORTANTE:** Adicione para todos os ambientes:
- ✅ Production
- ✅ Preview
- ✅ Development

### **6. Deploy!** 🎉
1. Clique em **"Deploy"**
2. Aguarde 1-2 minutos (primeira vez demora mais)
3. ✅ **Pronto!** Seu site está no ar em `https://seu-projeto.vercel.app`

---

## 🌐 **Configurar Domínio Próprio (Opcional)**

### **Opção 1: Comprar Domínio .com.br**
1. Acesse https://registro.br
2. Busque e compre seu domínio (ex: `pizzavibe.com.br`) - **R$ 40/ano**
3. No Vercel, vá em **Settings → Domains**
4. Clique em **"Add Domain"**
5. Digite seu domínio: `pizzavibe.com.br`
6. Vercel mostrará os nameservers:
   ```
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ```
7. No Registro.br, altere os DNS para os da Vercel
8. Aguarde 24h para propagação
9. ✅ Pronto! Seu domínio está funcionando

### **Opção 2: Usar Domínio Grátis da Vercel**
Seu site já está em: `https://pizza-vibe-delivery.vercel.app` (GRÁTIS)

---

## 🔄 **Deploy Automático (CI/CD)**

Após o primeiro deploy, **TODA vez que você fizer push no GitHub**, o Vercel automaticamente:
1. ✅ Detecta a mudança
2. ✅ Faz o build
3. ✅ Testa se funciona
4. ✅ Faz deploy automático em ~30 segundos

```bash
# Workflow normal:
git add .
git commit -m "Nova funcionalidade"
git push origin main

# ↓ Vercel detecta automaticamente
# ↓ Build em ~15 segundos
# ↓ Deploy em ~30 segundos
# ✅ Site atualizado!
```

---

## 🔍 **Verificar Deploy**

### **Logs de Build:**
1. Acesse https://vercel.com/dashboard
2. Clique no projeto
3. Clique no deploy mais recente
4. Veja os logs em tempo real

### **Preview de Branches:**
- ✅ Branch `main` → Deploy em produção
- ✅ Outras branches → Deploy de preview (URL única)
- ✅ Pull Requests → Deploy automático com preview

---

## 📊 **Monitoramento (Grátis)**

O Vercel oferece:
- ✅ **Analytics:** Visualizações, países, dispositivos
- ✅ **Speed Insights:** Performance do site
- ✅ **Logs:** Erros em tempo real
- ✅ **SSL:** HTTPS automático e gratuito

Acesse: https://vercel.com/dashboard → Seu projeto → Analytics

---

## ⚡ **Otimizações Implementadas**

### **Performance:**
- ✅ Build otimizado do Vite (~1MB final)
- ✅ Code splitting automático
- ✅ Lazy loading de imagens
- ✅ Compressão Gzip/Brotli
- ✅ CDN global (site rápido mundial)

### **Mobile:**
- ✅ Touch targets otimizados (min 44x44px)
- ✅ Gestures suaves
- ✅ Responsivo em todos os tamanhos
- ✅ PWA ready (instalar como app)

### **SEO:**
- ✅ Meta tags configuradas
- ✅ Open Graph para redes sociais
- ✅ Sitemap automático
- ✅ Performance 90+ no Lighthouse

---

## 🐛 **Troubleshooting**

### **Erro: "Module not found"**
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
npm run build
git add .
git commit -m "fix: dependencies"
git push
```

### **Erro: "Environment variables not working"**
1. Vercel → Settings → Environment Variables
2. Verifique se todas as variáveis `VITE_*` estão lá
3. Clique em **"Redeploy"** no último deploy

### **Site lento:**
1. Verifique imagens (max 500KB cada)
2. Use compressão no admin panel
3. Vercel Analytics mostrará gargalos

---

## 💰 **Custos**

| Item | Preço |
|------|-------|
| Vercel Hosting | **GRÁTIS** ✅ |
| Firebase (50k reads/dia) | **GRÁTIS** ✅ |
| Domínio .com.br | R$ 40/ano (~R$ 3,33/mês) |
| **TOTAL** | **R$ 3,33/mês** 💰 |

---

## 📱 **Instalar como PWA (Progressive Web App)**

Seu site já é um PWA! Usuários podem instalar:

**No celular:**
1. Abra o site no Chrome/Safari
2. Menu → "Adicionar à tela inicial"
3. ✅ Ícone na tela como app nativo

**No desktop:**
1. Abra o site no Chrome
2. Barra de endereço → ícone de instalação
3. ✅ App instalado no computador

---

## 🎯 **Próximos Passos**

- [ ] Adicionar Google Analytics
- [ ] Configurar Mercado Pago (pagamentos)
- [ ] Implementar notificações push
- [ ] Adicionar rastreamento de entrega
- [ ] Criar API de cupons automáticos

---

## 📞 **Suporte**

**Vercel:**
- Docs: https://vercel.com/docs
- Community: https://github.com/vercel/vercel/discussions

**Firebase:**
- Docs: https://firebase.google.com/docs
- Console: https://console.firebase.google.com

---

## ✅ **Checklist Final**

- [ ] Código no GitHub
- [ ] Deploy no Vercel funcionando
- [ ] Variáveis de ambiente configuradas
- [ ] Firebase sincronizando
- [ ] Domínio próprio (opcional)
- [ ] SSL/HTTPS ativo
- [ ] Analytics configurado
- [ ] Testado em mobile
- [ ] Testado no desktop
- [ ] Compartilhado com amigos! 🎉

---

**🚀 Parabéns! Seu delivery de pizzas está no ar!**
