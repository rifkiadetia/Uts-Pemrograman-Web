// Data dummy (pengganti database) – format Array JSON
const dataPengguna = [
  { nama: "Rifki Ade Tia", email: "rifki@ut.ac.id", password: "utssmt3" },
  { nama: "Rifki Ade Tia", email: "rifkiade@ut.ac.id", password: "uts2026" }
];

const dataKatalogBuku = [
  { kode: "BK-001", judul: "Pemrograman Web Dasar", penulis: "Andi Wijaya", kategori: "Teknologi", harga: 85000, stok: 24 },
  { kode: "BK-002", judul: "Belajar JavaScript Modern", penulis: "Rina Pratama", kategori: "Teknologi", harga: 98000, stok: 15 },
  { kode: "BK-003", judul: "Desain Antarmuka yang Ramah", penulis: "Dimas Aryo", kategori: "Desain", harga: 110000, stok: 6 },
  { kode: "BK-004", judul: "Statistika untuk Pemula", penulis: "Lestari Ayu", kategori: "Sains", harga: 72000, stok: 32 },
  { kode: "BK-005", judul: "Manajemen Waktu Mahasiswa", penulis: "Hendra Putra", kategori: "Pengembangan Diri", harga: 65000, stok: 3 },
  { kode: "BK-006", judul: "Dasar-dasar Basis Data", penulis: "Maya Kusuma", kategori: "Teknologi", harga: 90000, stok: 18 }
];

const dataTracking = [
  { no: "DO2026001", nama: "Rifki Ade Tia", status: 4, ekspedisi: "JNE Reguler", tanggal: "2026-10-28", paket: "Paket Buku (2 item)", total: 183000 },
  { no: "DO2026002", nama: "Sari Dewi", status: 2, ekspedisi: "J&T Express", tanggal: "2026-11-05", paket: "Paket Buku (1 item)", total: 110000 },
  { no: "DO2026003", nama: "Andi Nugraha", status: 0, ekspedisi: "SiCepat", tanggal: "2026-11-07", paket: "Paket Buku (3 item)", total: 247000 }
];

const dataRiwayat = [
  { no: "DO2026001", tanggal: "2026-10-28", ringkasan: "Pemrograman Web Dasar, Belajar JavaScript Modern", total: 183000, status: "Terkirim" },
  { no: "DO2026002", tanggal: "2026-11-05", ringkasan: "Desain Antarmuka yang Ramah", total: 110000, status: "Dikirim" }
];

const tahapPengiriman = ["Pesanan diterima", "Dikemas", "Dikirim", "Dalam perjalanan", "Terkirim"];
const daftarEkspedisi = ["JNE Reguler", "J&T Express", "SiCepat", "Pos Indonesia"];
