# AI Assistance Log (AI-LOG)

Dokumentasi penggunaan kecerdasan buatan (AI) selama pengerjaan ETS Pemrograman Web.  
Format per entri: **Prompt yang dikirim**, **Bagian kode yang dipakai**, dan **Perubahan/perbaikan dari hasil AI**.

---

## 1. HTML (`index.html`)

### Entri 1.1: Switch Pemasukan & Pengeluaran dalam Satu Div
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

### Entri 1.3: Catatan Opsional Kondisional Kategori Lainnya & Modal Konfirmasi
- **Prompt**:
  > *"edit untuk 'Catatan (Opsional)' muncul ketika kita memilih kategori lainnya, dan juga taruh posisinya dibawahnya dropdown kategori"*  
  > *"edit notifikasi hapus jadi lebih bagus"*
- **Kode yang dipakai**:
  ```html
  <!-- Catatan kondisional di bawah kategori -->
  <div class="form-group" id="group-catatan-pribadi" style="display: none;">
      <label for="catatan-pribadi">Catatan Tambahan (Kategori Lainnya)</label>
      <input type="text" name="catatan" id="catatan-pribadi" placeholder="Tuliskan keterangan detail kategori lainnya...">
  </div>

  <!-- Modal Konfirmasi Hapus & Toast -->
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
  <div id="toast" class="toast"></div>
  ```
- **Perubahan / Perbaikan Manual**:
  - Menyesuaikan penempatan markup modal tepat sebelum penutup `</body>` agar z-index tidak terpotong kontainer lain.

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
      --accent-red: #ef4444;
      --input-bg: #141b2e;
      --radius: 12px;
  }
  ```
- **Perubahan / Perbaikan Manual**:
  - Mengubah gradient background body manual menjadi `linear-gradient(135deg, #0d1527 0%, #18397a 100%)`.

---

### Entri 2.2: Styling Tombol Hapus, Modal Dialog, & Toast
- **Prompt**:
  > *"edit notifikasi hapus jadi lebih bagus"*
- **Kode yang dipakai**:
  ```css
  .modal-overlay {
      position: fixed;
      top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(4, 7, 15, 0.75);
      backdrop-filter: blur(6px);
      display: flex; justify-content: center; align-items: center;
      z-index: 999;
  }

  .toast {
      position: fixed; bottom: 24px; left: 50%;
      transform: translateX(-50%) translateY(100px);
      background: #1e293b; color: #f1f5f9;
      padding: 12px 20px; border-radius: 30px;
      transition: all 0.3s ease;
  }
  .toast.show { transform: translateX(-50%) translateY(0); opacity: 1; }
  ```
- **Perubahan / Perbaikan Manual**:
  - Penambahan animasi keyframe `popUp` dan transisi tombol aksi agar interaksi terasa responsif.

---

## 3. JavaScript (`script.js`)

### Entri 3.1: Flow Transaksi, SPA Switcher & Format Rupiah
- **Prompt**:
  > *"lanjutkan flownya di js"*
- **Kode yang dipakai**:
  ```javascript
  function formatRupiah(number) {
      return new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
          maximumFractionDigits: 0
      }).format(number);
  }

  navTabs.forEach(tab => {
      tab.addEventListener('click', () => {
          navTabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          const targetPageId = tab.getAttribute('data-page');
          pageSections.forEach(section => {
              section.style.display = section.id === targetPageId ? 'block' : 'none';
          });
      });
  });
  ```
- **Perubahan / Perbaikan Manual**:
  - Menyesuaikan submit form dengan validasi saldo agar pengeluaran tidak melebihi saldo yang tersedia.

---

### Entri 3.2: Kategori Dinamis "Lainnya" & Penanganan Bug
- **Prompt**:
  > *"ini kenapa sekarang malah gabisa add saldo dan ketika di klik kategori lainnya tetap tidak muncul"*
- **Kode yang dipakai**:
  ```javascript
  const kategoriSelect = document.getElementById(`kategori-${walletType}`);
  const groupCatatan = document.getElementById(`group-catatan-${walletType}`);
  const inputCatatan = document.getElementById(`catatan-${walletType}`);

  function toggleCatatanField() {
      if (kategoriSelect.value === 'lainnya') {
          groupCatatan.style.display = 'block';
      } else {
          groupCatatan.style.display = 'none';
          inputCatatan.value = '';
      }
  }

  kategoriSelect.addEventListener('change', toggleCatatanField);
  ```
- **Perubahan / Perbaikan Manual**:
  - Memperbaiki deklarasi variabel `kategoriSelect` yang sebelumnya terpanggil sebelum dideklarasikan (mengatasi `ReferenceError`).

---

### Entri 3.3: Hapus Transaksi dengan Modal Custom & LocalStorage (W3 - W4)
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

  window.deleteTransaction = function (walletType, transactionId) {
      const list = walletType === 'pribadi' ? state.historyPribadi : state.historyUsaha;
      let targetIndex = list.findIndex(item => item.id === transactionId);
      if (targetIndex === -1) return;
      const targetTx = list[targetIndex];

      showDeleteModal('Hapus Transaksi?', `Yakin ingin menghapus <strong>"${escapeHtml(targetTx.deskripsi)}"</strong>?`, () => {
          if (walletType === 'pribadi') {
              state.saldoPribadi -= (targetTx.tipe === 'pemasukan' ? targetTx.jumlah : -targetTx.jumlah);
              state.historyPribadi.splice(targetIndex, 1);
          } else {
              state.saldoUsaha -= (targetTx.tipe === 'pemasukan' ? targetTx.jumlah : -targetTx.jumlah);
              state.historyUsaha.splice(targetIndex, 1);
          }
          updateUI();
          showToast('✅ Transaksi berhasil dihapus.');
      });
  };

  function saveState() {
      localStorage.setItem('dompetku_app_state', JSON.stringify(state));
  }
  ```
- **Perubahan / Perbaikan Manual**:
  - Menambahkan migrasi auto-assign ID di `loadState()` untuk menangani transaksi lama yang tersimpan tanpa ID di `localStorage`.
