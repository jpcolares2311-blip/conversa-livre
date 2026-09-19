const chat = document.getElementById("chat");
const chatForm = document.getElementById("chatForm");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const clearBtn = document.getElementById("clearBtn");
const typing = document.getElementById("typing");

let conversation = [];

const STORAGE_KEY = "conversaLivre";


/* =========================
   INICIALIZAÇÃO
========================= */

document.addEventListener("DOMContentLoaded", () => {

    carregarConversa();

    ajustarTextarea();

});


/* =========================
   ENVIAR MENSAGEM
========================= */

chatForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const texto = messageInput.value.trim();

    if (!texto) {
        return;
    }

    adicionarMensagem(texto, "user");

    conversation.push({
        role: "user",
        content: texto
    });

    salvarConversa();

    messageInput.value = "";

    ajustarTextarea();

    bloquearInput(true);

    mostrarDigitando(true);

    try {

        

        const resposta = await conversarComIA(texto);

        mostrarDigitando(false);

        adicionarMensagem(resposta, "bot");

        conversation.push({
            role: "assistant",
            content: resposta
        });

        salvarConversa();

    } catch (erro) {

        console.error(erro);

        mostrarDigitando(false);

        const respostaFallback =
            gerarRespostaLocal(texto);

        adicionarMensagem(
            respostaFallback,
            "bot"
        );

        conversation.push({
            role: "assistant",
            content: respostaFallback
        });

        salvarConversa();

    } finally {

        bloquearInput(false);

        messageInput.focus();

    }

});


/* =========================
   CONEXÃO COM IA
========================= */

async function conversarComIA(texto) {

    httpp//mayumi.openai.azure.com/openai/v1/chat/

    const response = await fetch("/api/chat", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            mensagem: texto,

            historico:
                conversation.slice(-12)

        })

    });


    if (!response.ok) {

        throw new Error(
            "Servidor de IA indisponível."
        );

    }


    const data =
        await response.json();


    if (!data.resposta) {

        throw new Error(
            "A IA não retornou uma resposta."
        );

    }


    return data.resposta;

}


/* =========================
   RESPOSTA LOCAL
========================= */

function gerarRespostaLocal(texto) {

    const mensagem =
        texto.toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim();


    /* SAUDAÇÕES */

    if (
        /^(oi|ola|olá|oie|oii|bom dia|boa tarde|boa noite|e ai|eai|hello|hey)$/
            .test(mensagem)
    ) {

        return `
            Olá! 👋😊

            Que bom conversar com você!

            Pode me contar o que está pensando,
            fazer uma pergunta ou simplesmente
            começar um papo.
        `;

    }


    /* COMO ESTÁ */

    if (
        mensagem.includes("tudo bem") ||
        mensagem.includes("como voce esta") ||
        mensagem.includes("como vc esta")
    ) {

        return `
            Estou bem! 😄

            Obrigado por perguntar.

            E você? O que gostaria de conversar hoje?
        `;

    }


    /* AGRADECIMENTO */

    if (
        mensagem.includes("obrigado") ||
        mensagem.includes("obrigada") ||
        mensagem === "valeu"
    ) {

        return `
            Por nada! 😊💙

            Sempre que quiser conversar, é só mandar
            uma mensagem.
        `;

    }


    /* DESPEDIDA */

    if (
        mensagem === "tchau" ||
        mensagem.includes("ate mais") ||
        mensagem.includes("ate logo")
    ) {

        return `
            Até mais! 👋

            Quando quiser continuar a conversa,
            estarei por aqui. 💙
        `;

    }


    /* AJUDA */

    if (
        mensagem.includes("o que voce pode fazer") ||
        mensagem.includes("como voce pode ajudar") ||
        mensagem === "ajuda"
    ) {

        return `
            Posso conversar com você sobre vários assuntos. 💬

            Você pode falar sobre:

            • 📚 Estudos
            • 💻 Tecnologia
            • 🎮 Jogos
            • 🎬 Filmes e séries
            • 🎵 Música
            • 🌎 Viagens
            • 💡 Ideias e projetos
            • 🧠 Curiosidades
            • ✍️ Textos
            • 💬 Conversas do dia a dia

            E você também pode simplesmente bater papo comigo.
        `;

    }

}

/* =========================
   ADICIONAR MENSAGEM
========================= */

