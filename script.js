// ==========================================
// DATA STATE & LOCALSTORAGE (W4)
// ==========================================
let state = {
    saldoPribadi: 0,
    saldoUsaha: 0,
    historyPribadi: [],
    historyUsaha: [],
    historyTransfer: []
};

// Load saved data dari localStorage jika ada (W4)
function loadState() {
    const saved = localStorage.getItem('dompetku_app_state');
    if (saved) {
        try {
            state = JSON.parse(saved);

            // Pastikan item memiliki id unik agar aman saat dihapus (W3)
            const ensureIds = (list, prefix) => {
                if (!Array.isArray(list)) return [];
                return list.map((item, idx) => {
                    if (!item.id) {
                        item.id = `${prefix}_legacy_${idx}_${Date.now()}`;
                    }
                    return item;
                });
            };

            state.historyPribadi = ensureIds(state.historyPribadi, 'tx_pribadi');
            state.historyUsaha = ensureIds(state.historyUsaha, 'tx_usaha');
            state.historyTransfer = ensureIds(state.historyTransfer, 'trf');

            saveState();
        } catch (e) {
            console.error("Gagal membaca localStorage", e);
        }
    }
}

// Simpan state ke localStorage (W4)
function saveState() {
    localStorage.setItem('dompetku_app_state', JSON.stringify(state));
}

// Format mata uang Rupiah
function formatRupiah(number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0
    }).format(number);
}

// ==========================================
// DOM ELEMENTS
// ==========================================
// Navigation & Sections
const navTabs = document.querySelectorAll('.nav-tab');
const pageSections = document.querySelectorAll('.page-content');

// Displays
const saldoPribadiEl = document.getElementById('saldo-pribadi');
const saldoUsahaEl = document.getElementById('saldo-usaha');
const transferSaldoPribadiEl = document.getElementById('transfer-saldo-pribadi');
const transferSaldoUsahaEl = document.getElementById('transfer-saldo-usaha');

// History lists
const historyPribadiList = document.getElementById('history-pribadi');
const historyUsahaList = document.getElementById('history-usaha');
const historyTransferList = document.getElementById('history-transfer');

// Forms
const formPribadi = document.getElementById('form-pribadi');
const formUsaha = document.getElementById('form-usaha');
const formTransfer = document.getElementById('transfer-form');

// ==========================================
// 1. PAGE SWITCHING (SPA NAVIGATION)
// ==========================================
navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Hapus active di semua tab navigasi
        navTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const targetPageId = tab.getAttribute('data-page');

        // Sembunyikan semua halaman, tampilkan halaman terpilih
        pageSections.forEach(section => {
            if (section.id === targetPageId) {
                section.style.display = 'block';
                section.classList.add('active');
            } else {
                section.style.display = 'none';
                section.classList.remove('active');
            }
        });
    });
});

// ==========================================
// 2. TAB SWITCHER (PEMASUKAN / PENGELUARAN)
// ==========================================
function setupFormTabs(walletType) {
    const tabButtons = document.querySelectorAll(`.tab-btn[data-wallet="${walletType}"]`);
    const tipeInput = document.getElementById(`tipe-${walletType}`);
    const submitBtn = document.getElementById(`btn-submit-${walletType}`);
    const optMasuk = document.getElementById(`opt-masuk-${walletType}`);
    const optKeluar = document.getElementById(`opt-keluar-${walletType}`);
    const groupCatatan = document.getElementById(`group-catatan-${walletType}`);
    const inputCatatan = document.getElementById(`catatan-${walletType}`);
    const kategoriSelect = document.getElementById(`kategori-${walletType}`);

    // Fungsi toggle tampilan catatan jika kategori bernilai 'lainnya'
    function toggleCatatanField() {
        if (kategoriSelect.value === 'lainnya') {
            groupCatatan.style.display = 'block';
        } else {
            groupCatatan.style.display = 'none';
            inputCatatan.value = '';
        }
    }

    // Dengarkan saat user mengganti pilihan kategori
    kategoriSelect.addEventListener('change', toggleCatatanField);

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const type = btn.getAttribute('data-type');
            tipeInput.value = type;

            if (type === 'pemasukan') {
                optMasuk.style.display = 'block';
                optKeluar.style.display = 'none';
                kategoriSelect.value = optMasuk.querySelector('option').value;
                submitBtn.textContent = walletType === 'usaha' ? 'Simpan Pemasukan Usaha' : 'Simpan Pemasukan';
                submitBtn.style.background = 'var(--accent-blue)';
            } else {
                optMasuk.style.display = 'none';
                optKeluar.style.display = 'block';
                kategoriSelect.value = optKeluar.querySelector('option').value;
                submitBtn.textContent = walletType === 'usaha' ? 'Simpan Pengeluaran Usaha' : 'Simpan Pengeluaran';
                submitBtn.style.background = 'var(--accent-red)';
            }

            // Update kondisi catatan saat tab berganti
            toggleCatatanField();
        });
    });
}

