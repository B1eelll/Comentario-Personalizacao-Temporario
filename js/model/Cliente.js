class Cliente {
    constructor(obj){
        obj = obj || {}; // Tratamento pra efitar tomar erro de propriedade undefined

        this.id = obj.id;
        this.nome = obj.nome;
        this.email = obj.email;
        this.cpfOuCnpj = obj.cpfOuCnpj;
        this.telefone = obj.telefone;
        this.dataCadastro = obj.dataCadastro;
    }

    validar(){
        return !!(this.cpfOuCnpj && this.nome && this.email && this.telefone);
    }
}