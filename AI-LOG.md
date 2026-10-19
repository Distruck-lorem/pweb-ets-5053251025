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

### Entri 1.2: Arsitektur Multi-Halaman SPA (Persona 3 Pedagang Kecil)
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

### Entri 1.3: Catatan Opsional, Modal Konfirmasi, Ringkasan (W5), & Error Box (W6)
- **Prompt**:
  > *"edit untuk 'Catatan (Opsional)' muncul ketika kita memilih kategori lainnya, dan juga taruh posisinya dibawahnya dropdown kategori"*  
  > *"edit notifikasi hapus jadi lebih bagus"*  
  > *"tambahkan w5 dan w6"*
- **Kode yang dipakai**:
  ```html
  <!-- W5: Ringkasan Total Pemasukan & Pengeluaran -->
  <div class="summary-breakdown">
      <div class="summary-pill income-pill">
          <span class="pill-label">Total Pemasukan</span>
          <span id="pemasukan-pribadi" class="pill-value">+ Rp 0</span>
      </div>
      <div class="summary-pill expense-pill">
          <span class="pill-label">Total Pengeluaran</span>
          <span id="pengeluaran-pribadi" class="pill-value">- Rp 0</span>
      </div>
  </div>

  <!-- W6: Container Pesan Error Form di Layar -->
  <div id="error-pribadi" class="form-error-box" style="display: none;"></div>

  <!-- Modal Konfirmasi Hapus & Toast (W3) -->
  <div id="delete-modal" class="modal-overlay" style="display: none;">
      <div class="modal-content">
          <div class="modal-icon">🗑️</div>
          <h3>Hapus Transaksi?</h3>
          <p id="modal-desc" class="modal-text">Apakah Anda yakin?</p>
          <div class="modal-actions">
              <button type="button" id="modal-cancel-btn" class="btn-secondary">Batal</button>
              <button type="button" id="modal-confirm-btn" class="btn-danger">Hapus Data</button>
          </div>
      </div>
  </div>
  ```
- **Perubahan / Perbaikan Manual**:
  - Menambahkan atribut `novalidate` pada form agar validasi dilakukan secara konsisten oleh sistem JavaScript kita sendiri.

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

### Entri 2.2: Styling Modal Hapus, Toast, Summary Pills (W5), & Error Box (W6)
- **Prompt**:
  > *"edit notifikasi hapus jadi lebih bagus"*  
  > *"tambahkan w5 dan w6"*
- **Kode yang dipakai**:
  ```css
  /* W5: Summary Breakdown Pills */
  .summary-breakdown { display: flex; gap: 10px; width: 100%; }
  .summary-pill { flex: 1; background: var(--input-bg); border: 1px solid var(--card-border); padding: 10px 12px; border-radius: 8px; }
  .income-pill .pill-value { color: #34d399; }
  .expense-pill .pill-value { color: #f87171; }

  /* W6: Pesan Error di Form */
  .form-error-box {
      background: rgba(239, 68, 68, 0.15);
      border: 1px solid rgba(239, 68, 68, 0.4);
      color: #fca5a5;
      padding: 10px 14px;
      border-radius: 8px;
      font-size: 0.84rem;
      margin-bottom: 14px;
  }
  ```
- **Perubahan / Perbaikan Manual**:
  - Penambahan visual contrast warna teks merah lembut dan animasi `fadeIn` saat error muncul.

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
  // W5: Hitung total pemasukan & pengeluaran otomatis
  function updateUI() {
      let totalMasukPribadi = 0, totalKeluarPribadi = 0;
      state.historyPribadi.forEach(tx => {
          if (tx.tipe === 'pemasukan') totalMasukPribadi += tx.jumlah;
          else totalKeluarPribadi += tx.jumlah;
      });
      pemasukanPribadiEl.textContent = `+ ${formatRupiah(totalMasukPribadi)}`;
      pengeluaranPribadiEl.textContent = `- ${formatRupiah(totalKeluarPribadi)}`;
      // render UI dan simpan state
  }

  // W6: Validasi form di halaman tanpa alert()
  function setFormError(errorBox, message) {
      if (!errorBox) return;
      if (message) {
          errorBox.innerHTML = `⚠️ <strong>Gagal Menyimpan:</strong> ${message}`;
          errorBox.style.display = 'block';
      } else {
          errorBox.style.display = 'none';
      }
  }
  ```
- **Perubahan / Perbaikan Manual**:
  - Menghapus seluruh fungsi `alert()` bawaan pada validasi form dan menggantinya dengan tampilan error box inline di atas form transaksi.
