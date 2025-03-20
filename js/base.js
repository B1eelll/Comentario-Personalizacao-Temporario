const URL_API = "http://localhost:3400"; // Essa constante pega a API do servidor local

function salvarToken(token) {
  localStorage.setItem("token", token); // Salva o token no local storage
}

function salvarUsuario(usuario) {
  localStorage.setItem("usuario", JSON.stringify(usuario)); // Salva o usuário no local storage
}

function obterToken() {
  return localStorage.getItem("token"); // Pega o token salvo no local storage
}

function obterUsuario() {
  return JSON.parse(localStorage.getItem("usuario")); // Pega o usuário salvo no local storage
}

validarUsuarioAutenticado(); // Ativa a função De validadação do usuario autenticado.

function validarUsuarioAutenticado() { // Função que verifica se o usuário está autenticado
  let logado = usuarioEstaAutenticado();

  if (window.location.pathname == "/login.html") { // Se a página local for a de login
    if (logado) {  // E a função usuarioEstaAutenticado der true....
      window.location.href = "/home.html"; // Redireciona para a página home
    }
  } else {
    if (!logado) { // Se a função der false...
      window.location.href = "/login.html"; // Redireciona de volta para a parte de login
    }   /* Essa função acima, utiliza verifica se o usuario obtem do token de validação,
      Caso ele tenha, então ele é redirecionado para a página home.
     caso contrário ele volta para a tela de login */
  }
}

function usuarioEstaAutenticado() { // Função que verifica se o usuário está autenticado
  let token = obterToken(); // Chama a função "obterToken"

  return token ? true : false; // Condicional ternario.
  // Pelo oque eu entendi o "?" é para a condição true
  // e a ":" é para caso a condição seja false
}

function logout() { // Função para logout, para sair
  localStorage.removeItem("token");  // Ele remove o token de autenticação do LocalStorage
  localStorage.removeItem("usuario"); // Remove o usuario que foi autenticado.
  window.location.href = "/login.html"; // E redireciona para a tela de login
}

/* aqui contém apenas algumas funções que o senhor separou em um arquivo, essas funções podem
e serão utilizadas em todos os arquivos adiante.
Ao invém do senhor recriar essas funções em cada arquivo JS, Basta adicionar esse arquivo "base.js"
nos html , correspondente e ele irá carregar.
muito inteligente, vou usar isso nos meus projetos */