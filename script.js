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

// Displays (W5: Saldo & Ringkasan Pemasukan/Pengeluaran)
const saldoPribadiEl = document.getElementById('saldo-pribadi');
const saldoUsahaEl = document.getElementById('saldo-usaha');
const pemasukanPribadiEl = document.getElementById('pemasukan-pribadi');
const pengeluaranPribadiEl = document.getElementById('pengeluaran-pribadi');
const pemasukanUsahaEl = document.getElementById('pemasukan-usaha');
const pengeluaranUsahaEl = document.getElementById('pengeluaran-usaha');

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
// 3. RENDER UI, RINGKASAN (W5) & HISTORY
// ==========================================
function updateUI() {
    // W5: Hitung total pemasukan & total pengeluaran pribadi
    let totalMasukPribadi = 0;
    let totalKeluarPribadi = 0;
    state.historyPribadi.forEach(tx => {
        if (tx.tipe === 'pemasukan') totalMasukPribadi += tx.jumlah;
        else totalKeluarPribadi += tx.jumlah;
    });

    // W5: Hitung total pemasukan & total pengeluaran usaha
    let totalMasukUsaha = 0;
    let totalKeluarUsaha = 0;
    state.historyUsaha.forEach(tx => {
        if (tx.tipe === 'pemasukan') totalMasukUsaha += tx.jumlah;
        else totalKeluarUsaha += tx.jumlah;
    });

    // Update nominal saldo
    const saldoPribadiFormatted = formatRupiah(state.saldoPribadi);
    const saldoUsahaFormatted = formatRupiah(state.saldoUsaha);

    saldoPribadiEl.textContent = saldoPribadiFormatted;
    saldoUsahaEl.textContent = saldoUsahaFormatted;
    transferSaldoPribadiEl.textContent = saldoPribadiFormatted;
    transferSaldoUsahaEl.textContent = saldoUsahaFormatted;

    // Update teks ringkasan (W5)
    if (pemasukanPribadiEl) pemasukanPribadiEl.textContent = `+ ${formatRupiah(totalMasukPribadi)}`;
    if (pengeluaranPribadiEl) pengeluaranPribadiEl.textContent = `- ${formatRupiah(totalKeluarPribadi)}`;
    if (pemasukanUsahaEl) pemasukanUsahaEl.textContent = `+ ${formatRupiah(totalMasukUsaha)}`;
    if (pengeluaranUsahaEl) pengeluaranUsahaEl.textContent = `- ${formatRupiah(totalKeluarUsaha)}`;

    // Render Riwayat Pribadi
    renderHistory(historyPribadiList, state.historyPribadi, 'Belum ada transaksi pribadi.', 'pribadi');

    // Render Riwayat Usaha
    renderHistory(historyUsahaList, state.historyUsaha, 'Belum ada transaksi usaha.', 'usaha');

    // Render Riwayat Transfer
    renderTransferHistory();

    // Simpan ke localStorage (W4)
    saveState();
}

// Filter State
let filterState = {
    pribadi: { search: '', tipe: 'semua' },
    usaha: { search: '', tipe: 'semua' }
};

