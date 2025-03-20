let listaClientes = [];
let tabelaCliente = document.querySelector("table>tbody");
let btnAdicionar = document.querySelector("#btn-adicionar");
let modalCliente = new bootstrap.Modal(
  document.querySelector("#modal-cliente")
);
let modoEdicao = false;

let formModal = {
  titulo: document.querySelector("h4.modal-title"),
  id: document.querySelector("#id"),
  nome: document.querySelector("#nome"),
  email: document.querySelector("#email"),
  cpfOuCnpj: document.querySelector("#cpfOuCnpj"),
  telefone: document.querySelector("#telefone"),
  dataCadastro: document.querySelector("#dataCadastro"),
  btnSalvar: document.querySelector("#btn-salvar"),
  btnCancelar: document.querySelector("#btn-cancelar"),
};

btnAdicionar.addEventListener("click", () => {
  formModal.titulo.textContent = "Adicionar Cliente";
  limparCamposModal();
  modalCliente.show();
});

formModal.btnSalvar.addEventListener("click", () => {
  let cliente = obterClienteDoModal();

  if (!cliente.validar()) {
    Swal.fire({
      title: 'Preencha todos os campos',
      icon: 'warning',
      confirmButtonText: 'OK',
    })
    return;
  }

  // Verificar se estou em modo edição, pois se tiver, eu atualizo, se não eu cadastro


(modoEdicao) ? atualizarClienteNoBackEnd(cliente) : adicionarClienteNoBackEnd(cliente);

});

function limparCamposModal() {
  formModal.id.value = "";
  formModal.nome.value = "";
  formModal.email.value = "";
  formModal.cpfOuCnpj.value = "";
  formModal.telefone.value = "";
  formModal.dataCadastro.value = "";
}
function obterClientes() {
  fetch(URL_API + "/clientes", {
    method: "GET",
    headers: {
      authorization: obterToken(),
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
                        <button onclick="excluirCliente(${cliente.id})" class="btn btn-outline-danger btn-sm mr-3">Excluir</button>`; // Cria um botão de excluir

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

function obterClienteDoModal() {
  return new Cliente({
    id: formModal.id.value,
    nome: formModal.nome.value,
    email: formModal.email.value,
    cpfOuCnpj: formModal.cpfOuCnpj.value,
    telefone: formModal.telefone.value,
    dataCadastro: formModal.dataCadastro.value
      ? new Date(formModal.dataCadastro.value).toISOString()
      : new Date().toISOString(),
  });
}

function adicionarClienteNoBackEnd(cliente) {
  fetch(URL_API + "/clientes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: obterToken(),
    },
    body: JSON.stringify(cliente),
  })
    .then((response) => response.json())
    .then((response) => {
      let novoCliente = new Cliente(response);
      listaClientes.push(novoCliente);
      popularTabela(listaClientes);
      modalCliente.hide();

      Swal.fire({
        title: 'Cliente adicionado com sucesso!',
        icon: 'success',
        timer: 5000,
        showConfirmButton: false
      })
    });
}

function editarCliente(id) {
  //Dizer que estou editando.
  modoEdicao = true;
  //trocar o texto lá do modal para editarCliente;
  formModal.titulo.textContent = "Editar Cliente";

  //Preencher os campos do modal com os dados do cliente que estou editando.
  let cliente = listaClientes.find((c) => c.id == id);
  atualizarCamposModal(cliente);

  //mostrar o modal
  modalCliente.show();
}

function excluirCliente(id) {
  let cliente = listaClientes.find((cliente) => cliente.id == id);

  // if (confirm("Deseja excluir o cliente " + cliente.nome + "?")) {
  //   excluirClienteNoBackEnd(id);
  // }

  Swal.fire({
    title: "Deseja excluir o cliente " + cliente.nome + "?",
    showCancelButton: true,
    confirmButtonText: "Sim",
    cancelButtonText: "Não",
    showLoaderOnConfirm: true,
    icon: "info"     
  }).then((result) => {
    if (result.isConfirmed) {
      excluirClienteNoBackEnd(id);
    }
  });
}

function excluirClienteNoBackEnd(id) {
  fetch(URL_API + "/clientes/" + id, {
    method: "DELETE",
    headers: {
      Authorization: obterToken(),
    },
  }).then(() => {
    removerClienteDaLista(id);
    popularTabela(listaClientes);

    Swal.fire({
      title: 'Cliente excluido com sucesso!',
      icon: 'success',
      timer: 5000,
      showConfirmButton: false
    })
  });
}

function removerClienteDaLista(id) {
  let indice = listaClientes.findIndex((cliente) => cliente.id == id);

  listaClientes.splice(indice, 1);
}

function atualizarCamposModal(cliente) {
  formModal.id.value = cliente.id;
  formModal.nome.value = cliente.nome;
  formModal.email.value = cliente.email;
  formModal.cpfOuCnpj.value = cliente.cpfOuCnpj;
  formModal.telefone.value = cliente.telefone;
  formModal.dataCadastro.value = cliente.dataCadastro.substring(0, 10); // Aqui pego só a data para passar ao campo do tipo date.
}


function atualizarClienteNoBackEnd(cliente){
  fetch(URL_API + "/clientes/" + cliente.id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: obterToken(),
    },
    body: JSON.stringify(cliente),
  })
    .then((response) => response.json())
    .then((response) => {
     
      atualizarClienteNaTabela(cliente);
      modalCliente.hide();

      Swal.fire({
        title: 'Cliente atualizado com sucesso!',
        icon: 'success',
        timer: 5000,
        showConfirmButton: false
      });

    });
}

function atualizarClienteNaTabela(cliente){
  let indice = listaClientes.findIndex((c) => c.id == cliente.id);
  listaClientes[indice] = cliente;

  popularTabela(listaClientes);
}
