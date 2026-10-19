# AI Assistance Log (AI-LOG)

Dokumentasi penggunaan kecerdasan buatan (AI) selama pengerjaan ETS Pemrograman Web.

---

## 1. HTML (`index.html`)

### Prompt & Kebutuhan:
1. *"html dulu, aku ingin dia bisa switch dua gitu, jadi bisa pemasukkan sama pengeluaran di div yang sama"*
2. *"aku pingin di satu index.html nanti bisa beda beda gitu tampilan untuk setiap pagenya (Persona 3: Pedagang Kecil - Dompet Pribadi, Dompet Usaha, dan Pindah Dana)"*
3. *"lengkapi w1 dan w3 dulu (catatan opsional)"*
4. *"edit untuk 'Catatan (Opsional)' muncul ketika kita memilih kategori lainnya, dan juga taruh posisinya dibawahnya dropdown kategori"*

### Solusi & Implementasi:
- **Arsitektur SPA (Single Page Application)**: Menyusun 3 section halaman dalam 1 file HTML (`#page-pribadi`, `#page-usaha`, dan `#page-transfer`) yang diatur navigasinya oleh tombol tab navbar (`.nav-tab`).
- **Form Switcher Terpadu (W1)**: Membuat form transaksi dengan switch tab (`data-type="pemasukan"` dan `data-type="pengeluaran"`) serta elemen `<input type="hidden" name="tipe">`.
- **Kategori Dinamis (W1)**: Mengelompokkan kategori menggunakan `<optgroup>` (minimal 4 kategori per tipe transaksi sesuai W1).
- **Field Catatan Dinamis (W1)**: Memposisikan wrapper `#group-catatan-*` tepat di bawah dropdown `#kategori-*` dengan default tersembunyi (`display: none;`).

---

## 2. CSS (`style.css`)

### Prompt & Kebutuhan:
1. *"importkan font poppins dong"*
2. *"buatkan UInya di style.css simpel saja, dan kalau bisa sesuaikan dengan dark modenya"*
3. Penyesuaian tema gradient background gelap (`#0d1527` ke `#18397a`).

### Solusi & Implementasi:
- **Typography**: Mengimpor Google Font Poppins (`weights: 300, 400, 500, 600, 700`) di baris paling atas stylesheet.
- **Dark Mode Design System**: Menggunakan CSS Variables (`:root`) untuk mengelola warna background (`#0c101d`), card semi-transparan (`rgba(22, 28, 48, 0.85)`), border lembut, serta warna aksen (biru, hijau saldo, kuning usaha, merah pengeluaran).
- **Komponen UI**:
  - Pill navigation bar yang melayang dan responsif.
  - Card transaksi dengan efek backdrop blur dan bayangan halus.
  - Form input modern dengan styling field gelap dan outline focus biru.
  - Tampilan daftar riwayat transaksi yang rapi dan terstruktur.

---

## 3. JavaScript (`script.js`)

### Prompt & Kebutuhan:
1. *"lanjutkan flownya di js"*
2. Solusi kebutuhan fungsional:
   - **W1 (Tambah Transaksi)**: Form transaksi lengkap (tanggal, jenis, kategori $\ge 4$ opsi, nominal, catatan opsional saat kategori "Lainnya").
   - **W2 (Daftar Transaksi)**: Render dinamis dari array state Javascript, transaksi terbaru selalu ditaruh di atas (`unshift`), pemformatan mata uang Rupiah (`Intl.NumberFormat`).
3. Menampilkan input catatan hanya ketika kategori *"Lainnya"* dipilih dan debugging kendala ReferenceError.

### Solusi & Implementasi:
- **Manajemen State (In-Memory)**: Mengelola saldo dan daftar riwayat untuk masing-masing dompet (`saldoPribadi`, `saldoUsaha`, `historyPribadi`, `historyUsaha`, dan `historyTransfer`) secara in-memory.
- **Navigasi Tab SPA & Form Switch**: Mengontrol visibility halaman section serta opsi kategori ketika user berpindah tab atau berpindah jenis transaksi.
- **Logika Pindah Dana Antar Dompet**: Mengakomodasi pemindahan dana Pribadi ➡️ Usaha (tambah modal) dan Usaha ➡️ Pribadi (prive) dengan kalkulasi saldo.
- **Toggle Catatan Kategori**: Menghubungkan event listener `change` pada dropdown kategori agar input catatan muncul hanya jika opsi `lainnya` aktif.
