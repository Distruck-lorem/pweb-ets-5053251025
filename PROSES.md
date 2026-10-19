# Proses Pengerjaan

1. Setup struktur dasar HTML & form switch (pemasukan vs pengeluaran di satu div/form).
2. Memisahkan Dompet Pribadi, Dompet Usaha, dan fitur Pindah Dana antar dompet dalam 1 file `index.html` (SPA).
3. Mengimpor font Poppins di `style.css` dan styling UI tema dark mode modern (navbar pill, card, form, button).
4. Implementasi form transaksi (W1): tanggal, jenis, kategori $\ge 4$ opsi, nominal, dan catatan opsional.
5. Memodifikasi input catatan: diletakkan di bawah dropdown kategori dan dibuat kondisional (hanya muncul saat memilih kategori "Lainnya").
6. Implementasi daftar transaksi (W2): render dinamis dari data JavaScript, transaksi terbaru berada di atas (`unshift`), dan nominal tampil dalam format mata uang Rupiah.
