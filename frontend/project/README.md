# Sistema de Gestão de Estoque

Sistema completo de gestão de estoque com controle de produtos, categorias, departamentos, fornecedores, movimentações e relatórios.

## Funcionalidades

- **Autenticação**: Login e registro de usuários com JWT
- **Dashboard**: Visão geral com estatísticas e alertas de estoque baixo
- **Produtos**: CRUD completo com controle de estoque mínimo e máximo
- **Categorias**: Gerenciamento de categorias de produtos
- **Departamentos**: Controle de departamentos da empresa
- **Fornecedores**: Cadastro completo de fornecedores
- **Movimentações**: Registro de entradas e saídas de estoque
- **Relatórios**: Análise de consumo por departamento com gráficos

## Configuração

1. Copie o arquivo `.env.example` para `.env`:
```bash
cp .env.example .env
```

2. Configure a URL da API no arquivo `.env`:
```
VITE_API_URL=http://localhost:8080
```

3. Instale as dependências:
```bash
npm install
```

4. Execute o projeto:
```bash
npm run dev
```

## Tecnologias Utilizadas

- React 18
- TypeScript
- Tailwind CSS
- Vite
- Lucide React (ícones)

## Estrutura do Projeto

- `/src/pages` - Páginas da aplicação
- `/src/components` - Componentes reutilizáveis
- `/src/services` - Serviços de API
- `/src/contexts` - Contextos React (Auth)
- `/src/types` - Definições de tipos TypeScript

## API Backend

Este frontend foi desenvolvido para se conectar com a API Spring Boot fornecida. Certifique-se de que o backend está rodando antes de iniciar o frontend.
