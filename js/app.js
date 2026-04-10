import { db } from './data.js';
import { renderTable, populateSelect, showToast } from './ui.js';
import { Usuario, Curso, Categoria, Modulo, Aula, Matricula, Progresso_Aula, Certificado, Assinatura, Pagamento } from './models.js';

window.currentLoggedUser = null;

// ---- 1. SPA Roteamento Centralizado ----
window.MapsTo = function(viewId) {
    // Bloqueio de areas exclusivas para Alunos logados
    if (!window.currentLoggedUser && ['view-catalogo', 'view-minhas-aulas', 'view-financeiro'].includes(viewId)) {
        showToast('Realize seu acesso/cadastro simulado para continuar.', 'warning');
        viewId = 'view-login';
    }

    const views = document.querySelectorAll('section.view');
    views.forEach(v => v.style.display = 'none');
    
    const target = document.getElementById(viewId);
    if (target) {
        target.style.display = 'block';
        loadViewData(viewId);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    MapsTo('view-dashboard');
    setupNavigations();
    setupForms();
    setupEventDelegation();
    
    // Filtro de Categorias em Cursos Administrativos
    const filterCat = document.getElementById('filterCategoria');
    if (filterCat) {
        filterCat.addEventListener('change', () => {
            renderCursos(filterCat.value);
        });
    }

    // Seleção Dinâmica nas Estruturas de Conteúdo
    const cursoSelect = document.getElementById('cursoSelecionadoModulo');
    if (cursoSelect) {
        cursoSelect.addEventListener('change', () => {
            const val = cursoSelect.value;
            const paineis = document.getElementById('paineisConteudo');
            if (val) {
                paineis.style.display = 'flex';
                atualizarSelectModulos(val);
            } else {
                paineis.style.display = 'none';
            }
        });
    }
});

function setupNavigations() {
    document.querySelectorAll('[data-view]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            MapsTo(e.currentTarget.getAttribute('data-view'));
        });
    });

    document.getElementById('btnSairSimulado').addEventListener('click', (e) => {
        e.preventDefault();
        window.currentLoggedUser = null;
        document.getElementById('btnSairSimulado').style.display = 'none';
        showToast('Sessão encerrada.');
        MapsTo('view-dashboard');
    });
}

function loadViewData(viewId) {
    switch (viewId) {
        case 'view-cursos':
            populateSelect('filterCategoria', db.getAll('categorias'), 'ID_Categoria', 'Nome');
            populateSelect('cursoCategoria', db.getAll('categorias'), 'ID_Categoria', 'Nome');
            renderCursos();
            break;
        case 'view-conteudo':
            populateSelect('cursoSelecionadoModulo', db.getAll('cursos'), 'ID_Curso', 'Titulo');
            document.getElementById('cursoSelecionadoModulo').dispatchEvent(new Event('change'));
            break;
        case 'view-catalogo':
            renderCatalogo();
            break;
        case 'view-minhas-aulas':
            renderMinhasAulas();
            break;
        case 'view-financeiro':
            renderPlanosCheckout();
            break;
        case 'view-dashboard':
            document.getElementById('dash-stats').innerHTML = `
                <div class="col-md-4"><div class="card bg-primary text-white p-3"><h5>Usuários</h5><h3>${db.getAll('usuarios').length}</h3></div></div>
                <div class="col-md-4"><div class="card bg-success text-white p-3"><h5>Cursos</h5><h3>${db.getAll('cursos').length}</h3></div></div>
                <div class="col-md-4"><div class="card bg-warning text-dark p-3"><h5>Aulas</h5><h3>${db.getAll('aulas').length}</h3></div></div>
            `;
            break;
    }
}

function atualizarSelectModulos(idCurso) {
    const modulosCurso = db.getAll('modulos').filter(m => m.ID_Curso === idCurso);
    populateSelect('aulaModuloSelect', modulosCurso, 'ID_Modulo', 'Titulo');
}

