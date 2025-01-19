# Gerenciador de Contatos

Este projeto é uma aplicação de gerenciamento de contatos desenvolvida como parte do teste técnico para a vaga de desenvolvedor ReactJS PL na UEX Tecnologia. A aplicação segue as diretrizes do desafio proposto e utiliza boas práticas de desenvolvimento para garantir um código limpo, reutilizável e de fácil manutenção.

---

## Funcionalidades Principais

1. **Cadastro de Usuário**:
   - Permite que o usuário se registre com e-mail e senha.
   - Validação para evitar múltiplos cadastros com o mesmo e-mail.

2. **Login e Logout**:
   - Sistema de autenticação com validação de login.
   - Apenas usuários autenticados podem acessar a lista de contatos.

3. **Gerenciamento de Contatos**:
   - Adicionar contatos.
   - Validação de CPF para evitar duplicidades e garantir conformidade com o algoritmo oficial.
   - Validação de Nome para evitar nomes muito curtos.
   - Salvamento de dados no LocalStorage para persistência.

4. **Ajuda no Cadastro de Endereços**:
   - Integração com a API do ViaCEP para preenchimento automático de endereço ao informar o CEP.
   - Integração com PositionStack para buscar coordenadas.
   - Mensagens de feedback para erros de CEP inválido ou não encontrado.

5. **Integração com Google Maps**:
   - Exibição da localização do contato no mapa.
   - Marcador personalizado (estilo Luigi).
   - Estilo escuro do mapa com destaques em verde, harmonizando com o tema Luigi.

6. **Exclusão de Conta**:
   - Permite que o usuário exclua sua conta, removendo todos os dados do LocalStorage.
   - Alerta de confirmação para evitar exclusões acidentais.

7. **Filtro e Ordenação de Contatos**:
   - Pesquisa por nome ou CPF.
   - Lista ordenada alfabeticamente por padrão.

---

## Tecnologias Utilizadas

- **ReactJS**: Biblioteca principal para desenvolvimento da interface.
- **Material-UI**: Para criação de componentes estilizados seguindo o Material Design V3.
- **LocalStorage**: Para armazenamento persistente dos dados do usuário e contatos.
- **Google Maps API**: Para integração do mapa e obtenção de coordenadas geográficas.
- **PositionStack**: Para obtenção de coordenadas geográficas.
- **ViaCEP API**: Para busca de endereços a partir do CEP.

---

## Como Rodar o Projeto

1. Clone este repositório:
   ```bash
   git clone https://github.com/seu-usuario/gerenciador-de-contatos.git
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Adicione sua chave da Google Maps API e PositionStack no arquivo `ContactList.js`:
   ```env
   apiKey: 'AIzaSyAygWrPYHFVzL0zblaZPkRcgIFZkBNAW9...' // Google Maps API
   access_key: '0f5fdbd711e9fe46085d4b0c239ec384...' // PositionStack
   ```

4. Inicie o servidor de desenvolvimento:
   ```bash
   npm start
   ```

5. Acesse a aplicação em [http://localhost:3000](http://localhost:3000).

---

## Estrutura do Projeto

```
/src
├── components
│   ├── Auth
│   │   ├── Login.js
│   │   └── SignUp.js
│   ├── Contact
│   │   ├── ContactList.js
│   │   └── ContactForm.js
│   └── Shared
│       └── Header.js
├── context
│   ├── AuthContext.js
│   └── ContactContext.js
├── styles
│   ├── theme.js
├── App.js
└── index.js
```

---

## Prints do Sistema

### 1. Tela de Login
![Tela de Login](tela-login.png)

### 2. Tela de Registro
![Tela de Registro](tela-registro.png)

### 3. Tela Principal (Lista de Contatos)
![Tela Principal](tela-contatos.png)

### 4. Modal de Adicionar Contato
![Adicionar Contato](modal-contato.png)

### 5. Contato no Mapa
![Contato no Mapa](contatos-mapa.png)

---

## Como o Projeto Atende ao Desafio

### Requisitos Atendidos

- **Cadastro e Login:**
  - Implementado com validações básicas de e-mail e senha.

- **Gerenciamento de Contatos:**
  - Inclusão de contatos com validações específicas (CPF, Nome e Endereço).
  - Persistência no LocalStorage.

- **Ajuda no Preenchimento do Endereço:**
  - Integração com a API do ViaCEP para busca de endereços.
  - Integração com PositionStack para buscar coordenadas.

- **Exibição no Google Maps:**
  - Mapa estilizado e marcador personalizado.

- **Filtro e Ordenação:**
  - Pesquisa dinâmica por nome ou CPF.

- **Exclusão de Conta:**
  - Função de exclusão com alerta de confirmação.

---

## Contato
Se tiver dúvidas ou precisar de mais informações:

- **Email:** luigimatheus@hotmail.com
- **GitHub:** [https://github.com/luigibreda](https://github.com/luigibreda)

