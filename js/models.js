export class Usuario {
    constructor(NomeCompleto, Email, SenhaHash, ID_Usuario = crypto.randomUUID(), DataCadastro = new Date().toISOString()) {
        this.ID_Usuario = ID_Usuario;
        this.NomeCompleto = NomeCompleto;
        this.Email = Email;
        this.SenhaHash = SenhaHash;
        this.DataCadastro = DataCadastro;
    }
    static fromJSON(json) { return new Usuario(json.NomeCompleto, json.Email, json.SenhaHash, json.ID_Usuario, json.DataCadastro); }
}

export class Categoria {
    constructor(Nome, Descricao, ID_Categoria = crypto.randomUUID()) {
        this.ID_Categoria = ID_Categoria;
        this.Nome = Nome;
        this.Descricao = Descricao;
    }
    static fromJSON(json) { return new Categoria(json.Nome, json.Descricao, json.ID_Categoria); }
}

export class Curso {
    constructor(Titulo, Descricao, ID_Instrutor, ID_Categoria, Nivel, DataPublicacao, TotalAulas = 0, TotalHoras = 0, ID_Curso = crypto.randomUUID()) {
        this.ID_Curso = ID_Curso;
        this.Titulo = Titulo;
        this.Descricao = Descricao;
        this.ID_Instrutor = ID_Instrutor;
        this.ID_Categoria = ID_Categoria;
        this.Nivel = Nivel;
        this.DataPublicacao = DataPublicacao;
        this.TotalAulas = TotalAulas;
        this.TotalHoras = TotalHoras;
    }
    static fromJSON(json) { return new Curso(json.Titulo, json.Descricao, json.ID_Instrutor, json.ID_Categoria, json.Nivel, json.DataPublicacao, json.TotalAulas, json.TotalHoras, json.ID_Curso); }
}

export class Modulo {
    constructor(ID_Curso, Titulo, Ordem, ID_Modulo = crypto.randomUUID()) {
        this.ID_Modulo = ID_Modulo;
        this.ID_Curso = ID_Curso;
        this.Titulo = Titulo;
        this.Ordem = Ordem;
    }
    static fromJSON(json) { return new Modulo(json.ID_Curso, json.Titulo, json.Ordem, json.ID_Modulo); }
}

export class Aula {
    constructor(ID_Modulo, Titulo, TipoConteudo, URL_Conteudo, DuracaoMinutos, Ordem, ID_Aula = crypto.randomUUID()) {
        this.ID_Aula = ID_Aula;
        this.ID_Modulo = ID_Modulo;
        this.Titulo = Titulo;
        this.TipoConteudo = TipoConteudo;
        this.URL_Conteudo = URL_Conteudo;
        this.DuracaoMinutos = DuracaoMinutos;
        this.Ordem = Ordem;
    }
    static fromJSON(json) { return new Aula(json.ID_Modulo, json.Titulo, json.TipoConteudo, json.URL_Conteudo, json.DuracaoMinutos, json.Ordem, json.ID_Aula); }
}

export class Matricula {
    constructor(ID_Usuario, ID_Curso, DataMatricula = new Date().toISOString(), DataConclusao = null, ID_Matricula = crypto.randomUUID()) {
        this.ID_Matricula = ID_Matricula;
        this.ID_Usuario = ID_Usuario;
        this.ID_Curso = ID_Curso;
        this.DataMatricula = DataMatricula;
        this.DataConclusao = DataConclusao;
    }
    static fromJSON(json) { return new Matricula(json.ID_Usuario, json.ID_Curso, json.DataMatricula, json.DataConclusao, json.ID_Matricula); }
}

export class Progresso_Aula {
    constructor(ID_Usuario, ID_Aula, DataConclusao = null, Status = 'Pendente') {
        this.ID_Usuario = ID_Usuario;
        this.ID_Aula = ID_Aula;
        this.DataConclusao = DataConclusao;
        this.Status = Status; // 'Pendente' ou 'Concluida'
    }
    static fromJSON(json) { return new Progresso_Aula(json.ID_Usuario, json.ID_Aula, json.DataConclusao, json.Status); }
}

