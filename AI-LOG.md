# AI Assistance Log (AI-LOG)

Dokumentasi penggunaan kecerdasan buatan (AI) selama pengerjaan ETS Pemrograman Web.  
Format per entri: **Prompt yang dikirim**, **Bagian kode yang dipakai**, dan **Perubahan/perbaikan dari hasil AI**.

---

## 1. HTML (`index.html`)

### Entri 1.1: Switch Pemasukan & Pengeluaran dalam Satu Div (W1)
- **Prompt**:
  > *"html dulu, aku ingin dia bisa switch dua gitu, jadi bisa pemasukkan sama pngeluraan di div yang sama"*
- **Kode yang dipakai**:
  ```html
  <div class="form-tabs">
      <button type="button" class="tab-btn active" data-type="pemasukan" id="tab-pemasukan">Pemasukan</button>
      <button type="button" class="tab-btn" data-type="pengeluaran" id="tab-pengeluaran">Pengeluaran</button>
  </div>
  <form id="transaction-form">
      <input type="hidden" name="tipe" id="tipe" value="pemasukan">
      <!-- input form -->
  </form>
  ```
- **Perubahan / Perbaikan Manual**:
  - Tombol submit dipindahkan ke dalam tag `<form>` agar form submit bekerja secara semantik.
  - Ditambahkan input nominal dan pengelompokan kategori `<optgroup>`.

---

### Entri 1.2: Arsitektur Multi-Halaman SPA (Fitur Khas Persona 3)
- **Prompt**:
  > *"aku pingin di satu index.html nanti bisa beda beda gitu tampilan untuk setiap pagenya"*
- **Kode yang dipakai**:
  ```html
  <nav class="navbar">
      <ul class="nav-links">
          <li><button type="button" class="nav-tab active" data-page="page-pribadi">Dompet Pribadi</button></li>
          <li><button type="button" class="nav-tab" data-page="page-usaha">Dompet Usaha</button></li>
          <li><button type="button" class="nav-tab" data-page="page-transfer">Pindah Dana</button></li>
      </ul>
  </nav>

  <main>
      <section id="page-pribadi" class="page-content active">...</section>
      <section id="page-usaha" class="page-content" style="display: none;">...</section>
      <section id="page-transfer" class="page-content" style="display: none;">...</section>
  </main>
  ```
- **Perubahan / Perbaikan Manual**:
  - Menghapus logo header duplikat agar layout navbar tetap minimalis.
  - Memisahkan opsi kategori dompet pribadi vs kebutuhan operasional dompet usaha.

---

### Entri 1.3: Catatan Opsional, Modal Konfirmasi, Ringkasan (W5), Error Box (W6), & Bonus Fitur
- **Prompt**:
  > *"edit untuk 'Catatan (Opsional)' muncul ketika kita memilih kategori lainnya, dan juga taruh posisinya dibawahnya dropdown kategori"*  
  > *"edit notifikasi hapus jadi lebih bagus"*  
  > *"tambahkan w5 dan w6"*  
  > *"okei gas (menambahkan fitur bonus)"*
- **Kode yang dipakai**:
  ```html
  <!-- Tombol Ekspor & Impor Backup JSON di Navbar -->
  <div class="backup-actions">
      <button type="button" id="btn-export-json" class="btn-tool">💾 Ekspor</button>
      <label for="import-file" class="btn-tool">📥 Impor</label>
      <input type="file" id="import-file" accept=".json" style="display: none;">
  </div>

  <!-- Filter & Search Bar di Riwayat -->
  <div class="filter-bar">
      <input type="text" id="search-pribadi" class="filter-input search-box" placeholder="🔍 Cari deskripsi / catatan...">
      <select id="filter-tipe-pribadi" class="filter-input">
          <option value="semua">Semua Jenis</option>
          <option value="pemasukan">Hanya Pemasukan</option>
          <option value="pengeluaran">Hanya Pengeluaran</option>
      </select>
  </div>

  <!-- Modal Edit Transaksi -->
  <div id="edit-modal" class="modal-overlay" style="display: none;">
      <div class="modal-content edit-modal-content">
          <h3>✏️ Edit Transaksi</h3>
          <form id="edit-form" novalidate>...</form>
      </div>
  </div>
  ```
- **Perubahan / Perbaikan Manual**:
  - Menggabungkan elemen toolbar backup dan filter search agar terintegrasi mulus tanpa menambah file HTML baru.

---

## 2. CSS (`style.css`)

### Entri 2.1: Import Font Poppins & Dark Mode
- **Prompt**:
  > *"importkan font poppins dong"*  
  > *"buatkan UInya di style.css simpel saja, dan kalau bisa sesuaikan dengan dark modenya"*
- **Kode yang dipakai**:
  ```css
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

  :root {
      --bg-main: #0c101d;
      --card-bg: rgba(22, 28, 48, 0.85);
      --card-border: rgba(255, 255, 255, 0.08);
      --text-primary: #f0f4fc;
      --text-muted: #94a3b8;
      --accent-blue: #3b82f6;
      --accent-green: #10b981;
      --accent-amber: #f59e0b;
      --accent-red: #ef4444;
      --input-bg: #141b2e;
      --radius: 12px;
  }
  ```
- **Perubahan / Perbaikan Manual**:
  - Mengubah gradient background body manual menjadi `linear-gradient(135deg, #0d1527 0%, #18397a 100%)`.

---

### Entri 2.2: Styling Modal Hapus, Toast, Summary Pills (W5), Error Box (W6), & Responsif 360px
- **Prompt**:
  > *"edit notifikasi hapus jadi lebih bagus"*  
  > *"tambahkan w5 dan w6"*  
  > *"okei gas (menambahkan fitur bonus)"*
