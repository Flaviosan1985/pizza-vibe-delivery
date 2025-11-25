# 🔒 Guia de Segurança - API Keys

## ⚠️ NUNCA COMMITE API KEYS NO GIT!

### 📋 Checklist de Segurança

✅ **Proteções Ativas:**
- `.env`, `.env.local` e `.env.production` estão no `.gitignore`
- Apenas `.env.example` (com placeholders) está no Git
- Código usa `process.env.VARIAVEL` em vez de valores hardcoded

### 🚨 O que fazer se você commitou uma API key por acidente:

#### 1. **Revogue a chave IMEDIATAMENTE**
```bash
# Para Gemini AI:
# Acesse: https://aistudio.google.com/app/apikey
# Delete a chave comprometida e crie uma nova

# Para Firebase:
# Acesse: https://console.firebase.google.com
# Project Settings → General → Web API Key
# Regenere uma nova chave
```

#### 2. **Remova do histórico do Git**
```bash
# Opção A: Remover arquivo do histórico (recomendado)
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env .env.local" \
  --prune-empty --tag-name-filter cat -- --all

# Opção B: Usar BFG Repo-Cleaner (mais rápido)
# Instale: https://rtyley.github.io/bfg-repo-cleaner/
bfg --delete-files .env
bfg --delete-files .env.local
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Force push (CUIDADO: reescreve histórico)
git push origin --force --all
```

#### 3. **Adicione nova chave segura**
```bash
# Crie novo arquivo .env (NÃO commite!)
cp .env.example .env

# Edite e adicione suas novas chaves
nano .env

# Verifique que está ignorado
git status  # .env NÃO deve aparecer
```

### 🛡️ Boas Práticas

1. **Sempre use variáveis de ambiente:**
   ```typescript
   // ✅ CORRETO
   const apiKey = process.env.GEMINI_API_KEY;
   
   // ❌ ERRADO
   const apiKey = "AIzaSyABC123...";
   ```

2. **Verifique antes de commitar:**
   ```bash
   # Liste arquivos que serão commitados
   git diff --cached --name-only
   
   # Nunca deve aparecer: .env, .env.local, .env.production
   ```

3. **Configure Git hooks (opcional):**
   ```bash
   # Crie .git/hooks/pre-commit
   cat > .git/hooks/pre-commit << 'EOF'
   #!/bin/bash
   if git diff --cached --name-only | grep -E "^\.env$|^\.env\.local$"; then
     echo "❌ ERRO: Tentando commitar arquivo .env!"
     echo "Remova com: git reset HEAD .env"
     exit 1
   fi
   EOF
   
   chmod +x .git/hooks/pre-commit
   ```

### 🔍 Auditoria de Segurança

Execute periodicamente:
```bash
# Buscar API keys hardcoded no código
git grep -i "AIza\|sk-\|firebase.*api.*key" -- '*.ts' '*.tsx' '*.js'

# Verificar histórico de commits
git log --all --full-history -- .env .env.local

# Ver o que está sendo ignorado
git status --ignored
```

### 📦 Configuração no Vercel

**No Vercel, as variáveis são seguras porque:**
- Não aparecem no código fonte
- Não são commitadas no Git
- São criptografadas no servidor
- Apenas você tem acesso

**Como adicionar:**
1. Vercel Dashboard → Seu Projeto
2. Settings → Environment Variables
3. Adicione cada variável manualmente
4. Redeploy

### 🆘 Contatos de Emergência

Se você suspeitar de comprometimento:
- **Gemini AI Support:** https://aistudio.google.com/
- **Firebase Support:** https://firebase.google.com/support
- **GitHub Security:** https://github.com/security

---

**Última atualização:** Novembro 2025
**Mantenha este arquivo atualizado com novas práticas de segurança!**