setupFormTabs('pribadi');
setupFormTabs('usaha');

// ==========================================
// 3. RENDER UI & HISTORY
// ==========================================
function updateUI() {
    // Update nominal saldo
    const saldoPribadiFormatted = formatRupiah(state.saldoPribadi);
    const saldoUsahaFormatted = formatRupiah(state.saldoUsaha);

    saldoPribadiEl.textContent = saldoPribadiFormatted;
    saldoUsahaEl.textContent = saldoUsahaFormatted;
    transferSaldoPribadiEl.textContent = saldoPribadiFormatted;
    transferSaldoUsahaEl.textContent = saldoUsahaFormatted;

    // Render Riwayat Pribadi
    renderHistory(historyPribadiList, state.historyPribadi, 'Belum ada transaksi pribadi.', 'pribadi');

    // Render Riwayat Usaha
    renderHistory(historyUsahaList, state.historyUsaha, 'Belum ada transaksi usaha.', 'usaha');

    // Render Riwayat Transfer
    renderTransferHistory();

    // Simpan ke localStorage (W4)
    saveState();
}

function renderHistory(element, list, emptyMessage, walletType) {
    if (!list || list.length === 0) {
        element.innerHTML = `<li class="empty-state">${emptyMessage}</li>`;
        return;
    }

    element.innerHTML = list.map(item => {
        const isIncome = item.tipe === 'pemasukan';
        const colorClass = isIncome ? 'color: var(--accent-green);' : 'color: var(--accent-red);';
        const sign = isIncome ? '+' : '-';
        const catatanSnippet = item.catatan ? ` • <em>"${escapeHtml(item.catatan)}"</em>` : '';

        return `
            <li class="history-item">
                <div>
                    <strong>${escapeHtml(item.deskripsi)}</strong>
                    <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">
                        <span>📅 ${item.tanggal}</span> • <span>${escapeHtml(item.kategori)}</span>${catatanSnippet}
                    </div>
                </div>
                <div class="history-right">
                    <span style="font-weight: 600; font-size: 0.95rem; ${colorClass}">
                        ${sign} ${formatRupiah(item.jumlah)}
                    </span>
                    <button type="button" class="btn-delete" title="Hapus transaksi" onclick="deleteTransaction('${walletType}', '${item.id}')">
                        🗑️ Hapus
                    </button>
                </div>
            </li>
        `;
    }).join('');
}

// ==========================================
// CUSTOM CONFIRMATION MODAL & TOAST
// ==========================================
const deleteModal = document.getElementById('delete-modal');
const modalDesc = document.getElementById('modal-desc');
const modalConfirmBtn = document.getElementById('modal-confirm-btn');
const modalCancelBtn = document.getElementById('modal-cancel-btn');
const toastEl = document.getElementById('toast');

let activeConfirmCallback = null;

function showDeleteModal(title, description, onConfirm) {
    modalDesc.innerHTML = description;
    activeConfirmCallback = onConfirm;
    deleteModal.style.display = 'flex';
}

function hideDeleteModal() {
    deleteModal.style.display = 'none';
    activeConfirmCallback = null;
}

modalCancelBtn.addEventListener('click', hideDeleteModal);
deleteModal.addEventListener('click', (e) => {
    if (e.target === deleteModal) hideDeleteModal();
});