function adicionarMensagem(texto, tipo) {

    const message =
        document.createElement("div");

    message.className =
        `message ${tipo}`;


    const avatar =
        document.createElement("div");

    avatar.className =
        "avatar";


    if (tipo === "bot") {

        avatar.classList.add("bot-avatar");

        avatar.textContent = "🤖";

    } else {

        avatar.textContent = "👤";

    }


    const content =
        document.createElement("div");

    content.className =
        "message-content";


    const sender =
        document.createElement("div");

    sender.className =
        "sender";

    sender.textContent =
        tipo === "bot"
            ? "Assistente"
            : "Você";


    const bubble =
        document.createElement("div");

    bubble.className =
        "bubble";


    bubble.innerHTML =
        formatarMensagem(texto);


    content.appendChild(sender);

    content.appendChild(bubble);


    message.appendChild(avatar);

    message.appendChild(content);


    chat.appendChild(message);


    scrollParaFinal();

}


/* =========================
   FORMATAR MENSAGEM
========================= */

function formatarMensagem(texto) {

    let resultado =
        escaparHTML(texto);


    /*
     * Negrito
     */

    resultado =
        resultado.replace(
            /\*\*(.*?)\*\*/g,
            "<strong>$1</strong>"
        );


    /*
     * Quebras de linha
     */

    resultado =
        resultado.replace(
            /\n/g,
            "<br>"
        );


    return resultado;

}


/* =========================
   PROTEÇÃO HTML
========================= */

function escaparHTML(texto) {

    const div =
        document.createElement("div");

    div.textContent =
        texto;

    return div.innerHTML;

}


/* =========================
   DIGITANDO
========================= */

function mostrarDigitando(valor) {

    if (!typing) {
        return;
    }

    typing.classList.toggle(
        "hidden",
        !valor
    );

    if (valor) {
        scrollParaFinal();
    }

}


/* =========================
   BLOQUEAR INPUT
========================= */

function bloquearInput(valor) {

    messageInput.disabled = valor;

    sendBtn.disabled = valor;

}


/* =========================
   SCROLL
========================= */

function scrollParaFinal() {

    requestAnimationFrame(() => {

        chat.scrollTo({
            top: chat.scrollHeight,
            behavior: "smooth"
        });

    });

}


/* =========================
   LOCAL STORAGE
========================= */

function salvarConversa() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(conversation)
    );

}


function carregarConversa() {

    const salva =
        localStorage.getItem(
            STORAGE_KEY
        );


    if (!salva) {
        return;
    }


    try {

        conversation =
            JSON.parse(salva);


        if (
            !Array.isArray(conversation)
        ) {

            conversation = [];

            return;

        }


        /*
         * Não duplica a mensagem inicial.
         */

        conversation.forEach(item => {

            if (
                item &&
                item.content
            ) {

                adicionarMensagem(
                    item.content,
                    item.role === "assistant"
                        ? "bot"
                        : "user"
                );

            }

        });

    } catch (erro) {

        console.error(
            "Erro ao carregar conversa:",
            erro
        );

        conversation = [];

        localStorage.removeItem(
            STORAGE_KEY
        );

    }

}


/* =========================
   LIMPAR CONVERSA
========================= */

clearBtn.addEventListener(
    "click",
    () => {

        conversation = [];

        localStorage.removeItem(
            STORAGE_KEY
        );


        chat.innerHTML = `
            <div class="message bot">

                <div class="avatar bot-avatar">
                    🤖
                </div>

                <div class="message-content">

                    <div class="sender">
                        Assistente
                    </div>

                    <div class="bubble">

                        <p>
                            Conversa limpa! 
                        </p>

                        <p>
                            Podemos começar de novo.
                            Sobre o que você quer conversar?
                        </p>

                    </div>

                </div>

            </div>
        `;


        messageInput.focus();

    }
);


/* =========================
   SUGESTÕES
========================= */

document
    .querySelectorAll(".suggestion")
    .forEach(botao => {

        botao.addEventListener(
            "click",
            () => {

                messageInput.value =
                    botao.textContent
                        .trim();

                ajustarTextarea();

                messageInput.focus();

            }
        );

    });


/* =========================
   ENTER
========================= */

messageInput.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            chatForm.requestSubmit();

        }

    }
);


/* =========================
   TEXTAREA AUTOMÁTICO
========================= */

messageInput.addEventListener(
    "input",
    ajustarTextarea
);


function ajustarTextarea() {

    messageInput.style.height =
        "auto";

    messageInput.style.height =
        Math.min(
            messageInput.scrollHeight,
            150
        ) + "px";
}