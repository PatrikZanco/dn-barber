# 🚀 Guia de Deploy — DN Barbearia na Vercel

Este guia contém o passo a passo completo para colocar o sistema no ar na **Vercel** com banco de dados na nuvem e upload de imagens ativo, pronto para uso em produção.

---

## 🛠️ 1. O que já está preparado no código

- [x] **Prisma Client no Build**: Script configurado para `"prisma generate && next build"` no `package.json`.
- [x] **Upload Serverless**: Suporte nativo ao `@vercel/blob` com fallback automático para disco local em desenvolvimento (`src/app/api/upload/route.ts`).
- [x] **Seed Oficial DN Barbearia**: Arquivo `prisma/seed.ts` configurado com:
  - Barbeiro **Daniel** (Cortes Modernos & Degradê);
  - Os **8 serviços reais** com valores e tempos reais;
  - Endereço oficial (`R. Mar Del Plata, 843 - Barreiros, São José - SC`);
  - WhatsApp e Instagram oficiais;
  - Horários de funcionamento semanais;
  - Usuário administrador padrão.
- [x] **Autenticação NextAuth v5**: Compatível com HTTPS e cookies de produção da Vercel.
- [x] **Template de Variáveis**: Arquivo `.env.example` disponível como referência.

---

## 📋 2. Passo a Passo do Deploy

### Passo 1: Criar o Banco de Dados PostgreSQL na Nuvem (Gratuito)

Como a Vercel opera em arquitetura serverless, ela precisa se conectar a um banco PostgreSQL online.

1. Acesse **[neon.tech](https://neon.tech)** e crie uma conta gratuita.
2. Crie um novo projeto (ex: `dn-barbearia`).
3. Copie a **Connection String** fornecida. Ela terá um formato parecido com este:
   ```text
   postgresql://neondb_owner:SENHA@ep-xyz.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
*(Alternativa: você também pode usar o [Supabase](https://supabase.com)).*

---

### Passo 2: Criar as Tabelas e Inserir os Dados Iniciais no Banco

No terminal do seu computador (dentro da pasta do projeto `dn-barbearia`), execute os seguintes comandos:

```powershell
# 1. Define temporariamente a URL do seu banco na nuvem
$env:DATABASE_URL="postgresql://neondb_owner:SENHA@ep-xyz.us-east-2.aws.neon.tech/neondb?sslmode=require"

# 2. Cria todas as tabelas na nuvem
npx prisma db push

# 3. Executa o seed para popular barbeiro Daniel, serviços, horários, endereço e login admin
npx prisma db seed
```

---

### Passo 3: Enviar o Código para o GitHub

Se o projeto ainda não estiver em um repositório Git remoto:

1. Crie um repositório no seu GitHub: [github.com/new](https://github.com/new) (ex: `dn-barbearia`).
2. No terminal do projeto, execute:

```bash
git add .
git commit -m "feat: preparacao completa para deploy na vercel"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/dn-barbearia.git
git push -u origin main
```

---

### Passo 4: Importar o Projeto na Vercel

1. Acesse **[vercel.com](https://vercel.com)** e entre com sua conta do GitHub.
2. Clique no botão **Add New...** e selecione **Project**.
3. Localize e importe o repositório `dn-barbearia`.
4. Na seção **Environment Variables**, adicione as seguintes variáveis:

| Variável | Valor Exemplo / Instrução |
| :--- | :--- |
| `DATABASE_URL` | Sua URL do Neon/Supabase criada no Passo 1 |
| `NEXTAUTH_SECRET` | Uma chave secreta qualquer (ex: frase longa com mais de 32 caracteres) |
| `AUTH_SECRET` | O mesmo valor colocado em `NEXTAUTH_SECRET` |
| `NEXTAUTH_URL` | URL final do seu app (ex: `https://dn-barbearia.vercel.app`) |
| `NEXT_PUBLIC_APP_URL` | O mesmo valor de `NEXTAUTH_URL` |

5. Clique em **Deploy** e aguarde a compilação finalizar (~1 a 2 minutos).

---

### Passo 5: Ativar Armazenamento de Imagens (Vercel Blob — 1 Clique)

Para que novas fotos enviadas pelo painel admin (novos barbeiros, novos cortes) sejam salvas na nuvem com link permanente:

1. No painel do seu projeto na Vercel, acesse a aba **Storage**.
2. Clique em **Create Database** e escolha **Blob**.
3. Siga o assistente e clique em **Connect to Project** (selecionando o projeto `dn-barbearia`).
4. A Vercel adicionará automaticamente a variável `BLOB_READ_WRITE_TOKEN`.
5. *(Opcional)*: Faça um novo deploy ou clique em **Redeploy** na Vercel para carregar a nova variável.

---

## 🔑 3. Dados de Acesso para o Administrador

Após a publicação, entregue os seguintes links e credenciais:

- **Site Público & Agendamentos**: `https://seu-projeto.vercel.app`
- **Painel Administrativo**: `https://seu-projeto.vercel.app/admin/login`
  - **E-mail**: `admin@dnbarbearia.com`
  - **Senha inicial**: `admin123`

> 💡 **Dica de Segurança**: Após o primeiro acesso, o administrador pode alterar sua senha diretamente pelo banco ou cadastrar novos administradores na tabela `users`.