modalConfirmBtn.addEventListener('click', () => {
    if (typeof activeConfirmCallback === 'function') {
        activeConfirmCallback();
    }
    hideDeleteModal();
});

function showToast(message) {
    toastEl.innerHTML = message;
    toastEl.classList.add('show');
    setTimeout(() => {
        toastEl.classList.remove('show');
    }, 2800);
}

// Fungsi Hapus Transaksi (W3) dengan Modal Konfirmasi Modern
window.deleteTransaction = function (walletType, transactionId) {
    const list = walletType === 'pribadi' ? state.historyPribadi : state.historyUsaha;

    let targetIndex = list.findIndex(item => item.id === transactionId);
    if (targetIndex === -1 && (transactionId === 'undefined' || !transactionId)) {
        targetIndex = 0;
    }

    if (targetIndex === -1) return;

    const targetTx = list[targetIndex];

    showDeleteModal(
        'Hapus Transaksi?',
        `Yakin ingin menghapus transaksi <strong>"${escapeHtml(targetTx.deskripsi)}"</strong> senilai <strong>${formatRupiah(targetTx.jumlah)}</strong>?`,
        () => {
            // Kembalikan saldo (revert saldo)
            if (walletType === 'pribadi') {
                state.saldoPribadi -= (targetTx.tipe === 'pemasukan' ? targetTx.jumlah : -targetTx.jumlah);
                state.historyPribadi.splice(targetIndex, 1);
            } else {
                state.saldoUsaha -= (targetTx.tipe === 'pemasukan' ? targetTx.jumlah : -targetTx.jumlah);
                state.historyUsaha.splice(targetIndex, 1);
            }

            updateUI();
            showToast('✅ Transaksi berhasil dihapus.');
        }
    );
};

function renderTransferHistory() {
    if (!state.historyTransfer || state.historyTransfer.length === 0) {
        historyTransferList.innerHTML = `<li class="empty-state">Belum ada riwayat transfer.</li>`;
        return;
    }

    historyTransferList.innerHTML = state.historyTransfer.map(item => {
        const arahLabel = item.arah === 'pribadi_ke_usaha'
            ? 'Pribadi ➡️ Usaha (Modal)'
            : 'Usaha ➡️ Pribadi (Prive)';

        return `
            <li class="history-item">
                <div>
                    <strong>${arahLabel}</strong>
                    <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">
                        <span>📅 ${item.tanggal}</span> ${item.catatan ? `• ${escapeHtml(item.catatan)}` : ''}
                    </div>
                </div>
                <div class="history-right">
                    <span style="font-weight: 600; font-size: 0.95rem; color: var(--accent-amber);">
                        🔄 ${formatRupiah(item.jumlah)}
                    </span>
                    <button type="button" class="btn-delete" title="Hapus transfer" onclick="deleteTransfer('${item.id}')">
                        🗑️ Hapus
                    </button>
                </div>
            </li>
        `;
    }).join('');
}

window.deleteTransfer = function (transferId) {
    const targetTx = state.historyTransfer.find(item => item.id === transferId);
    if (!targetTx) return;

    showDeleteModal(
        'Batalkan Transfer?',
        `Yakin ingin membatalkan riwayat transfer senilai <strong>${formatRupiah(targetTx.jumlah)}</strong>?`,
        () => {
            // Balikkan saldo transfer
            if (targetTx.arah === 'pribadi_ke_usaha') {
                state.saldoPribadi += targetTx.jumlah;
                state.saldoUsaha -= targetTx.jumlah;
            } else {
                state.saldoUsaha += targetTx.jumlah;
                state.saldoPribadi -= targetTx.jumlah;
            }

            state.historyTransfer = state.historyTransfer.filter(item => item.id !== transferId);
            updateUI();
            showToast('✅ Riwayat transfer berhasil dibatalkan.');
        }
    );
};

function escapeHtml(text) {
    if (!text) return '';
    return text.replace(/[&<>"']/g, function (m) {
        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        }[m];
    });
}