// ---- Renderizadores Dinâmicos ----
function renderCursos(filtroCategoria = "") {
    let cursos = db.getAll('cursos');
    if (filtroCategoria) {
        cursos = cursos.filter(c => c.ID_Categoria === filtroCategoria);
    }

    const categorias = db.getAll('categorias');
    renderTable('tableCursos', ['Título', 'Categoria', 'Nível', 'Duração'], cursos, c => {
        const cat = categorias.find(cat => cat.ID_Categoria === c.ID_Categoria);
        return `<tr>
            <td>${c.Titulo}</td>
            <td>${cat ? cat.Nome : 'N/A'}</td>
            <td><span class="badge bg-secondary">${c.Nivel}</span></td>
            <td>${c.TotalAulas} pts / ${c.TotalHoras} h</td>
            <td><button class="btn btn-sm btn-danger btn-delete-curso" data-id="${c.ID_Curso}">Remover</button></td>
        </tr>`;
    });
}

function renderCatalogo() {
    const cursos = db.getAll('cursos');
    const container = document.getElementById('catalogoGrid');
    container.innerHTML = cursos.map(c => `
        <div class="col-md-4 mb-4">
            <div class="card h-100 course-card">
                <div class="card-body">
                    <h5 class="card-title text-info">${c.Titulo}</h5>
                    <p class="card-text small text-muted">${c.Descricao}</p>
                    <hr>
                    <span class="badge bg-dark mb-2">${c.Nivel}</span>
                    <button class="btn btn-primary w-100 btn-matricular" data-id="${c.ID_Curso}">Confirmar Interesse (Matrícula)</button>
                </div>
            </div>
        </div>
    `).join('');
}

function renderMinhasAulas() {
    if (!window.currentLoggedUser) return;
    const matriculas = db.getAll('matriculas').filter(m => m.ID_Usuario === window.currentLoggedUser.ID_Usuario);
    const container = document.getElementById('minhasAulasContainer');
    
    if (matriculas.length === 0) {
        container.innerHTML = '<p>Você não possui matrículas letivas. Vá a guia catálogo.</p>';
        return;
    }

    let html = '';
    matriculas.forEach(m => {
        const curso = db.getById('cursos', 'ID_Curso', m.ID_Curso);
        if (!curso) return;
        const modulos = db.getAll('modulos').filter(mod => mod.ID_Curso === curso.ID_Curso).sort((a,b) => a.Ordem - b.Ordem);
        
        html += `<h4>${curso.Titulo}</h4><ul class="list-group mb-4">`;
        modulos.forEach(mod => {
            html += `<li class="list-group-item bg-secondary text-white fw-bold">Módulo: ${mod.Titulo}</li>`;
            const aulas = db.getAll('aulas').filter(a => a.ID_Modulo === mod.ID_Modulo).sort((a,b) => a.Ordem - b.Ordem);
            
            aulas.forEach(aula => {
                const progresso = db.getAll('progressos').find(p => p.ID_Aula === aula.ID_Aula && p.ID_Usuario === window.currentLoggedUser.ID_Usuario);
                const status = progresso ? progresso.Status : 'Pendente';
                const badge = status === 'Concluida' ? '<span class="badge bg-success">Concluída</span>' : '<span class="badge bg-warning text-dark">Á Fazer</span>';
                html += `
                    <li class="list-group-item d-flex justify-content-between align-items-center bg-dark text-white border-secondary">
                        <span class="text-info">${aula.Ordem}. ${aula.Titulo}</span> (${aula.DuracaoMinutos} min)
                        <div>
                            ${badge}
                            ${status !== 'Concluida' ? `<button class="btn btn-sm btn-outline-success ms-3 btn-concluir-aula" data-idaula="${aula.ID_Aula}">Marcar Concluída</button>` : ''}
                        </div>
                    </li>
                `;
            });
        });
        html += `</ul><button class="btn btn-warning mb-5 btn-emitir-certificado fw-bold" data-idcurso="${curso.ID_Curso}">Requerer Emissão de Certificado</button><hr>`;
    });
    container.innerHTML = html;
}

function renderPlanosCheckout() {
    const planos = db.getAll('planos');
    const container = document.getElementById('checkoutPlanos');
    container.innerHTML = planos.map(p => `
        <div class="col-md-6 mb-3">
            <div class="card h-100 price-card border-primary text-white">
                <div class="card-body text-center">
                    <h4 class="card-title">${p.Nome}</h4>
                    <h2 class="display-5 my-3 text-info">R$ ${p.Preco.toFixed(2)}</h2>
                    <p>${p.Descricao}</p>
                    <button class="btn btn-lg btn-success w-100 btn-checkout" data-id="${p.ID_Plano}">Assinar Este Plano</button>
                </div>
            </div>
        </div>
    `).join('');
}


