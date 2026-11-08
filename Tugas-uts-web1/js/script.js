/* ===== Utilitas ===== */
const $ = (s, p = document) => p.querySelector(s);
const rp = n => "Rp" + Number(n).toLocaleString("id-ID");
const page = document.body.dataset.page;
const user = JSON.parse(sessionStorage.getItem("user") || "null");
const simpan = (k, v) => sessionStorage.setItem(k, JSON.stringify(v));
const ambil = (k, def) => JSON.parse(sessionStorage.getItem(k) || "null") || def;
const getKatalog = () => ambil("katalog", dataKatalogBuku.map(b => ({ ...b })));
const getPesanan = () => ambil("pesanan", []);
const semuaUser = () => [...dataPengguna, ...JSON.parse(localStorage.getItem("penggunaBaru") || "[]")];
const emailValid = e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
const tampilError = (el, pesan) => { el.textContent = pesan; };

if (page !== "login" && !user) location.href = "index.html"; // proteksi halaman

/* ===== Modal & logout (event delegation) ===== */
document.addEventListener("click", e => {
  const buka = e.target.closest("[data-open]");
  if (buka) $("#" + buka.dataset.open).classList.add("show");
  if (e.target.closest("[data-close]") || e.target.classList.contains("modal"))
    e.target.closest(".modal").classList.remove("show");
  if (e.target.id === "logout") { sessionStorage.clear(); location.href = "index.html"; }
});

/* ===== LOGIN ===== */
function initLogin() {
  $("#formLogin").addEventListener("submit", e => {
    e.preventDefault();
    const email = $("#email").value.trim(), pass = $("#password").value;
    if (!emailValid(email) || !pass) return tampilError($("#errLogin"), "Isi email yang valid dan password.");
    const cocok = semuaUser().find(u => u.email === email && u.password === pass);
    if (!cocok) { tampilError($("#errLogin"), ""); return alert("Email/password yang anda masukkan salah"); }
    simpan("user", cocok);
    location.href = "dashboard.html";
  });
  $("#formLupa").addEventListener("submit", e => {
    e.preventDefault();
    const em = $("#emailLupa").value.trim();
    if (!emailValid(em)) return tampilError($("#errLupa"), "Format email tidak valid.");
    if (!semuaUser().some(u => u.email === em)) return tampilError($("#errLupa"), "Email belum terdaftar.");
    alert("Tautan reset password telah dikirim ke " + em + " (simulasi).");
    e.target.reset(); tampilError($("#errLupa"), ""); $("#modalLupa").classList.remove("show");
  });
  $("#formDaftar").addEventListener("submit", e => {
    e.preventDefault();
    const nama = $("#namaDaftar").value.trim(), em = $("#emailDaftar").value.trim(), pw = $("#passDaftar").value;
    if (nama.length < 3) return tampilError($("#errDaftar"), "Nama minimal 3 karakter.");
    if (!emailValid(em)) return tampilError($("#errDaftar"), "Format email tidak valid.");
    if (pw.length < 6) return tampilError($("#errDaftar"), "Password minimal 6 karakter.");
    if (semuaUser().some(u => u.email === em)) return tampilError($("#errDaftar"), "Email sudah terdaftar.");
    const baru = JSON.parse(localStorage.getItem("penggunaBaru") || "[]");
    baru.push({ nama, email: em, password: pw });
    localStorage.setItem("penggunaBaru", JSON.stringify(baru));
    alert("Pendaftaran berhasil. Silakan login.");
    e.target.reset(); tampilError($("#errDaftar"), ""); $("#modalDaftar").classList.remove("show");
  });
}

