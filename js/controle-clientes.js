let listaClientes = []; // array aonde vai ficar os clientes
let tabelaCliente = document.querySelector("table>tbody"); // tabela que vai ser preenchida com os clientes
let btnAdicionar = document.querySelector("#btn-adicionar"); // Chama o botão que vai adicionar os clientes
let modalCliente = new bootstrap.Modal( // adiciona um novo conteúdo modal vindo da biblioteca do bootstrap
  document.querySelector("#modal-cliente") // chama o modal que vai ser adicionado
);
let modoEdicao = false; // variavel que vai verificar se o cliente está em modo de edição ou não

let formModal = { // array que vai armazenar os dados do cliente dentro do modal
  titulo: document.querySelector("h4.modal-title"), // aqui chama o titulo
  id: document.querySelector("#id"), // aqui o id
  nome: document.querySelector("#nome"), // aquii o nome
  email: document.querySelector("#email"), // email
  cpfOuCnpj: document.querySelector("#cpfOuCnpj"), // cpf ou o cnpj do cliente
  telefone: document.querySelector("#telefone"), // o telefone do cliente
  dataCadastro: document.querySelector("#dataCadastro"), // a data que o cliente foi cadastrado 
  btnSalvar: document.querySelector("#btn-salvar"), //  um botão de salvar os dados
  btnCancelar: document.querySelector("#btn-cancelar"), // e um botão de cancelar as alterações
};

btnAdicionar.addEventListener("click", () => { // o botão "btnAdicionar", recebe um evento de escuta, um click
  formModal.titulo.textContent = "Adicionar Cliente"; //  ao receber a escuta o botão deverá mudar o texto para "Adicionar Cliente"
  limparCamposModal(); // chama a função que limpa os campos do modal
  modalCliente.show(); // chama a função que mostra os novos dados do modal
});

formModal.btnSalvar.addEventListener("click", () => { // o botão "btnSalvar", recebe um evento de escuta, um click
  let cliente = obterClienteDoModal(); // a variavel cliente, recebe um função "obterClienteDoMOdal"

  if (!cliente.validar()) { // Se a validação do cliente não for váloda 
    Swal.fire({ // chama uma mensagem de erro da biblioteca do bootstrap 
      title: 'Preencha todos os campos', // o titulo da mensagem
      icon: 'warning', // o icone, (no caso é um icone de alerta)
      confirmButtonText: 'OK', // o texto do botão de confirmar
    })
    return; // retorna a função
  }

  // Verificar se estou em modo edição, pois se tiver, eu atualizo, se não eu cadastro


(modoEdicao) ? atualizarClienteNoBackEnd(cliente) : adicionarClienteNoBackEnd(cliente); /* isso é uma estrutura
condicional binária. onde verifica a condição "modo de edição", após o "?" é a condição verdadeira
após o ":" é caso a condição seja falsa */

});

function limparCamposModal() { // uma simples função que limpa os campos do modal
  formModal.id.value = ""; // tira o valor do campo id
  formModal.nome.value = ""; // tira o valor do campo nome
  formModal.email.value = ""; // tira o valor do campo enmail
  formModal.cpfOuCnpj.value = "";// tira o valor do campo cpfOuCnpj
  formModal.telefone.value = "";// tira o valor do campo telefone
  formModal.dataCadastro.value = "";// tira o valor do campo dataCadastro
}
function obterClientes() { // aqui uma função que chama na api a tabela clientes
  fetch(URL_API + "/clientes", { //método fetch, recebe a const da url + "/clientes"
    method: "GET", //diz o método. Get = Recupera os dados no servidor
    headers: { //cabeçalho da requisição
      authorization: obterToken(), // para que a requisição seja feita, é necessaria autenticação com token
    },
  }) // Faz a requisição para a URL da API
    .then((response) => response.json()) // Converte a resposta para JSON
    .then((clientes) => {
      // Quando a resposta estiver pronta, executa a função
      console.log(clientes); // Exibe os clientes no console
      listaClientes = clientes; // Atribui a lista de clientes a variável listaClientes
      popularTabela(clientes); // Chama a função para popular a tabela
    });
}

obterClientes(); // Chama a função para obter os clientes

