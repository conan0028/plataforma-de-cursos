import { Usuario, Categoria, Curso, Modulo, Aula, Matricula, Progresso_Aula, Avaliacao, Trilha, Trilha_Curso, Certificado, Plano, Assinatura, Pagamento } from './models.js';

export class Database {
    constructor() {
        this.prefix = 'plat_curs_';
        this.collections = {
            'usuarios': Usuario,
            'categorias': Categoria,
            'cursos': Curso,
            'modulos': Modulo,
            'aulas': Aula,
            'matriculas': Matricula,
            'progressos': Progresso_Aula,
            'avaliacoes': Avaliacao,
            'trilhas': Trilha,
            'trilhas_cursos': Trilha_Curso,
            'certificados': Certificado,
            'planos': Plano,
            'assinaturas': Assinatura,
            'pagamentos': Pagamento
        };
        this.initMockData();
    }

    getAll(collectionName) {
        const raw = localStorage.getItem(this.prefix + collectionName);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        const ClassRef = this.collections[collectionName];
        return parsed.map(item => ClassRef.fromJSON(item));
    }

    saveAll(collectionName, items) {
        localStorage.setItem(this.prefix + collectionName, JSON.stringify(items));
    }

    add(collectionName, item) {
        const items = this.getAll(collectionName);
        items.push(item);
        this.saveAll(collectionName, items);
    }

    getById(collectionName, idField, idValue) {
        const items = this.getAll(collectionName);
        return items.find(item => item[idField] === idValue) || null;
    }

    initMockData() {
        if (this.getAll('categorias').length === 0) {
            // 1 Usuario
            const user1 = new Usuario('Estudante Avaliador', 'avaliador@universidade.edu', 'super_senha_123');
            this.saveAll('usuarios', [user1]);

            // 3 Categorias
            const cat1 = new Categoria('Ciencia da Computacao', 'Fundamentos de software e arquiteturas complexas.');
            const cat2 = new Categoria('Data Science', 'Sistemas de inteligencia artificial e relatorios visuais.');
            const cat3 = new Categoria('DevOps e Nuvem', 'Operacao continuada de servidores em cloud computing.');
            this.saveAll('categorias', [cat1, cat2, cat3]);

            // 3 Cursos
            const cur1 = new Curso('Arquitetura de Algoritmos', 'Lidando com big-o notation em cenarios criticos', crypto.randomUUID(), cat1.ID_Categoria, 'Avancado', new Date().toISOString(), 3, 20);
            const cur2 = new Curso('Machine Learning Fundamentals', 'Conceitos primordiais de regressao e classificacao neuronal', crypto.randomUUID(), cat2.ID_Categoria, 'Intermediario', new Date().toISOString(), 2, 10);
            const cur3 = new Curso('Deploy com Docker', 'Segregacao de contairnes isolados e portabilidade', crypto.randomUUID(), cat3.ID_Categoria, 'Iniciante', new Date().toISOString(), 2, 5);
            this.saveAll('cursos', [cur1, cur2, cur3]);

            // Modulos e Aulas para Curso 1
            const mod1_cur1 = new Modulo(cur1.ID_Curso, 'Complexidade Espacial', 1);
            const mod2_cur1 = new Modulo(cur1.ID_Curso, 'Arvores de Busca', 2);
            this.saveAll('modulos', [mod1_cur1, mod2_cur1]);

            const aula1_m1 = new Aula(mod1_cur1.ID_Modulo, 'Calculando Time Limit', 'Video', 'https://video.com/1', 40, 1);
            const aula2_m1 = new Aula(mod1_cur1.ID_Modulo, 'Grafos Aciclicos', 'Documento', 'https://docs.com/1', 60, 2);
            const aula3_m2 = new Aula(mod2_cur1.ID_Modulo, 'Balanceamento Estrito AVL', 'Video', 'https://video.com/2', 80, 1);
            
            // Modulos e Aulas para Curso 2
            const mod1_cur2 = new Modulo(cur2.ID_Curso, 'Preparacao de Dados CSV', 1);
            const aula1_m2_cur2 = new Aula(mod1_cur2.ID_Modulo, 'Limpeza com Pandas', 'Video', 'https://video.com/3', 30, 1);

            // Modulos e Aulas para Curso 3
            const mod1_cur3 = new Modulo(cur3.ID_Curso, 'Instalacao e Primeiros Passos', 1);
            const aula1_m1_cur3 = new Aula(mod1_cur3.ID_Modulo, 'O arquivo Dockerfile', 'Video', 'https://video.com/4', 20, 1);

            this.saveAll('modulos', [mod1_cur1, mod2_cur1, mod1_cur2, mod1_cur3]);
            this.saveAll('aulas', [aula1_m1, aula2_m1, aula3_m2, aula1_m2_cur2, aula1_m1_cur3]);

            // 2 Planos
            const planoMensal = new Plano('Assinatura Mensal', 'Bypass no catalogo integral por trinta dias sequenciais', 49.90, 1);
            const planoAnual = new Plano('Assinatura Anual Limitada', 'Concessao estendida incluindo mentoria de operacao tecnica', 399.00, 12);
            this.saveAll('planos', [planoMensal, planoAnual]);
        }
    }
}

export const db = new Database();