function renderHistory(element, list, emptyMessage, walletType) {
    if (!list) list = [];

    // Terapkan filter & search
    const filter = filterState[walletType] || { search: '', tipe: 'semua' };
    const filteredList = list.filter(item => {
        // Filter jenis/tipe
        if (filter.tipe !== 'semua' && item.tipe !== filter.tipe) return false;
        // Search kata kunci deskripsi, catatan, atau kategori
        if (filter.search) {
            const query = filter.search.toLowerCase();
            const descMatch = (item.deskripsi || '').toLowerCase().includes(query);
            const noteMatch = (item.catatan || '').toLowerCase().includes(query);
            const katMatch = (item.kategori || '').toLowerCase().includes(query);
            if (!descMatch && !noteMatch && !katMatch) return false;
        }
        return true;
    });

    if (filteredList.length === 0) {
        element.innerHTML = `<li class="empty-state">${filter.search || filter.tipe !== 'semua' ? 'Tidak ada transaksi yang cocok dengan filter.' : emptyMessage}</li>`;
        return;
    }

    element.innerHTML = filteredList.map(item => {
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
                    <div class="btn-action-group">
                        <button type="button" class="btn-edit" title="Edit transaksi" onclick="openEditModal('${walletType}', '${item.id}')">
                            ✏️ Edit
                        </button>
                        <button type="button" class="btn-delete" title="Hapus transaksi" onclick="deleteTransaction('${walletType}', '${item.id}')">
                            🗑️ Hapus
                        </button>
                    </div>
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

            // Hapus juga transaksi mutasi yang tercatat di kedua dompet
            state.historyPribadi = state.historyPribadi.filter(item => item.transferId !== transferId);
            state.historyUsaha = state.historyUsaha.filter(item => item.transferId !== transferId);
            state.historyTransfer = state.historyTransfer.filter(item => item.id !== transferId);

            updateUI();
            showToast('✅ Riwayat transfer berhasil dibatalkan dan disinkronkan.');
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
// 4. SUBMIT TRANSAKSI PRIBADI & USAHA (W6: VALIDASI DI HALAMAN)
// ==========================================
function setFormError(errorBox, message) {
    if (!errorBox) return;
    if (message) {
        errorBox.innerHTML = `⚠️ <strong>Gagal Menyimpan:</strong> ${message}`;
        errorBox.style.display = 'block';
    } else {
        errorBox.innerHTML = '';
        errorBox.style.display = 'none';
    }
}

function handleTransactionSubmit(form, walletType) {
    const errorBox = document.getElementById(`error-${walletType}`);

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        setFormError(errorBox, null);

        const tanggalInput = form.querySelector(`#tanggal-${walletType}`);
        const jumlahInput = form.querySelector(`#jumlah-${walletType}`);
        const deskripsiInput = form.querySelector(`#deskripsi-${walletType}`);
        const catatanInput = form.querySelector(`#catatan-${walletType}`);
        const kategoriSelect = form.querySelector(`#kategori-${walletType}`);
        const tipe = form.querySelector(`#tipe-${walletType}`).value;

        const tanggal = tanggalInput.value.trim();
        const jumlahVal = jumlahInput.value.trim();
        const jumlah = parseFloat(jumlahVal);
        const deskripsi = deskripsiInput.value.trim();
        const catatan = catatanInput ? catatanInput.value.trim() : '';
        const kategori = kategoriSelect.options[kategoriSelect.selectedIndex].text;

        // W6: Validasi field wajib terisi
        const errors = [];
        if (!tanggal) errors.push("Tanggal transaksi harus diisi.");
        if (!jumlahVal) {
            errors.push("Nominal transaksi harus diisi.");
        } else if (isNaN(jumlah) || jumlah <= 0) {
            errors.push("Nominal transaksi harus lebih dari 0.");
        }
        if (!deskripsi) errors.push("Deskripsi transaksi harus diisi.");

        // Jika memilih kategori 'lainnya', pastikan catatan terisi
        if (kategoriSelect.value === 'lainnya' && !catatan) {
            errors.push("Keterangan catatan wajib diisi untuk kategori 'Lainnya'.");
        }

        // Tampilkan pesan error jika ada field yang tidak valid
        if (errors.length > 0) {
            setFormError(errorBox, errors.join('<br>'));
            return;
        }

        // Cek kecukupan saldo jika pengeluaran
        if (tipe === 'pengeluaran') {
            const currentSaldo = walletType === 'pribadi' ? state.saldoPribadi : state.saldoUsaha;
            if (jumlah > currentSaldo) {
                setFormError(errorBox, `Saldo dompet ${walletType} tidak mencukupi (${formatRupiah(currentSaldo)}). Transaksi pengeluaran tidak dapat diproses.`);
                return;
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
        setFormError(errorBox, null);
        // Sembunyikan field catatan kembali
        const groupCatatan = document.getElementById(`group-catatan-${walletType}`);
        if (groupCatatan) groupCatatan.style.display = 'none';

        setDefaultDates();
        updateUI();
        showToast(`✅ ${tipe === 'pemasukan' ? 'Pemasukan' : 'Pengeluaran'} berhasil disimpan!`);
    });
}

handleTransactionSubmit(formPribadi, 'pribadi');
handleTransactionSubmit(formUsaha, 'usaha');

// ==========================================
// 5. PINDAH DANA (TRANSFER ANTAR DOMPET) (W6: VALIDASI DI HALAMAN)
// ==========================================
formTransfer.addEventListener('submit', (e) => {
    e.preventDefault();
    const errorTransferBox = document.getElementById('error-transfer');
    setFormError(errorTransferBox, null);

    const arah = document.getElementById('transfer-arah').value;
    const tanggal = document.getElementById('transfer-tanggal').value.trim();
    const jumlahVal = document.getElementById('transfer-jumlah').value.trim();
    const jumlah = parseFloat(jumlahVal);
    const catatan = document.getElementById('transfer-catatan').value.trim();

    const errors = [];
    if (!tanggal) errors.push("Tanggal transfer harus diisi.");
    if (!jumlahVal) {
        errors.push("Nominal transfer harus diisi.");
    } else if (isNaN(jumlah) || jumlah <= 0) {
        errors.push("Nominal transfer harus lebih besar dari 0.");
    }

    if (errors.length > 0) {
        setFormError(errorTransferBox, errors.join('<br>'));
        return;
    }

    const transferId = 'trf_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);

    if (arah === 'pribadi_ke_usaha') {
        if (jumlah > state.saldoPribadi) {
            setFormError(errorTransferBox, `Saldo Dompet Pribadi tidak mencukupi! (Tersedia: ${formatRupiah(state.saldoPribadi)})`);
            return;
        }
        state.saldoPribadi -= jumlah;
        state.saldoUsaha += jumlah;

        // Catat pengeluaran di Dompet Pribadi (Kirim Modal ke Usaha)
        state.historyPribadi.unshift({
            id: 'tx_out_' + transferId,
            transferId: transferId,
            tanggal,
            jumlah,
            deskripsi: 'Pindah Dana ke Usaha (Modal)',
            catatan: catatan ? `Catatan: ${catatan}` : 'Transfer internal ke dompet usaha',
            kategori: 'Transfer Keluar',
            tipe: 'pengeluaran'
        });

        // Catat pemasukan di Dompet Usaha (Terima Modal dari Pribadi)
        state.historyUsaha.unshift({
            id: 'tx_in_' + transferId,
            transferId: transferId,
            tanggal,
            jumlah,
            deskripsi: 'Terima Modal dari Pribadi',
            catatan: catatan ? `Catatan: ${catatan}` : 'Transfer internal dari dompet pribadi',
            kategori: 'Transfer Masuk',
            tipe: 'pemasukan'
        });
    } else {
        if (jumlah > state.saldoUsaha) {
            setFormError(errorTransferBox, `Saldo Dompet Usaha tidak mencukupi! (Tersedia: ${formatRupiah(state.saldoUsaha)})`);
            return;
        }
        state.saldoUsaha -= jumlah;
        state.saldoPribadi += jumlah;

        // Catat pengeluaran di Dompet Usaha (Tarik Prive ke Pribadi)
        state.historyUsaha.unshift({
            id: 'tx_out_' + transferId,
            transferId: transferId,
            tanggal,
            jumlah,
            deskripsi: 'Tarik Keuntungan / Prive ke Pribadi',
            catatan: catatan ? `Catatan: ${catatan}` : 'Prive keluar ke dompet pribadi',
            kategori: 'Transfer Keluar',
            tipe: 'pengeluaran'
        });

        // Catat pemasukan di Dompet Pribadi (Terima Keuntungan dari Usaha)
        state.historyPribadi.unshift({
            id: 'tx_in_' + transferId,
            transferId: transferId,
            tanggal,
            jumlah,
            deskripsi: 'Terima Hasil Usaha (Prive)',
            catatan: catatan ? `Catatan: ${catatan}` : 'Prive masuk dari hasil usaha',
            kategori: 'Transfer Masuk',
            tipe: 'pemasukan'
        });
    }

    // Catat juga ke log khusus Pindah Dana
    state.historyTransfer.unshift({
        id: transferId,
        arah,
        tanggal,
        jumlah,
        catatan
    });

    formTransfer.reset();
    setFormError(errorTransferBox, null);
    setDefaultDates();
    updateUI();
    showToast("✅ Dana berhasil dipindahkan dan dicatat ke kedua dompet!");
});

// ==========================================
// 6. BONUS: FITUR EDIT TRANSAKSI
// ==========================================
const editModal = document.getElementById('edit-modal');
const editForm = document.getElementById('edit-form');
const editCancelBtn = document.getElementById('edit-cancel-btn');
const errorEditBox = document.getElementById('error-edit');

window.openEditModal = function (walletType, txId) {
    const list = walletType === 'pribadi' ? state.historyPribadi : state.historyUsaha;
    const tx = list.find(item => item.id === txId);
    if (!tx) return;

    document.getElementById('edit-tx-id').value = tx.id;
    document.getElementById('edit-tx-wallet').value = walletType;
    document.getElementById('edit-tanggal').value = tx.tanggal;
    document.getElementById('edit-jumlah').value = tx.jumlah;
    document.getElementById('edit-deskripsi').value = tx.deskripsi;
    document.getElementById('edit-catatan').value = tx.catatan || '';
    setFormError(errorEditBox, null);

    editModal.style.display = 'flex';
};

function closeEditModal() {
    editModal.style.display = 'none';
    setFormError(errorEditBox, null);
}

if (editCancelBtn) editCancelBtn.addEventListener('click', closeEditModal);
if (editModal) {
    editModal.addEventListener('click', (e) => {
        if (e.target === editModal) closeEditModal();
    });
}

if (editForm) {
    editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const txId = document.getElementById('edit-tx-id').value;
        const walletType = document.getElementById('edit-tx-wallet').value;
        const tanggal = document.getElementById('edit-tanggal').value.trim();
        const jumlahVal = document.getElementById('edit-jumlah').value.trim();
        const jumlah = parseFloat(jumlahVal);
        const deskripsi = document.getElementById('edit-deskripsi').value.trim();
        const catatan = document.getElementById('edit-catatan').value.trim();

        if (!tanggal || !jumlahVal || !deskripsi) {
            setFormError(errorEditBox, "Semua field utama (tanggal, nominal, deskripsi) wajib diisi!");
            return;
        }
        if (isNaN(jumlah) || jumlah <= 0) {
            setFormError(errorEditBox, "Nominal harus lebih dari 0!");
            return;
        }

        const list = walletType === 'pribadi' ? state.historyPribadi : state.historyUsaha;
        const txIndex = list.findIndex(item => item.id === txId);
        if (txIndex === -1) return;

        const oldTx = list[txIndex];

        // Hitung ulang penyesuaian saldo
        const oldImpact = (oldTx.tipe === 'pemasukan' ? oldTx.jumlah : -oldTx.jumlah);
        const newImpact = (oldTx.tipe === 'pemasukan' ? jumlah : -jumlah);
        const netChange = newImpact - oldImpact;

        if (walletType === 'pribadi') {
            state.saldoPribadi += netChange;
            state.historyPribadi[txIndex] = { ...oldTx, tanggal, jumlah, deskripsi, catatan };
        } else {
            state.saldoUsaha += netChange;
            state.historyUsaha[txIndex] = { ...oldTx, tanggal, jumlah, deskripsi, catatan };
        }

        closeEditModal();
        updateUI();
        showToast("✅ Transaksi berhasil diperbarui!");
    });
}

// ==========================================
// 7. BONUS: FILTER & SEARCH LISTENERS
// ==========================================
function setupFilterListeners(walletType) {
    const searchInput = document.getElementById(`search-${walletType}`);
    const filterTipeSelect = document.getElementById(`filter-tipe-${walletType}`);

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            filterState[walletType].search = e.target.value.trim();
            const listEl = walletType === 'pribadi' ? historyPribadiList : historyUsahaList;
            const dataList = walletType === 'pribadi' ? state.historyPribadi : state.historyUsaha;
            renderHistory(listEl, dataList, `Belum ada transaksi ${walletType}.`, walletType);
        });
    }

    if (filterTipeSelect) {
        filterTipeSelect.addEventListener('change', (e) => {
            filterState[walletType].tipe = e.target.value;
            const listEl = walletType === 'pribadi' ? historyPribadiList : historyUsahaList;
            const dataList = walletType === 'pribadi' ? state.historyPribadi : state.historyUsaha;
            renderHistory(listEl, dataList, `Belum ada transaksi ${walletType}.`, walletType);
        });
    }
}

setupFilterListeners('pribadi');
setupFilterListeners('usaha');

// ==========================================
// 8. BONUS: EKSPOR & IMPOR DATA (BACKUP JSON)
// ==========================================
const btnExportJson = document.getElementById('btn-export-json');
const importFileInput = document.getElementById('import-file');

if (btnExportJson) {
    btnExportJson.addEventListener('click', () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `dompetku_backup_${new Date().toISOString().split('T')[0]}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        showToast("💾 Data berhasil diekspor ke file JSON!");
    });
}

if (importFileInput) {
    importFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (event) {
            try {
                const importedData = JSON.parse(event.target.result);
                if (typeof importedData.saldoPribadi === 'number' && Array.isArray(importedData.historyPribadi)) {
                    state = importedData;
                    saveState();
                    updateUI();
                    showToast("📥 Data berhasil dipulihkan dari file backup!");
                } else {
                    alert("Format file JSON tidak cocok untuk data Dompetku.");
                }
            } catch (err) {
                alert("Gagal membaca file JSON!");
            }
        };
        reader.readAsText(file);
        // Reset input file
        importFileInput.value = '';
    });
}

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
