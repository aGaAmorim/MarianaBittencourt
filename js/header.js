async function carregarHeader() {
  const placeholder = document.querySelector("[data-header]");

  if (!placeholder) 
    return;

  const caminhoAtual = window.location.pathname;
  const estaEmServicos = /\/servicos\/[^/]+\.html$/.test(caminhoAtual);

  const caminhoHeader = estaEmServicos ? "../pages/header.html" : "pages/header.html";
  const resposta = await fetch(caminhoHeader);

  if (!resposta.ok) {
    throw new Error("Não foi possível carregar o cabeçalho.");
  }

  placeholder.innerHTML = await resposta.text();

  configurarLinks();
  configurarMenuMobile();
  configurarDropdown();
  marcarPaginaAtual();
}

function configurarLinks() {
  const estaEmServicos = /\/servicos\/[^/]+\.html$/.test(
    window.location.pathname
  );

  const raiz = estaEmServicos ? "../" : "";

  const destinos = {
    home: `${raiz}index.html`,
    about: `${raiz}sobre.html`,
    portfolio: `${raiz}portfolio.html`,
    contact: `${raiz}contato.html`,
    dance: `${raiz}servicos/danca.html`,
    choreography: `${raiz}servicos/coreografias.html`,
    events: `${raiz}servicos/eventos.html`
  };

  document.querySelectorAll("[data-link]").forEach((link) => {
    const destino = destinos[link.dataset.link];

    if (destino) {
      link.href = destino;
    }
  });
}

function configurarMenuMobile() {
  const botao = document.querySelector(".menu-toggle");
  const navegacao = document.querySelector(".main-navigation");

  if (!botao || !navegacao) 
    return;

  function fecharMenu() {
    botao.setAttribute("aria-expanded", "false");
    botao.setAttribute("aria-label", "Abrir menu");
    navegacao.classList.remove("is-open");
  }

  botao.addEventListener("click", () => {
    const aberto = botao.getAttribute("aria-expanded") === "true";

    botao.setAttribute("aria-expanded", String(!aberto));
    botao.setAttribute(
      "aria-label",
      aberto ? "Abrir menu" : "Fechar menu"
    );

    navegacao.classList.toggle("is-open", !aberto);
  });

  navegacao.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", fecharMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      fecharMenu();
      document.querySelector(".dropdown-toggle")
        ?.setAttribute("aria-expanded", "false");
      document.querySelector(".nav-dropdown")
        ?.classList.remove("is-open");
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
      fecharMenu();
    }
  });
}

function configurarDropdown() {
  const dropdown = document.querySelector(".nav-dropdown");
  const botao = document.querySelector(".dropdown-toggle");

  if (!dropdown || !botao) 
    return;

  botao.addEventListener("click", () => {
    const aberto = dropdown.classList.toggle("is-open");

    botao.setAttribute("aria-expanded", String(aberto));
  });

  document.addEventListener("click", (event) => {
    if (!dropdown.contains(event.target)) {
      dropdown.classList.remove("is-open");
      botao.setAttribute("aria-expanded", "false");
    }
  });
}

function marcarPaginaAtual() {
  const caminho = window.location.pathname;

  document.querySelectorAll("[data-link]").forEach((link) => {
    const destino = new URL(link.href).pathname;
    const paginaAtual = destino === caminho;

    if (paginaAtual) {
      link.classList.add("is-active");
      link.setAttribute("aria-current", "page");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  carregarHeader().catch((erro) => {
    console.error("Erro ao inicializar o header:", erro);
  });
});