function popularTabela(clientes) {
  tabelaCliente.textContent = ""; // Limpa a tabela

  clientes = clientes.sort((a, b) => a.nome.localeCompare(b.nome)); // Ordena os clientes pelo nome crescente
  // clientes.reverse(); // Inverte a ordem dos clientes

  clientes.forEach((cliente) => {
    let linha = document.createElement("tr"); // Cria uma linha

    let id = document.createElement("td"); // Cria uma célula
    let nome = document.createElement("td"); // Cria uma célula
    let cpf = document.createElement("td"); // Cria uma célula
    let telefone = document.createElement("td"); // Cria uma célula
    let email = document.createElement("td"); // Cria uma célula
    let dataCadastro = document.createElement("td"); // Cria uma célula
    let acoes = document.createElement("td"); // Cria uma célula

    id.textContent = cliente.id; // Atribui o valor do ID do cliente
    nome.textContent = cliente.nome; // Atribui o valor do nome do cliente
    cpf.textContent = cliente.cpfOuCnpj; // Atribui o valor do CPF do cliente
    telefone.textContent = cliente.telefone; // Atribui o valor do telefone do cliente
    email.textContent = cliente.email; // Atribui o valor do e-mail do cliente
    dataCadastro.textContent = new Date(
      cliente.dataCadastro
    ).toLocaleDateString(); // Atribui o valor da data de cadastro do cliente

    acoes.innerHTML = `
                        <button onclick="editarCliente(${cliente.id})" class="btn btn-outline-primary btn-sm mr-3">Editar</button> 
                        <button onclick="excluirCliente(${cliente.id})" class="btn btn-outline-danger btn-sm mr-3">Excluir</button>`; // Cria um botão de excluir e de editar 

    linha.appendChild(id); // Adiciona a célula de ID na linha
    linha.appendChild(nome); // Adiciona a célula de nome na linha
    linha.appendChild(cpf); // Adiciona a célula de CPF na linha
    linha.appendChild(telefone); // Adiciona a célula de telefone na linha
    linha.appendChild(email); // Adiciona a célula de e-mail na linha
    linha.appendChild(dataCadastro); // Adiciona a célula de data de cadastro na linha
    linha.appendChild(acoes); // Adiciona a célula de ações na linha

    tabelaCliente.appendChild(linha); // Adiciona a linha na tabela
  });
}

function obterClienteDoModal() { // função que tem como objetivo obter os dados dos clientes do modal
  return new Cliente({ // retorna um novo objeto do tipo Cliente
    id: formModal.id.value, // valor do campo id do modal
    nome: formModal.nome.value, // valor do campo nome do modal
    email: formModal.email.value, // valor do campo email do modal
    cpfOuCnpj: formModal.cpfOuCnpj.value, // valor do campo CPF do modal
    telefone: formModal.telefone.value, // valor do campo telefone do modal
    dataCadastro: formModal.dataCadastro.value // valor do campo da data de cadastro do modal
      ? new Date(formModal.dataCadastro.value).toISOString() // converte a data de cadastro para JSON caso, verdadeiro
      : new Date().toISOString(), // caso não tenha valor, atribui a data atual
  });
}

function adicionarClienteNoBackEnd(cliente) { // função que tem como objetivo ADICIONAR um novo cliente no back-end
  fetch(URL_API + "/clientes", { // método fetch, chama a const com o valor da api + "/clientes"
    method: "POST", // método post, objetivo de adicionar
    headers: { // cabeçario
      "Content-Type": "application/json", // conteudo vai ser um arquivo JSON
      Authorization: obterToken(), // para a autenticação vai ser necessária o token
    },
    body: JSON.stringify(cliente), // corpo da requisição, vai ser um arquivo JSON
  })
    .then((response) => response.json()) // converte a resposta para JSON
    .then((response) => { // respota da requisição: 
      let novoCliente = new Cliente(response); // cria uma variavel responsavel para esse novo cliente adicionado
      listaClientes.push(novoCliente); // faz um metodo push para adicionar o novo cliente na lista de clientes
      popularTabela(listaClientes); // adiciona esse cliente na tabela
      modalCliente.hide(); // esconde o modal
 
      Swal.fire({ //  mensagem de alerta
        title: 'Cliente adicionado com sucesso!', // titulo da mensagem
        icon: 'success', // icone da mensagem, no caso um icone de sucesso
        timer: 5000, // tempo que essa mensagem vai ficar na tela (5000 milisegundos, ou 5 segundos)
        showConfirmButton: false //botão de fechar
      })
    });
}

function editarCliente(id) { // função de editar um cliente pelo id
  //Dizer que estou editando.
  modoEdicao = true; // modo de edição ativado  

  formModal.titulo.textContent = "Editar Cliente";  //trocar o texto lá do modal para editarCliente;

  //Preencher os campos do modal com os dados do cliente que estou editando.
  let cliente = listaClientes.find((c) => c.id == id); // cria uma variavel com o nome de cliente e busca na lista de clientes o cliente que tem o id igual ao id passado
  atualizarCamposModal(cliente); // função para atualizar os campos do modal

  //mostrar o modal
  modalCliente.show(); // função para mostrar o modal
}

