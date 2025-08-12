# 🚀 NestJS Clean Architecture - API de Estudo

## 📋 Objetivos do Projeto

Este projeto foi desenvolvido com o objetivo de estudar e aplicar conceitos avançados de desenvolvimento em Node.js, incluindo:

- ✅ **Criar uma API REST em Node.js com NestJS e TypeScript**
- ✅ **Aplicar Design Patterns em projetos Node.js com TypeScript**
- ✅ **Usar recursos avançados do TypeScript como Interface e Generics**
- ✅ **Aplicar Clean Architecture e DDD em uma API criada com NestJS**
- ✅ **Gerar documentação de API Node.js com NestJS e Swagger**
- ✅ **Criar Workflow de CI com GitHub Actions**
- ✅ **Deploy em Produção a partir de repositório do GitHub**

## 🏗️ Arquitetura da Aplicação

### Clean Architecture + DDD

A aplicação segue os princípios da Clean Architecture e Domain-Driven Design (DDD), organizando o código em camadas bem definidas:

```
src/
├── shared/                    # Código compartilhado entre módulos
│   ├── application/          # Casos de uso e DTOs compartilhados
│   ├── domain/              # Entidades e regras de negócio
│   └── infrastructure/      # Implementações de infraestrutura
└── users/                    # Módulo de usuários
    ├── application/          # Casos de uso específicos
    ├── domain/              # Entidades e regras de negócio
    └── infrastructure/      # Controllers, DTOs e repositórios
```

### Design Patterns Implementados

- **Repository Pattern**: Abstração de acesso a dados
- **Use Case Pattern**: Orquestração de regras de negócio
- **Dependency Injection**: Inversão de controle
- **Factory Pattern**: Criação de objetos complexos
- **Strategy Pattern**: Diferentes implementações de hash

### Recursos Avançados do TypeScript

- **Interfaces**: Contratos bem definidos entre camadas
- **Generics**: Repositórios e validadores reutilizáveis
- **Decorators**: Validação e transformação de dados
- **Type Guards**: Verificação de tipos em runtime

## 🛠️ Tecnologias Utilizadas

- **Framework**: NestJS 11
- **Linguagem**: TypeScript 5.7
- **Banco de Dados**: PostgreSQL + Prisma ORM
- **Validação**: Class Validator
- **Hash**: BcryptJS
- **Testes**: Jest + Supertest
- **Containerização**: Docker + Docker Compose

## 📡 Endpoints da API

### Usuários (`/users`)

| Método   | Endpoint       | Descrição                       | Status Code |
| -------- | -------------- | ------------------------------- | ----------- |
| `POST`   | `/users`       | Criar novo usuário              | 201         |
| `POST`   | `/users/login` | Autenticar usuário              | 200         |
| `GET`    | `/users`       | Listar usuários (com paginação) | 200         |
| `GET`    | `/users/:id`   | Buscar usuário por ID           | 200         |
| `PUT`    | `/users/:id`   | Atualizar dados do usuário      | 200         |
| `PATCH`  | `/users/:id`   | Atualizar senha do usuário      | 200         |
| `DELETE` | `/users/:id`   | Remover usuário                 | 204         |

### Estrutura dos DTOs

#### SignUp

```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```

#### SignIn

```json
{
  "email": "string",
  "password": "string"
}
```

#### Update User

```json
{
  "name": "string",
  "email": "string"
}
```

#### Update Password

```json
{
  "oldPassword": "string",
  "newPassword": "string"
}
```

#### List Users (Query Parameters)

```
?page=1&perPage=10&sortBy=name&sortOrder=asc&search=john
```

## 🚀 Como Executar Localmente

### Pré-requisitos

- Node.js 18+
- Docker e Docker Compose
- Git

### 1. Clone o Repositório

```bash
git clone <seu-repositorio>
cd nestjs-clean-arch
```

### 2. Instale as Dependências

```bash
npm install
```

### 3. Configure as Variáveis de Ambiente

Crie os arquivos de ambiente necessários:

```bash
# .env.development
DATABASE_URL="postgresql://docker:docker@localhost:5432/projectdb"
PORT=3000

# .env.test
DATABASE_URL="postgresql://docker:docker@localhost:5432/projectdb_test"
PORT=3001
```

### 4. Inicie o Banco de Dados com Docker

```bash
docker-compose up -d
```

### 5. Execute as Migrações do Prisma

```bash
npm run prima:migrate
```

### 6. Gere o Cliente Prisma

```bash
npm run prima:generate
```

### 7. Inicie a Aplicação

```bash
# Desenvolvimento (com hot reload)
npm run start:dev

# Produção
npm run start:prod
```

A API estará disponível em: `http://localhost:3000`

## 🧪 Executando Testes

```bash
# Testes unitários
npm run test

# Testes de integração
npm run test:int

# Testes com coverage
npm run test:cov

# Testes E2E
npm run test:e2e

# Testes em modo watch
npm run test:watch
```

## 📚 Comandos Úteis

```bash
# Formatação de código
npm run format

# Linting
npm run lint

# Build da aplicação
npm run build

# Geração de migrations
npm run prima:migrate

# Reset do banco de dados
npx prisma migrate reset
```

## 🌟 Próximos Passos

- [ ] Implementar autenticação JWT
- [ ] Adicionar middleware de logging
- [ ] Implementar rate limiting
- [ ] Configurar Swagger/OpenAPI
- [ ] Criar workflow de CI/CD
- [ ] Configurar deploy automático

## 📝 Licença

Este projeto é para fins educacionais.

## 👨‍💻 Autor

Desenvolvido como parte do curso **NodeJs Avançado com Clean Architecture, NestJS e Typescript**, pelo professor Jorge Aluizio alves de Souza, na Udemy.

---

**Happy Coding! 🚀**