// ==========================================
// 4. SUBMIT TRANSAKSI PRIBADI & USAHA
// ==========================================
function handleTransactionSubmit(form, walletType) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const tanggal = form.querySelector(`#tanggal-${walletType}`).value;
        const jumlah = parseFloat(form.querySelector(`#jumlah-${walletType}`).value) || 0;
        const deskripsi = form.querySelector(`#deskripsi-${walletType}`).value;
        const catatanInput = form.querySelector(`#catatan-${walletType}`);
        const catatan = catatanInput ? catatanInput.value.trim() : '';
        const kategoriSelect = form.querySelector(`#kategori-${walletType}`);
        const kategori = kategoriSelect.options[kategoriSelect.selectedIndex].text;
        const tipe = form.querySelector(`#tipe-${walletType}`).value;

        if (jumlah <= 0) {
            alert("Nominal harus lebih dari 0!");
            return;
        }

        // Cek saldo cukup saat pengeluaran
        if (tipe === 'pengeluaran') {
            const currentSaldo = walletType === 'pribadi' ? state.saldoPribadi : state.saldoUsaha;
            if (jumlah > currentSaldo) {
                const konfirmasi = confirm(`Saldo dompet ${walletType} Anda tidak mencukupi (${formatRupiah(currentSaldo)}). Tetap lanjutkan?`);
                if (!konfirmasi) return;
            }
        }

        const newTransaction = {
            id: 'tx_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
            tanggal,
            jumlah,
            deskripsi,
            catatan,
            kategori,
            tipe
        };

        // Update saldo
        if (walletType === 'pribadi') {
            state.saldoPribadi += (tipe === 'pemasukan' ? jumlah : -jumlah);
            state.historyPribadi.unshift(newTransaction);
        } else {
            state.saldoUsaha += (tipe === 'pemasukan' ? jumlah : -jumlah);
            state.historyUsaha.unshift(newTransaction);
        }

        form.reset();
        // Set tanggal default hari ini kembali
        setDefaultDates();
        updateUI();
    });
}

handleTransactionSubmit(formPribadi, 'pribadi');
handleTransactionSubmit(formUsaha, 'usaha');

// ==========================================
// 5. PINDAH DANA (TRANSFER ANTAR DOMPET)
// ==========================================
formTransfer.addEventListener('submit', (e) => {
    e.preventDefault();

    const arah = document.getElementById('transfer-arah').value;
    const tanggal = document.getElementById('transfer-tanggal').value;
    const jumlah = parseFloat(document.getElementById('transfer-jumlah').value) || 0;
    const catatan = document.getElementById('transfer-catatan').value.trim();

    if (jumlah <= 0) {
        alert("Nominal transfer harus lebih dari 0!");
        return;
    }

    if (arah === 'pribadi_ke_usaha') {
        if (jumlah > state.saldoPribadi) {
            alert(`Saldo Dompet Pribadi tidak mencukupi! (Tersedia: ${formatRupiah(state.saldoPribadi)})`);
            return;
        }
        state.saldoPribadi -= jumlah;
        state.saldoUsaha += jumlah;
    } else {
        if (jumlah > state.saldoUsaha) {
            alert(`Saldo Dompet Usaha tidak mencukupi! (Tersedia: ${formatRupiah(state.saldoUsaha)})`);
            return;
        }
        state.saldoUsaha -= jumlah;
        state.saldoPribadi += jumlah;
    }

    state.historyTransfer.unshift({
        id: 'trf_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        arah,
        tanggal,
        jumlah,
        catatan
    });

    formTransfer.reset();
    setDefaultDates();
    updateUI();
    alert("Dana berhasil dipindahkan!");
});

// ==========================================
// INITIAL SETUP
// ==========================================
function setDefaultDates() {
    const today = new Date().toISOString().split('T')[0];
    const datePribadi = document.getElementById('tanggal-pribadi');
    const dateUsaha = document.getElementById('tanggal-usaha');
    const dateTransfer = document.getElementById('transfer-tanggal');

    if (datePribadi && !datePribadi.value) datePribadi.value = today;
    if (dateUsaha && !dateUsaha.value) dateUsaha.value = today;
    if (dateTransfer && !dateTransfer.value) dateTransfer.value = today;
}

// Jalankan saat pertama kali dibuka
loadState();
setDefaultDates();
updateUI();