- **Kode yang dipakai**:
  ```css
  /* Tombol Aksi Transaksi */
  .btn-action-group { display: flex; gap: 6px; }
  .btn-edit { background: transparent; border: 1px solid rgba(59, 130, 246, 0.3); color: #60a5fa; cursor: pointer; padding: 5px 8px; border-radius: 6px; font-size: 0.78rem; }
  .btn-delete { background: transparent; border: 1px solid rgba(239, 68, 68, 0.3); color: #f87171; cursor: pointer; padding: 5px 8px; border-radius: 6px; font-size: 0.78rem; }

  /* Responsif Layar HP 360px */
  @media (max-width: 480px) {
      body { padding: 14px 10px; }
      .navbar { justify-content: center; }
      .nav-links { width: 100%; justify-content: center; gap: 4px; padding: 4px; }
      .nav-tab { padding: 6px 10px; font-size: 0.8rem; }
      .summary-breakdown { flex-direction: column; gap: 6px; }
      .history-item { flex-direction: column; align-items: flex-start; gap: 10px; }
      .history-right { width: 100%; justify-content: space-between; }
      .filter-bar { flex-direction: column; }
  }
  ```
- **Perubahan / Perbaikan Manual**:
  - Memastikan seluruh padding dan flex-wrap diatur dengan aman agar tidak ada elemen yang meluber (overflow horizontal) di layar kecil.

---

## 3. JavaScript (`script.js`)

### Entri 3.1: Flow Transaksi, SPA Switcher & Format Rupiah (W1 & W2)
- **Prompt**:
  > *"lanjutkan flownya di js"*
- **Kode yang dipakai**:
  ```javascript
  function formatRupiah(number) {
      return new Intl.NumberFormat('id-ID', {
          style: 'currency', currency: 'IDR', maximumFractionDigits: 0
      }).format(number);
  }
  ```
- **Perubahan / Perbaikan Manual**:
  - Perbaikan urutan inisialisasi dropdown kategori agar tidak terjadi `ReferenceError` saat memasang event listener.

---

### Entri 3.2: Modal Konfirmasi Hapus & LocalStorage (W3 & W4)
- **Prompt**:
  > *"lengkapi w1 dan w3 dulu"*  
  > *"edit notifikasi hapus jadi lebih bagus"*
- **Kode yang dipakai**:
  ```javascript
  function showDeleteModal(title, description, onConfirm) {
      modalDesc.innerHTML = description;
      activeConfirmCallback = onConfirm;
      deleteModal.style.display = 'flex';
  }

  function saveState() {
      localStorage.setItem('dompetku_app_state', JSON.stringify(state));
  }
  ```
- **Perubahan / Perbaikan Manual**:
  - Menambahkan generator id unik transaksi (`tx_...`) dan fallback migrasi otomatis data lama di `loadState()`.

---

### Entri 3.3: Kalkulasi Ringkasan (W5) & Validasi Form di Layar (W6)
- **Prompt**:
  > *"tambahkan w5 dan w6"*
- **Kode yang dipakai**:
  ```javascript
  function updateUI() {
      let totalMasukPribadi = 0, totalKeluarPribadi = 0;
      state.historyPribadi.forEach(tx => {
          if (tx.tipe === 'pemasukan') totalMasukPribadi += tx.jumlah;
          else totalKeluarPribadi += tx.jumlah;
      });
      pemasukanPribadiEl.textContent = `+ ${formatRupiah(totalMasukPribadi)}`;
      pengeluaranPribadiEl.textContent = `- ${formatRupiah(totalKeluarPribadi)}`;
  }
  ```
- **Perubahan / Perbaikan Manual**:
  - Menghapus seluruh fungsi `alert()` bawaan pada validasi form dan menggantinya dengan tampilan error box inline di atas form transaksi.

---

### Entri 3.4: Fitur Bonus (Edit Transaksi, Filter & Live Search, Ekspor/Impor JSON)
- **Prompt**:
  > *"okei gas (menambahkan fitur bonus)"*
- **Kode yang dipakai**:
  ```javascript
  // Edit Transaksi & Perhitungan Ulang Saldo
  window.openEditModal = function (walletType, txId) { ... };
  editForm.addEventListener('submit', (e) => {
      // Kalkulasi netChange saldo dan update objek transaksi
  });

  // Filter & Live Search
  searchInput.addEventListener('input', (e) => {
      filterState[walletType].search = e.target.value.trim();
      renderHistory(...);
  });

  // Ekspor & Impor Backup JSON
  btnExportJson.addEventListener('click', () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
      ...
  });
  ```
- **Perubahan / Perbaikan Manual**:
  - Memastikan fitur ekspor menghasilkan file format JSON standar yang dapat diimpor kembali ke `localStorage` tanpa merusak relasi data dompet.

---

### Entri 3.5: Sinkronisasi Pindah Dana ke Riwayat Transaksi Masing-Masing Dompet
- **Prompt**:
  > *"ketika melakukan pindah dana, tambahin juga di riwayat transaksi tiap card, misal dari pribadi -> usaha, berarti di pribadi nanti ada lognya juga"*
- **Kode yang dipakai**:
  ```javascript
  // Pada formTransfer submit handler:
  if (arah === 'pribadi_ke_usaha') {
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
  }
  ```
- **Perubahan / Perbaikan Manual**:
  - Menghubungkan mutasi transfer menggunakan relasi `transferId` unik, sehingga saat transaksi transfer dibatalkan/dihapus, catatan mutasi di kedua dompet otomatis ikut terhapus dan saldo masing-masing dompet dipulihkan (reverted) secara tepat.