function excluirCliente(id) { //  função de excluir um cliente
  let cliente = listaClientes.find((cliente) => cliente.id == id); // cria uma variavel responsavel para o cliente que vai ser excluido

  // if (confirm("Deseja excluir o cliente " + cliente.nome + "?")) {
  //   excluirClienteNoBackEnd(id);
  // }

  Swal.fire({ // mais uma mensagem de alerta 
    title: "Deseja excluir o cliente " + cliente.nome + "?", //  titulo da mensagem com o conteúdo de "Deseja excluir o cliente xxxxxx ? "
    showCancelButton: true, // botao de cancelar 
    confirmButtonText: "Sim", // conteudo do botão de confirmaar
    cancelButtonText: "Não", // conteudo do botão de cancelar 
    showLoaderOnConfirm: true, // exibe um carregamento enquanto a requisição é feita
    icon: "info"      // icone de informação
  }).then((result) => { // resposta da mensagem de alerta
    if (result.isConfirmed) { //  caso o usuario clique no botão de confirmar
      excluirClienteNoBackEnd(id); // chama a função de excluir o id do cliente no backend
    }
  });
}

function excluirClienteNoBackEnd(id) { //  conteudo da função de excluir o cliente do backend
  fetch(URL_API + "/clientes/" + id, { // faz uma requisição para o backend para excluir o cliente
    method: "DELETE", // metódo delete, responsavel por simplismente deletar o cliente do backend
    headers: { // cabeçario da requisição
      Authorization: obterToken(), // autorização da requisição é o token
    },
  }).then(() => { // resposta da requisição
    removerClienteDaLista(id); // função remover o id do cliente
    popularTabela(listaClientes); // popular novamente a lista de clientes na teabela

    Swal.fire({ // mostrar uma mensagem de alerta 
      title: 'Cliente excluido com sucesso!', // titulo da mensagem 
      icon: 'success', // icone da mensagem
      timer: 5000, //  tempo que a mensagem será exibida
      showConfirmButton: false // botão de fechar
    })
  });
}

function removerClienteDaLista(id) { //  função de remover o cliente da lista utilizando o id por parametro
  let indice = listaClientes.findIndex((cliente) => cliente.id == id); // procura o indice do cliente que tem o id igual ao id passado

  listaClientes.splice(indice, 1); // remove o cliente da lista
}

function atualizarCamposModal(cliente) { //  função de atualizar o campo do modal na tabela clientes
  formModal.id.value = cliente.id; //  informa o id 
  formModal.nome.value = cliente.nome; //  informa o nome
  formModal.email.value = cliente.email; //  informa o email 
  formModal.cpfOuCnpj.value = cliente.cpfOuCnpj; //  informa o cpfOuCnpj
  formModal.telefone.value = cliente.telefone; //  informa o telefone
  formModal.dataCadastro.value = cliente.dataCadastro.substring(0, 10); // Aqui pego só a data para passar ao campo do tipo date.
}


function atualizarClienteNoBackEnd(cliente){ // função de atualizar o cliente no backend
  fetch(URL_API + "/clientes/" + cliente.id, { // requisição para o backend atualizar o cliente
    method: "PUT", // método put (ADICIONAR)
    headers: { // cabeçalho
      "Content-Type": "application/json", // transforma em um arquivo JSON
      Authorization: obterToken(), // autorização da requisição é o token
    },
    body: JSON.stringify(cliente), // Corpo da requisição é um arquivo JSON
  })
    .then((response) => response.json()) // resposta transforma o arquivo em JSON 
    .then((response) => { // Resposta da requisição
     
      atualizarClienteNaTabela(cliente); // função de atualizar o cliente na tabela
      modalCliente.hide(); // esconde o modal

      Swal.fire({ // mensagem de alerta
        title: 'Cliente atualizado com sucesso!', // titulo da mensagem
        icon: 'success', // icone da mensagem
        timer: 5000, // tempo que a mensagem será exibida
        showConfirmButton: false // botão de fechar
      });

    });
}

function atualizarClienteNaTabela(cliente){ // funlção de atualizar os clientes na tabela
  let indice = listaClientes.findIndex((c) => c.id == cliente.id); // função de procurar o indice do cliente que tem o id igual ao id do cliente que foi atualizado
  listaClientes[indice] = cliente; // array dos clientes

  popularTabela(listaClientes); // função popular a tabela recebe como parametro a lista de clientes
}
