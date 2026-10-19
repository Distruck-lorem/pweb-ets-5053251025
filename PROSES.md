# Proses Pengerjaan

1. Setup struktur dasar HTML & form switch (pemasukan vs pengeluaran di satu div/form).
2. Memisahkan Dompet Pribadi, Dompet Usaha, dan fitur Pindah Dana antar dompet dalam 1 file `index.html` (SPA) sesuai kartu persona (Persona 3 Pedagang Kecil).
3. Mengimpor font Poppins di `style.css` dan styling UI tema dark mode modern (navbar pill, card, form, button).
4. Implementasi form transaksi (W1): tanggal, jenis, kategori $\ge 4$ opsi, nominal, dan catatan opsional.
5. Memodifikasi input catatan: diletakkan di bawah dropdown kategori dan dibuat kondisional (hanya muncul saat memilih kategori "Lainnya").
6. Implementasi daftar transaksi (W2): render dinamis dari data JavaScript, transaksi terbaru berada di atas (`unshift`), dan nominal tampil dalam format mata uang Rupiah.
7. Implementasi fitur Hapus Transaksi (W3):
   - Menambahkan tombol hapus (`🗑️ Hapus`) di setiap baris riwayat transaksi.
   - Membuat popup modal konfirmasi custom modern (menggantikan `window.confirm` bawaan browser) dengan tombol Batal dan Hapus.
   - Menambahkan toast notification yang muncul otomatis setelah transaksi berhasil dihapus.
   - Mengembalikan saldo dompet (revert) secara otomatis saat transaksi dihapus.
8. Implementasi Persistensi Data (W4):
   - Menyimpan seluruh state transaksi, saldo, dan mutasi transfer ke `localStorage` browser.
   - Memastikan data tetap ada dan termuat kembali secara otomatis saat halaman di-refresh atau browser ditutup.
9. Implementasi Ringkasan Lengkap (W5):
   - Menambahkan card pill breakdown untuk Total Pemasukan/Omset dan Total Pengeluaran/Biaya di samping Total Saldo pada Dompet Pribadi dan Dompet Usaha.
   - Kalkulasi otomatis nilai total pemasukan dan total pengeluaran setiap kali transaksi ditambah, dihapus, atau dimutasi.
10. Implementasi Validasi Form di Layar (W6):
    - Validasi seluruh field wajib (tanggal, deskripsi, nominal > 0, dan catatan untuk kategori lainnya).
    - Menampilkan pesan error secara langsung di dalam elemen kotak alert merah (`.form-error-box`) pada halaman form, tanpa menggunakan alert browser bawaan (`alert()`).
    - Validasi kecukupan saldo ketika melakukan transaksi pengeluaran atau pemindahan dana antar dompet.
11. Implementasi Fitur Bonus Tambahan:
    - **Edit Transaksi**: Tombol `✏️ Edit` di setiap transaksi dengan modal popup untuk memperbarui data transaksi dan kalkulasi ulang saldo secara realtime.
    - **Filter & Live Search**: Kotak pencarian kata kunci pada deskripsi/catatan dan filter dropdown jenis transaksi (Semua, Pemasukan, Pengeluaran).
    - **Ekspor & Impor Data (Backup JSON)**: Fitur download file `dompetku_backup_*.json` dan upload restore data ke `localStorage`.
    - **Responsif Mobile (360px)**: Penyesuaian layout CSS media query agar tampilan tetap presisi, rapi, dan tidak overflow di layar ponsel selebar 360px.
12. Sinkronisasi Mutasi Transfer Dana ke Riwayat Dompet:
    - Menghubungkan fitur Pindah Dana (Persona 3) langsung ke riwayat transaksi Dompet Pribadi dan Usaha.
    - Saat transfer dilakukan dari Pribadi ke Usaha, otomatis tercatat transaksi pengeluaran di dompet Pribadi dan pemasukan modal di dompet Usaha secara real-time.
    - Dilengkapi `transferId` sehingga pembatalan transfer akan memulihkan saldo dan menghapus entri log terkait secara konsisten di kedua dompet.
