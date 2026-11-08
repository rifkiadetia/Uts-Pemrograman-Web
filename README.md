# Uts-Pemrograman-Web

# Rifki Bookhouse

Aplikasi web sederhana untuk pemesanan buku pada toko online. Dibuat sebagai **Tugas UTS Pemrograman Web 1**, dengan fokus pada sisi front-end (HTML, CSS, dan JavaScript). Tidak ada server atau database; semua data berasal dari variabel JavaScript pada `js/data.js`.

**Pembuat:** Rifki Ade Tia | **NIM:** 312510334 | **Kelas:** I253C

## Fitur

| Halaman | File | Fitur utama |
|---|---|---|
| Login | `index.html` | Validasi email dan password, alert jika salah, modal *Lupa Password* dan *Daftar* |
| Dashboard | `dashboard.html` | Greeting sesuai waktu lokal, menu navigasi, modal *History Transaksi* |
| Stok / Katalog | `stok.html` | Tabel dinamis dari `dataKatalogBuku`, tambah stok lewat DOM, pencarian, hapus, badge peringatan stok |
| Pemesanan | `checkout.html` | Keranjang yang bisa ditambah, diubah, dan dihapus, form pemesan dan pembayaran dengan validasi, nomor Delivery Order |
| Tracking | `tracking.html` | Cari nomor DO, tampil nama pemesan, progress bar status, ekspedisi, tanggal kirim, jenis paket, total pembayaran |

Fitur tambahan: proteksi halaman (wajib login), desain responsif, dan elemen semantik dengan atribut aksesibilitas dasar.

## Struktur Folder

```
tugas-uts-web1/
|-- index.html        (halaman login)
|-- dashboard.html
|-- stok.html
|-- tracking.html
|-- checkout.html
|-- css/
|   |-- style.css
|-- js/
|   |-- script.js     (logika semua halaman)
|   |-- data.js       (data dummy format array JSON)

## Cara Menjalankan

1. Unduh atau *clone* repositori ini.
2. Buka `index.html` di browser (klik dua kali, atau gunakan ekstensi Live Server di VS Code).
3. Login dengan akun demo di bawah.

## Akun Demo

| Email | Password |
|---|---|
| `rifki@ut.ac.id` | `utssmt3` |
| `rifkiade@ut.ac.id` | `uts2026` |

Nomor Delivery Order untuk mencoba tracking: `DO2026001`, `DO2026002`, `DO2026003`. Pesanan baru dari halaman pemesanan juga dapat dilacak.

## Catatan Teknis

- Data pesanan dan perubahan katalog disimpan di `sessionStorage`, sehingga hilang saat browser ditutup.
- Akun hasil pendaftaran disimpan di `localStorage` pada browser yang sama.
- Login ini hanya simulasi untuk tugas front-end; pada aplikasi sungguhan, verifikasi password dilakukan di server.

## Teknologi

HTML5, CSS3 (Flexbox, Grid, CSS variables), dan JavaScript (DOM, event, validasi form).