// ---- Configuração de Formulários Centralizados ----
function setupForms() {
    
    // Auth Form
    const formAuth = document.getElementById('formAuthSimulado');
    if (formAuth) {
        formAuth.addEventListener('submit', function(e) {
            e.preventDefault();
            const nome = document.getElementById('authNome').value.trim();
            const email = document.getElementById('authEmail').value.trim();
            const senha = document.getElementById('authSenha').value.trim();

            let users = db.getAll('usuarios');
            let user = users.find(u => u.Email === email && u.SenhaHash === senha);
            
            if (!user) {
                user = new Usuario(nome, email, senha);
                db.add('usuarios', user);
                showToast('Novo cadastro gerado com sucesso. Bem-vindo!');
            } else {
                showToast('Login efetuado com sucesso!');
            }
            
            window.currentLoggedUser = user;
            document.getElementById('btnSairSimulado').style.display = 'block';
            this.reset();
            MapsTo('view-catalogo');
        });
    }

    // Modal Admin Curso Existente
    const formCurso = document.getElementById('formCurso');
    if (formCurso) {
        formCurso.addEventListener('submit', function(e) {
            e.preventDefault();
            const titulo = document.getElementById('cursoTitulo').value.trim();
            const cat = document.getElementById('cursoCategoria').value;
            const nivel = document.getElementById('cursoNivel').value;
            const desc = document.getElementById('cursoDesc').value.trim();
            const tAulas = Number(document.getElementById('cursoTotalAulas').value);
            const tHoras = Number(document.getElementById('cursoTotalHoras').value);
            
            if (!titulo || !desc || !cat) return;
            
            const novoCurso = new Curso(titulo, desc, crypto.randomUUID(), cat, nivel, new Date().toISOString(), tAulas, tHoras);
            db.add('cursos', novoCurso);
            
            showToast('Cadastro do curso finalizado no banco local!');
            this.reset();
            renderCursos(document.getElementById('filterCategoria') ? document.getElementById('filterCategoria').value : "");
            
            const modalEl = document.getElementById('modalNovoCurso');
            const modal = bootstrap.Modal.getInstance(modalEl);
            if (modal) modal.hide();
        });
    }

    // Novo Módulo de Curso
    const formModulo = document.getElementById('formNovoModulo');
    if (formModulo) {
        formModulo.addEventListener('submit', function(e) {
            e.preventDefault();
            const idCurso = document.getElementById('cursoSelecionadoModulo').value;
            const titulo = document.getElementById('modTitulo').value.trim();
            const ordem = Number(document.getElementById('modOrdem').value);

            if(!idCurso) { showToast('Selecione primeiro um curso pai.', 'error'); return; }

            const modulo = new Modulo(idCurso, titulo, ordem);
            db.add('modulos', modulo);
            showToast('Módulo acrescentado no curso.');
            this.reset();
            atualizarSelectModulos(idCurso);
        });
    }

    // Nova Aula de Módulo
    const formAula = document.getElementById('formNovaAula');
    if (formAula) {
        formAula.addEventListener('submit', function(e) {
            e.preventDefault();
            const idModulo = document.getElementById('aulaModuloSelect').value;
            const titulo = document.getElementById('aulaTitulo').value.trim();
            const tipo = document.getElementById('aulaTipo').value;
            const url = document.getElementById('aulaUrl').value;
            const ordem = Number(document.getElementById('aulaOrdem').value);
            const min = Number(document.getElementById('aulaDuracao').value);

            if(!idModulo) { showToast('Nenhum módulo selecionado no destino.', 'error'); return; }

            const aula = new Aula(idModulo, titulo, tipo, url, min, ordem);
            db.add('aulas', aula);
            showToast('Aula validada e atrelada a hierarquia!');
            this.reset();
        });
    }

    // Modal de Submissão Financeira
    const formCheckout = document.getElementById('formFinalizarCheckout');
    if (formCheckout) {
        formCheckout.addEventListener('submit', function(e) {
            e.preventDefault();
            const idPlano = document.getElementById('checkoutIdPlanoInput').value;
            const plano = db.getById('planos', 'ID_Plano', idPlano);
            const metodo = document.getElementById('metodoPagamento').value;
            
            const start = new Date();
            const end = new Date();
            end.setMonth(start.getMonth() + plano.DuracaoMeses);
            
            const assinatura = new Assinatura(window.currentLoggedUser.ID_Usuario, plano.ID_Plano, start.toISOString(), end.toISOString());
            db.add('assinaturas', assinatura);
            
            const idTransacaoGerada = 'TX-' + crypto.randomUUID();
            const pag = new Pagamento(assinatura.ID_Assinatura, plano.Preco, start.toISOString(), metodo, idTransacaoGerada);
            db.add('pagamentos', pag);
            
            this.reset();
            
            // Controle dos Menus Suspensos Bootstrap
            const checkEl = document.getElementById('modalCheckout');
            const modaChecK = bootstrap.Modal.getInstance(checkEl);
            if (modaChecK) modaChecK.hide();

            document.getElementById('reciboIdTransacao').innerText = idTransacaoGerada;
            const mdRecibo = new bootstrap.Modal(document.getElementById('modalRecibo'));
            mdRecibo.show();
        });
    }
}

