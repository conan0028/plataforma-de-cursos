
export function renderTable(containerId, headers, dataRows, rowRenderer) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let thead = headers.map(h => `<th>${h}</th>`).join('');
    let tbody = dataRows.map(rowRenderer).join('');

    container.innerHTML = `
        <table class="table table-dark table-hover mb-0">
            <thead><tr>${thead}<th>Ações</th></tr></thead>
            <tbody>${tbody}</tbody>
        </table>
    `;
}

export function populateSelect(selectId, items, valueField, textField) {
    const select = document.getElementById(selectId);
    if (!select) return;
    select.innerHTML = '<option value="">Selecione...</option>' + 
        items.map(i => `<option value="${i[valueField]}">${i[textField]}</option>`).join('');
}

export function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toastWrapper');
    if (!toastContainer) return;
    
    const toastId = 'toast-' + Date.now();
    const bgClass = type === 'error' ? 'bg-danger' : (type === 'warning' ? 'bg-warning' : 'bg-success');
    
    const html = `
        <div id="${toastId}" class="toast align-items-center text-white ${bgClass} border-0 mb-2" role="alert" aria-live="assertive" aria-atomic="true">
          <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
        </div>
    `;
    toastContainer.insertAdjacentHTML('beforeend', html);
    
    // Instanciação JS obrigatória do Bootstrap
    const toastEl = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
    toast.show();
    
    toastEl.addEventListener('hidden.bs.toast', () => {
        toastEl.remove();
    });
}