/* ===== DASHBOARD ===== */
function initDashboard() {
  const jam = new Date().getHours();
  const sapa = jam < 11 ? "Selamat pagi" : jam < 15 ? "Selamat siang" : jam < 18 ? "Selamat sore" : "Selamat malam";
  $("#greeting").textContent = `${sapa}, ${user.nama}!`;
  $("#tanggal").textContent = new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const tbody = $("#tbRiwayat");
  [...dataRiwayat, ...getPesanan().map(p => ({ no: p.no, tanggal: p.tanggal, ringkasan: p.ringkasan, total: p.total, status: "Diproses" }))]
    .forEach(r => {
      const tr = document.createElement("tr");
      [r.no, r.tanggal, r.ringkasan, rp(r.total), r.status].forEach(t => {
        const td = document.createElement("td"); td.textContent = t; tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
}

/* ===== STOK / KATALOG ===== */
function initStok() {
  let katalog = getKatalog();
  const tbody = $("#tbStok");
  function render(filter = "") {
    tbody.innerHTML = "";
    katalog.filter(b => b.judul.toLowerCase().includes(filter.toLowerCase())).forEach(b => {
      const tr = document.createElement("tr");
      [b.kode, b.judul, b.penulis, b.kategori, rp(b.harga)].forEach(t => {
        const td = document.createElement("td"); td.textContent = t; tr.appendChild(td);
      });
      const tdS = document.createElement("td");
      const badge = document.createElement("span");
      badge.className = "badge " + (b.stok <= 5 ? "bahaya" : b.stok <= 10 ? "waspada" : "aman");
      badge.textContent = b.stok;
      tdS.appendChild(badge); tr.appendChild(tdS);
      const tdA = document.createElement("td");
      const hapus = document.createElement("button");
      hapus.className = "btn kecil ghost"; hapus.textContent = "Hapus";
      hapus.onclick = () => {
        if (!confirm(`Hapus "${b.judul}" dari katalog?`)) return;
        katalog = katalog.filter(x => x.kode !== b.kode); simpan("katalog", katalog); render($("#cari").value);
      };
      tdA.appendChild(hapus); tr.appendChild(tdA);
      tbody.appendChild(tr);
    });
    if (!tbody.children.length) tbody.innerHTML = '<tr><td colspan="7" class="kosong">Tidak ada buku yang cocok.</td></tr>';
    $("#totalJudul").textContent = katalog.length;
  }
  $("#cari").addEventListener("input", e => render(e.target.value));
  $("#formStok").addEventListener("submit", e => {
    e.preventDefault();
    const f = e.target;
    const b = { kode: f.kode.value.trim().toUpperCase(), judul: f.judul.value.trim(), penulis: f.penulis.value.trim(),
      kategori: f.kategori.value, harga: Number(f.harga.value), stok: Number(f.stok.value) };
    if (!b.kode || !b.judul || !b.penulis) return tampilError($("#errStok"), "Kode, judul, dan penulis wajib diisi.");
    if (katalog.some(x => x.kode === b.kode)) return tampilError($("#errStok"), "Kode buku sudah dipakai.");
    if (!(b.harga > 0) || !(b.stok >= 0) || !Number.isInteger(b.stok)) return tampilError($("#errStok"), "Harga harus > 0 dan stok bilangan bulat ≥ 0.");
    katalog.push(b); simpan("katalog", katalog);
    f.reset(); tampilError($("#errStok"), ""); render($("#cari").value);
    alert(`Buku "${b.judul}" berhasil ditambahkan.`);
  });
  render();
}

/* ===== CHECKOUT ===== */
function initCheckout() {
  const katalog = getKatalog();
  let keranjang = [];
  const pilih = $("#pilihBuku");
  katalog.forEach(b => pilih.add(new Option(`${b.judul} – ${rp(b.harga)} (stok ${b.stok})`, b.kode)));
  daftarEkspedisi.forEach(x => $("#ekspedisi").add(new Option(x, x)));

  function render() {
    const tbody = $("#tbKeranjang");
    tbody.innerHTML = "";
    keranjang.forEach(item => {
      const tr = document.createElement("tr");
      const td1 = document.createElement("td"); td1.textContent = item.judul;
      const td2 = document.createElement("td"); td2.textContent = rp(item.harga);
      const td3 = document.createElement("td");
      const qty = document.createElement("input");
      Object.assign(qty, { type: "number", min: 1, max: item.stokMax, value: item.qty });
      qty.className = "qty";
      qty.onchange = () => {
        const v = Number(qty.value);
        if (!Number.isInteger(v) || v < 1 || v > item.stokMax) { alert(`Jumlah harus 1–${item.stokMax}.`); qty.value = item.qty; return; }
        item.qty = v; render();
      };
      td3.appendChild(qty);
      const td4 = document.createElement("td"); td4.textContent = rp(item.harga * item.qty);
      const td5 = document.createElement("td");
      const hapus = document.createElement("button");
      hapus.className = "btn kecil ghost"; hapus.textContent = "Hapus"; hapus.type = "button";
      hapus.onclick = () => { keranjang = keranjang.filter(k => k.kode !== item.kode); render(); };
      td5.appendChild(hapus);
      [td1, td2, td3, td4, td5].forEach(td => tr.appendChild(td));
      tbody.appendChild(tr);
    });
    if (!keranjang.length) tbody.innerHTML = '<tr><td colspan="5" class="kosong">Keranjang masih kosong. Pilih buku di atas.</td></tr>';
    $("#totalBayar").textContent = rp(keranjang.reduce((s, k) => s + k.harga * k.qty, 0));
  }

  $("#btnTambah").addEventListener("click", () => {
    const b = katalog.find(x => x.kode === pilih.value);
    const qty = Number($("#jumlah").value);
    if (!b) return alert("Pilih buku terlebih dahulu.");
    if (!Number.isInteger(qty) || qty < 1) return alert("Jumlah minimal 1.");
    const ada = keranjang.find(k => k.kode === b.kode);
    const total = (ada ? ada.qty : 0) + qty;
    if (total > b.stok) return alert(`Stok "${b.judul}" hanya ${b.stok}.`);
    if (ada) ada.qty = total; else keranjang.push({ kode: b.kode, judul: b.judul, harga: b.harga, qty, stokMax: b.stok });
    render();
  });

  $("#formPesan").addEventListener("submit", e => {
    e.preventDefault();
    const f = e.target, err = $("#errPesan");
    if (!keranjang.length) return tampilError(err, "Tambahkan minimal satu buku ke keranjang.");
    if (f.nama.value.trim().length < 3) return tampilError(err, "Nama pemesan minimal 3 karakter.");
    if (!/^(\+62|62|0)8[0-9]{8,11}$/.test(f.telepon.value.trim())) return tampilError(err, "Nomor HP tidak valid (contoh: 081234567890).");
    if (f.alamat.value.trim().length < 10) return tampilError(err, "Alamat terlalu pendek (min. 10 karakter).");
    if (!f.bayar.value) return tampilError(err, "Pilih metode pembayaran.");
    const total = keranjang.reduce((s, k) => s + k.harga * k.qty, 0);
    const no = "DO2026" + String(Math.floor(100 + Math.random() * 900));
    const pesanan = getPesanan();
    pesanan.push({ no, nama: f.nama.value.trim(), status: 0, ekspedisi: f.ekspedisi.value,
      tanggal: new Date().toISOString().slice(0, 10), paket: `Paket Buku (${keranjang.length} item)`, total,
      ringkasan: keranjang.map(k => `${k.judul} x${k.qty}`).join(", ") });
    simpan("pesanan", pesanan);
    tampilError(err, "");
    $("#noDO").textContent = no;
    $("#modalSukses").classList.add("show");
    f.reset(); keranjang = []; render();
  });
  render();
}

/* ===== TRACKING ===== */
function initTracking() {
  $("#formTrack").addEventListener("submit", e => {
    e.preventDefault();
    const no = $("#noDo").value.trim().toUpperCase(), hasil = $("#hasil"), err = $("#errTrack");
    if (!no) return tampilError(err, "Masukkan nomor Delivery Order.");
    const d = [...dataTracking, ...getPesanan()].find(x => x.no === no);
    if (!d) { hasil.hidden = true; return tampilError(err, `Nomor ${no} tidak ditemukan. Coba DO2026001.`); }
    tampilError(err, "");
    $("#rNama").textContent = d.nama;
    $("#rStatus").textContent = tahapPengiriman[d.status];
    $("#bar").style.width = (d.status / (tahapPengiriman.length - 1)) * 100 + "%";
    $("#bar").className = d.status === 4 ? "selesai" : "";
    const ol = $("#tahap"); ol.innerHTML = "";
    tahapPengiriman.forEach((t, i) => {
      const li = document.createElement("li");
      li.textContent = t;
      if (i < d.status) li.className = "lewat"; else if (i === d.status) li.className = "aktif";
      ol.appendChild(li);
    });
    $("#rEkspedisi").textContent = d.ekspedisi;
    $("#rTanggal").textContent = new Date(d.tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
    $("#rPaket").textContent = d.paket;
    $("#rTotal").textContent = rp(d.total);
    hasil.hidden = false;
  });
}

({ login: initLogin, dashboard: initDashboard, stok: initStok, checkout: initCheckout, tracking: initTracking })[page]?.();
