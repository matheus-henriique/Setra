# SETRA Frontend

Sistema de Chat e Dashboard - Frontend desenvolvido com Next.js

## 🚀 Tecnologias

- **Next.js 15** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **shadcn/ui** - Componentes UI
- **React Query** - Gerenciamento de estado
- **React Hook Form** - Formulários
- **Zod** - Validação de schemas

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas configurações

# Executar em desenvolvimento
npm run dev
```

## 🔧 Scripts Disponíveis

- `npm run dev` - Executa em modo desenvolvimento
- `npm run build` - Gera build de produção
- `npm run start` - Executa build de produção
- `npm run lint` - Executa linter
- `npm run lint:fix` - Corrige problemas de lint
- `npm run type-check` - Verifica tipos TypeScript

## 🌐 Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|---------|
| `NEXT_PUBLIC_API_URL` | URL da API Backend | `http://localhost:3001` |

## 📁 Estrutura do Projeto

```
src/
├── app/                    # App Router do Next.js
│   ├── (auth)/            # Rotas de autenticação
│   └── (dashboard)/       # Rotas do dashboard
├── components/            # Componentes reutilizáveis
│   ├── auth/             # Componentes de autenticação
│   ├── features/         # Componentes específicos
│   └── ui/               # Componentes base (shadcn/ui)
├── contexts/             # Contextos React
├── hooks/                # Hooks customizados
└── lib/                  # Utilitários e configurações
```

## 🔐 Autenticação

O sistema utiliza JWT para autenticação com as seguintes roles:
- **admin**: Acesso completo
- **support**: Dashboard e Team
- **operator**: Apenas Histórico de Conversas

## 📱 Responsividade

O sistema é totalmente responsivo e funciona em:
- Desktop
- Tablet
- Mobile

## 🚀 Deploy

### Vercel (Recomendado)

1. Conecte o repositório ao Vercel
2. Configure a variável `NEXT_PUBLIC_API_URL`
3. Deploy automático

### Outras Plataformas

```bash
npm run build
npm run start
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request