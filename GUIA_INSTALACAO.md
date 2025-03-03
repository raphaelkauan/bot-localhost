## 💾 Instalação

## Pré-requisitos

1. Certifique-se de ter o [Node.js](https://nodejs.org/en) instalado em sua máquina.

2. Verifique se você também tem o [Git](https://git-scm.com/downloads) instalado para clonar o repositório.

---

## Passos de Instalação

Siga os passos abaixo para configurar e executar o projeto.

### 1. Clone o repositório

No terminal, execute o comando abaixo para clonar o repositório do projeto:

```bash
git clone https://github.com/raphaelkauan/bot-localhost
```

### 2. Instale as dependências

Acesse o diretório do projeto e instale as dependências necessárias:

```bash
cd bot-localhost
npm install
```

### 3. Configure um servidor Lavalink para integração com o bot
⚠ É essencial ter um servidor Lavalink configurado e em funcionamento para que o bot opere corretamente.

### 4. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto e adicione as seguintes variáveis, substituindo pelos valores apropriados:

```env
BOT_TOKEN_DC=seu_bot_token
CHANNEL_MUSIC_ID=id_do_canal_musica
CHANNEL_WELCOME_ID=id_do_canal_de_entrada
SUPER_USER_ID=id_do_usuario_admin
CLIENT_ID=id_do_bot

CHANNEL_REGRAS=id_do_canal_regras
CHANNEL_CONTEUDO=id_do_canal_conteudo

LAVA_IDENTIFIER=identificador_lavalink
LAVA_HOST=host_do_lavalink
LAVA_PASSWORD=senha_do_lavalink
LAVA_PORT=porta_do_lavalink
LAVA_SECURE=true_ou_false
```

### 5. Inicie o projeto

Agora você pode iniciar o projeto com o seguinte comando:

```bash
npm run dev
```

Qualquer dúvida ou incidente verifique nossa sessão de [perguntas](https://github.com/raphaelkauan/bot-localhost).