export class Avaliacao {
    constructor(ID_Usuario, ID_Curso, Nota, Comentario, DataAvaliacao = new Date().toISOString(), ID_Avaliacao = crypto.randomUUID()) {
        this.ID_Avaliacao = ID_Avaliacao;
        this.ID_Usuario = ID_Usuario;
        this.ID_Curso = ID_Curso;
        this.Nota = Nota;
        this.Comentario = Comentario;
        this.DataAvaliacao = DataAvaliacao;
    }
    static fromJSON(json) { return new Avaliacao(json.ID_Usuario, json.ID_Curso, json.Nota, json.Comentario, json.DataAvaliacao, json.ID_Avaliacao); }
}

export class Trilha {
    constructor(Titulo, Descricao, ID_Categoria, ID_Trilha = crypto.randomUUID()) {
        this.ID_Trilha = ID_Trilha;
        this.Titulo = Titulo;
        this.Descricao = Descricao;
        this.ID_Categoria = ID_Categoria;
    }
    static fromJSON(json) { return new Trilha(json.Titulo, json.Descricao, json.ID_Categoria, json.ID_Trilha); }
}

export class Trilha_Curso {
    constructor(ID_Trilha, ID_Curso, Ordem) {
        this.ID_Trilha = ID_Trilha;
        this.ID_Curso = ID_Curso;
        this.Ordem = Ordem;
    }
    static fromJSON(json) { return new Trilha_Curso(json.ID_Trilha, json.ID_Curso, json.Ordem); }
}

export class Certificado {
    constructor(ID_Usuario, ID_Curso, ID_Trilha, CodigoVerificacao, DataEmissao = new Date().toISOString(), ID_Certificado = crypto.randomUUID()) {
        this.ID_Certificado = ID_Certificado;
        this.ID_Usuario = ID_Usuario;
        this.ID_Curso = ID_Curso;
        this.ID_Trilha = ID_Trilha;
        this.CodigoVerificacao = CodigoVerificacao;
        this.DataEmissao = DataEmissao;
    }
    static fromJSON(json) { return new Certificado(json.ID_Usuario, json.ID_Curso, json.ID_Trilha, json.CodigoVerificacao, json.DataEmissao, json.ID_Certificado); }
}

export class Plano {
    constructor(Nome, Descricao, Preco, DuracaoMeses, ID_Plano = crypto.randomUUID()) {
        this.ID_Plano = ID_Plano;
        this.Nome = Nome;
        this.Descricao = Descricao;
        this.Preco = Preco;
        this.DuracaoMeses = DuracaoMeses;
    }
    static fromJSON(json) { return new Plano(json.Nome, json.Descricao, json.Preco, json.DuracaoMeses, json.ID_Plano); }
}

export class Assinatura {
    constructor(ID_Usuario, ID_Plano, DataInicio, DataFim, ID_Assinatura = crypto.randomUUID()) {
        this.ID_Assinatura = ID_Assinatura;
        this.ID_Usuario = ID_Usuario;
        this.ID_Plano = ID_Plano;
        this.DataInicio = DataInicio;
        this.DataFim = DataFim;
    }
    static fromJSON(json) { return new Assinatura(json.ID_Usuario, json.ID_Plano, json.DataInicio, json.DataFim, json.ID_Assinatura); }
}

export class Pagamento {
    constructor(ID_Assinatura, ValorPago, DataPagamento, MetodoPagamento, Id_Transacao_Gateway, ID_Pagamento = crypto.randomUUID()) {
        this.ID_Pagamento = ID_Pagamento;
        this.ID_Assinatura = ID_Assinatura;
        this.ValorPago = ValorPago;
        this.DataPagamento = DataPagamento;
        this.MetodoPagamento = MetodoPagamento;
        this.Id_Transacao_Gateway = Id_Transacao_Gateway;
    }
    static fromJSON(json) { return new Pagamento(json.ID_Assinatura, json.ValorPago, json.DataPagamento, json.MetodoPagamento, json.Id_Transacao_Gateway, json.ID_Pagamento); }
}
