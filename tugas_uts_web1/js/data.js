// Data Pengguna
var dataPengguna = [
  {
    id: 1,
    nama: "Rina Wulandari",
    email: "rina@gmail.com",
    password: "rina123",
    role: "User",
  },
  {
    id: 2,
    nama: "Agus Pranoto",
    email: "agus@gmail.com",
    password: "agus123",
    role: "User",
  },
  {
    id: 3,
    nama: "Sayyid Sulthan Abyan",
    email: "byan@gmail.com",
    password: "byan123",
    role: "Admin",
  },
];

// Data Katalog Buku
var dataKatalogBuku = [
  {
    kodeBarang: "ASIP4301",
    namaBarang: "Pengantar Ilmu Komunikasi",
    jenisBarang: "Buku Ajar",
    edisi: "2",
    stok: 548,
    harga: "Rp 180.000",
    cover: "img/pengantar_komunikasi.jpg",
  },
  {
    kodeBarang: "EKMA4002",
    namaBarang: "Manajemen Keuangan",
    jenisBarang: "Buku Ajar",
    edisi: "3",
    stok: 392,
    harga: "Rp 220.000",
    cover: "img/manajemen_keuangan.jpg",
  },
  {
    kodeBarang: "EKMA4310",
    namaBarang: "Kepemimpinan",
    jenisBarang: "Buku Ajar",
    edisi: "1",
    stok: 278,
    harga: "Rp 150.000",
    cover: "img/kepemimpinan.jpg",
  },
  {
    kodeBarang: "BIOL4211",
    namaBarang: "Mikrobiologi Dasar",
    jenisBarang: "Buku Ajar",
    edisi: "2",
    stok: 165,
    harga: "Rp 200.000",
    cover: "img/mikrobiologi.jpg",
  },
  {
    kodeBarang: "PAUD4401",
    namaBarang: "Perkembangan Anak Usia Dini",
    jenisBarang: "Buku Ajar",
    edisi: "4",
    stok: 204,
    harga: "Rp 250.000",
    cover: "img/paud_perkembangan.jpg",
  },
];

// Data Tracking
var dataTracking = {
  20230012: {
    nomorDO: "20230012",
    nama: "Rina Wulandari",
    status: "Selesai",
    ekspedisi: "JNE",
    tanggalKirim: "2025-08-20",
    paket: "YES",
    total: "Rp 320.000",
    perjalanan: [
      {
        waktu: "2025-08-22 10:12:20",
        keterangan: "Paket telah diterima. (Jakarta Selatan)",
      },
      {
        waktu: "2025-08-22 08:00:00",
        keterangan: "Kurir sedang dalam perjalanan menuju alamat Anda.",
      },
      {
        waktu: "2025-08-21 14:07:56",
        keterangan: "Tiba di Hub: JAKARTA SELATAN",
      },
      {
        waktu: "2025-08-20 18:30:15",
        keterangan: "Paket diserahkan ke kurir pengiriman.",
      },
    ],
  },
  20230013: {
    nomorDO: "20230013",
    nama: "Agus Pranoto",
    status: "Dikirim",
    ekspedisi: "Pos Indonesia",
    tanggalKirim: "2025-08-25",
    paket: "REG",
    total: "Rp 220.000",
    perjalanan: [
      {
        waktu: "2025-08-26 09:00:00",
        keterangan: "Telah diterima di Kantor Pos tujuan: Bandung.",
      },
      {
        waktu: "2025-08-25 18:00:00",
        keterangan: "Paket dalam proses transit dari Jakarta ke Bandung.",
      },
      {
        waktu: "2025-08-25 10:12:20",
        keterangan:
          "Penerimaan di Loket: TANGERANG SELATAN. Pengirim: Universitas Terbuka",
      },
    ],
  },
};

// Data History Transaksi
var dataHistoryTransaksi = [
  {
    tanggal: "2025-09-01",
    nomorDO: "20250045",
    namaBuku: "Pengantar Ilmu Komunikasi (2x)",
    total: "Rp 360.000",
    status: "Dikirim",
    userId: 1, // Milik Rina Wulandari (USER)
  },
  {
    tanggal: "2025-08-28",
    nomorDO: "20250044",
    namaBuku: "Manajemen Keuangan (1x)",
    total: "Rp 220.000",
    status: "Dibatalkan",
    userId: 2, // Milik Agus Pranoto (USER)
  },
  {
    tanggal: "2025-08-25",
    nomorDO: "20230013",
    namaBuku: "Akuntansi Biaya (1x), Matematika Dasar (1x)",
    total: "Rp 400.000",
    status: "Selesai",
    userId: 1, // Milik Rina Wulandari (USER)
  },
  {
    tanggal: "2025-08-20",
    nomorDO: "20230012",
    namaBuku: "Manajemen Pemasaran (2x)",
    total: "Rp 320.000",
    status: "Selesai",
    userId: 3, // Milik Siti Marlina (ADMIN)
  },
  {
    tanggal: "2025-08-15",
    nomorDO: "20250040",
    namaBuku: "Pendidikan Agama Islam (1x)",
    total: "Rp 150.000",
    status: "Dikirim",
    userId: 2, // Milik Agus Pranoto (USER)
  },
];

// Data untuk Laporan Pemesanan (Admin Only)
var dataLaporan = {
  bulan: "September 2025",
  totalTransaksi: 85,
  totalPendapatan: "Rp 45.650.000",
  bukuTerlaris: [
    { nama: "Pengantar Ilmu Komunikasi", terjual: 210 },
    { nama: "Manajemen Keuangan", terjual: 180 },
    { nama: "Akuntansi Biaya", terjual: 140 },
  ],
};