// ---- Event Delegation Central ----
function setupEventDelegation() {
    document.addEventListener('click', function(e) {
        // Excluir Curso
        if (e.target.closest('.btn-delete-curso')) {
            const btn = e.target.closest('.btn-delete-curso');
            const id = btn.getAttribute('data-id');
            const cursos = db.getAll('cursos');
            db.saveAll('cursos', cursos.filter(c => c.ID_Curso !== id));
            renderCursos(document.getElementById('filterCategoria') ? document.getElementById('filterCategoria').value : "");
            showToast('Item banido da base.', 'warning');
        }
        
        // Matricular
        if (e.target.closest('.btn-matricular')) {
            const btn = e.target.closest('.btn-matricular');
            const idCurso = btn.getAttribute('data-id');
            const matriculas = db.getAll('matriculas');
            
            if (matriculas.some(m => m.ID_Curso === idCurso && m.ID_Usuario === window.currentLoggedUser.ID_Usuario)) {
                showToast('Duplicação bloqueada: Cadastro já consta.', 'warning');
            } else {
                db.add('matriculas', new Matricula(window.currentLoggedUser.ID_Usuario, idCurso));
                showToast('Inscrição curricular formalizada!');
            }
        }
        
        // Marcar Aula como Concluída
        if (e.target.closest('.btn-concluir-aula')) {
            const btn = e.target.closest('.btn-concluir-aula');
            const idAula = btn.getAttribute('data-idaula');
            
            const prog = new Progresso_Aula(window.currentLoggedUser.ID_Usuario, idAula, new Date().toISOString(), 'Concluida');
            db.add('progressos', prog);
            showToast('Aula registrada na pauta de encerramento!');
            renderMinhasAulas();
        }
        
        // Emitir Certificado Redesenhado
        if (e.target.closest('.btn-emitir-certificado')) {
            const btn = e.target.closest('.btn-emitir-certificado');
            const idCurso = btn.getAttribute('data-idcurso');
            const cursoAtual = db.getById('cursos', 'ID_Curso', idCurso);
            
            const certStr = '#' + Math.random().toString(36).substr(2, 9).toUpperCase();
            db.add('certificados', new Certificado(window.currentLoggedUser.ID_Usuario, idCurso, null, certStr));
            
            // Popular o modal HTML visual e acionar
            document.getElementById('certNomeUsuario').innerText = window.currentLoggedUser.NomeCompleto.toUpperCase();
            document.getElementById('certCursoTitulo').innerText = cursoAtual.Titulo.toUpperCase();
            document.getElementById('certData').innerText = new Date().toLocaleDateString('pt-BR');
            document.getElementById('certCode').innerText = certStr;
            
            const certModal = new bootstrap.Modal(document.getElementById('modalCertificado'));
            certModal.show();
        }
        
        // Checkout Financeiro Substituto
        if (e.target.closest('.btn-checkout')) {
            const btn = e.target.closest('.btn-checkout');
            const idPlano = btn.getAttribute('data-id');
            const planoSelecionado = db.getById('planos', 'ID_Plano', idPlano);
            
            document.getElementById('checkoutPlanoNome').innerText = planoSelecionado.Nome;
            document.getElementById('checkoutPlanoPreco').innerText = 'R$ ' + planoSelecionado.Preco.toFixed(2);
            document.getElementById('checkoutIdPlanoInput').value = planoSelecionado.ID_Plano;

            const modalCk = new bootstrap.Modal(document.getElementById('modalCheckout'));
            modalCk.show();
        }
    });
}
