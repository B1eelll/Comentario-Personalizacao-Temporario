let btnEntrar = document.getElementById('btn-entrar'); // Pega o botao "btn-entrar" do html pelo id
let campoEmail = document.getElementById('email'); // Pega o input do tipo "text" com id de email
let campoSenha = document.getElementById('senha'); // Semalhante ao email, input "password" com id de senha

btnEntrar.addEventListener('click',() => { // Adiciona um evento de click no botao "btn-entrar"
    
    let email = campoEmail.value; // Pega os valores
    let senha = campoSenha.value; // Do campo de email e senha 

    autenticar(email, senha); // Chama a funçãao "autenticar" com os paraametros de email e senha


    // alert("Login efetuado com sucesso!");
    
    // window.location.href = 'home.html';

})

function autenticar(email, senha){ //eis a função autenticar dita anteriormente
    // 1° Criar um request para API
    fetch(URL_API + '/login', { // Aqui faz uma requisição, aqui o senhor utilizou a função que contém a url da api + '/login' Para indicar em qual arquivo vai ser chamada
        method: 'POST', // Método post, método usado para o envio de dados
        headers: { // Aqui é onde você define os headers da requisição
            'Content-Type': 'application/json' // Transforma os dados em arquivo.json semelhantes a uma classe
        },
        body: JSON.stringify({ email, senha }) // transforma os dados "email" e "senha" em arquivos .json
    })
    .then(response => response = response.json()) // Transforma a resposta em json
    .then(json => { // Aqui é onde é feito o tratamento com a resposta

        if(!!json.mensagem){ // Se a resposta tiver uma mensagem
            alert(json.mensagem); // Mostra a mensagem
            return; // 
        }
        // mostrar um loading de carregamento

        mostrarLoading(); // Chama a função "mostrarLoading"
        // SalvarToken e o suario na localStorage
        salvarToken(json.token); // Chama a função salvar token, e o transforma em um arquivo json
        salvarUsuario(json.usuario); // Semelhante ao token, trasnforma o usuario como um arquivo json
        
        // Poderia direcionar para tela de home
        setTimeout(()=> { // Função de """Delay"""
            window.location.href = 'home.html'; // Redirecionamento para a tela home
        }, 2000); //Depois de 2000milisegundos (2 segundos)
    })
    .catch(err => { // tratamento de erro caso a requisição dê errado
        console.error('Erro ao autenticar', err); // mensgame de erro ("erro ao autenticar" + o erro em si)
    });


    // 2° se der certo, direcionar para home.html
    // 3° se der errado, ignorar
}

function mostrarLoading(){ // Função para mostrar um loading
    let loading = document.getElementById('loading'); // Seleciona o elemento com o id "loading"
    loading.style.display = 'flex'; // no momento em que a função é chamada, o display do loading se torna "flex"

    let caixaLogin = document.querySelector('.caixa-login'); // Seleciona o elemento html com a classe "caixa-login"
    caixaLogin.style.display = 'none'; // A caixa de login Desaparece "none"
}

/* Professor, pelo oque eu entendi, essa parte do código tem como objetivo fazer um login no sistema
utilizando a autenticação de token , e caso o login seja bem sucedido, redireciona para a tela de home
e caso o login seja mal sucedido, mostra uma mensagem de erro. 
De ambas as formas, existe um "loading Falso" Criado pelo senhor, apenas para uma maior experiência do usuário. */
