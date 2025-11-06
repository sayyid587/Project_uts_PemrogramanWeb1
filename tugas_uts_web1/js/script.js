document.addEventListener("DOMContentLoaded", () => {
  // Fungsi untuk mendapatkan data pengguna yang sedang login
  const getLoggedInUser = () => {
    const userString = sessionStorage.getItem("loggedInUser");
    if (!userString) return null;

    const loggedInEmail = JSON.parse(userString).email;
    const fullUser = dataPengguna.find((u) => u.email === loggedInEmail);
    return fullUser;
  };

  // Dark/Light Mode Toggle
  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    const savedTheme =
      localStorage.getItem("theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");
    if (savedTheme === "dark") {
      document.body.classList.add("dark-mode");
      themeToggle.checked = true;
    }

    themeToggle.addEventListener("change", () => {
      if (themeToggle.checked) {
        document.body.classList.add("dark-mode");
        localStorage.setItem("theme", "dark");
      } else {
        document.body.classList.remove("dark-mode");
        localStorage.setItem("theme", "light");
      }
    });
  }

  // --- Logika Halaman Login (index.html) ---
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const emailInput = document.getElementById("email").value;
      const passwordInput = document.getElementById("password").value;

      // dataPengguna berasal dari data.js
      const user = dataPengguna.find(
        (u) => u.email === emailInput && u.password === passwordInput
      );

      if (user) {
        // Simpan data pengguna dan ROLE ke sessionStorage
        sessionStorage.setItem(
          "loggedInUser",
          JSON.stringify({
            nama: user.nama,
            role: user.role,
            email: user.email, // Simpan email untuk lookup ID
          })
        );

        // Login Berhasil
        Swal.fire({
          icon: "success",
          title: `Selamat Datang, ${user.nama}!`,
          text: `Anda berhasil masuk sebagai ${user.role}.`,
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          window.location.href = "dashboard.html";
        });
      } else {
        // Login Gagal
        Swal.fire({
          icon: "error",
          title: "Login Gagal",
          text: "Email/password yang anda masukkan salah",
        });
      }
    });
  }

  // --- Logika Halaman Dashboard (dashboard.html) ---
  const greetingElement = document.getElementById("greeting");
  const menuGrid = document.getElementById("menuGrid");

  if (greetingElement) {
    const user = getLoggedInUser();
    // Cek jika user tidak ada (belum login), redirect ke login
    if (!user) {
      window.location.href = "index.html";
      return;
    }

    const userName = user ? user.nama.split(" ")[0] : "Pengguna";
    const userRole = user ? user.role : "Guest";

    const date = new Date();
    const hour = date.getHours();
    let greetingText = "";

    if (hour >= 4 && hour < 12) {
      greetingText = "Selamat Pagi";
    } else if (hour >= 12 && hour < 16) {
      greetingText = "Selamat Siang";
    } else if (hour >= 16 && hour < 20) {
      greetingText = "Selamat Sore";
    } else {
      greetingText = "Selamat Malam";
    }

    greetingElement.textContent = `${greetingText}, ${userName}! (${userRole})`;

    // Menyiapkan Menu yang sama untuk Admin dan User (History Transaksi)
    if (menuGrid) {
      // Menu WAJIB: History Transaksi (Sekarang untuk Admin dan User)
      const historyMenu = `
                <a href="history.html" class="menu-item glass-card">
                    <h2>📜</h2>
                    <h3>History Transaksi</h3>
                    <p>${
                      userRole === "Admin"
                        ? "Lihat semua riwayat transaksi pengguna."
                        : "Lihat riwayat transaksi Anda sendiri."
                    }</p>
                </a>
            `;
      // Sisipkan setelah Tracking, sebelum Laporan (jika ada)
      menuGrid.insertAdjacentHTML("beforeend", historyMenu);

      // Menu EKSKLUSIF ADMIN: Laporan Pemesanan
      if (userRole === "Admin") {
        const adminMenus = `
                    <a href="laporan.html" class="menu-item glass-card">
                        <h2>📊</h2>
                        <h3>Laporan Pemesanan (Admin)</h3>
                        <p>Ringkasan data pemesanan bulanan/tahunan.</p>
                    </a>
                `;
        menuGrid.insertAdjacentHTML("beforeend", adminMenus);
      }
    }
  }

  // --- Logika Halaman Katalog/Stok (stok.html) ---
  const katalogGrid = document.getElementById("katalogGrid");
  const tambahStokForm = document.getElementById("tambahStokForm");
  const adminFeature = document.getElementById("adminFeature");

  if (adminFeature) {
    const user = getLoggedInUser();
    // Sembunyikan form tambah stok jika bukan Admin
    if (!user || user.role !== "Admin") {
      adminFeature.style.display = "none";
    }
  }

  function renderKatalog() {
    if (!katalogGrid) return;
    katalogGrid.innerHTML = "";

    dataKatalogBuku.forEach((buku) => {
      const cardHTML = `
                <div class="buku-card glass-card">
                    <div class="buku-info">
                        <img src="${buku.cover}" alt="Cover ${buku.namaBarang}" class="buku-cover">
                        <h3>${buku.namaBarang}</h3>
                        <div class="buku-detail">
                            <p><strong>Kode:</strong> ${buku.kodeBarang}</p>
                            <p><strong>Jenis:</strong> ${buku.jenisBarang}</p>
                            <p><strong>Edisi:</strong> ${buku.edisi}</p>
                            <p><strong>Stok Tersedia:</strong> ${buku.stok}</p>
                        </div>
                    </div>
                    <div class="buku-action">
                        <p class="buku-price">${buku.harga}</p>
                        <button class="btn btn-primary" style="width: 100%;" onclick="pilihBuku('${buku.namaBarang}', '${buku.harga}')">Pilih & Beli</button>
                    </div>
                </div>
            `;
      katalogGrid.insertAdjacentHTML("beforeend", cardHTML);
    });
  }

  if (katalogGrid) {
    renderKatalog();

    if (tambahStokForm) {
      tambahStokForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const kode = document.getElementById("kodeBarang").value;
        const nama = document.getElementById("namaBarang").value;
        const stok = parseInt(document.getElementById("stokBaru").value);
        const harga = document.getElementById("hargaBaru").value;
        const jenis = document.getElementById("jenisBarang").value;
        const edisi = document.getElementById("edisi").value;

        if (!kode || !nama || isNaN(stok) || !harga) {
          Swal.fire(
            "Validasi",
            "Mohon isi semua data dengan benar!",
            "warning"
          );
          return;
        }

        const newBook = {
          kodeBarang: kode,
          namaBarang: nama,
          jenisBarang: jenis,
          edisi: edisi,
          stok: stok,
          harga: harga,
          cover: "img/default_cover.png",
        };

        dataKatalogBuku.push(newBook);

        renderKatalog();

        tambahStokForm.reset();

        Swal.fire(
          "Berhasil!",
          "Stok buku baru telah ditambahkan secara dinamis.",
          "success"
        );
      });
    }
  }

  window.pilihBuku = function (nama, harga) {
    Swal.fire({
      icon: "info",
      title: "Konfirmasi Pemilihan",
      html: `Anda memilih buku: <strong>${nama}</strong> dengan harga <strong>${harga}</strong>.`,
      showCancelButton: true,
      confirmButtonText: "Lanjutkan ke Checkout",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = "checkout.html";
      }
    });
  };

  // --- Logika Halaman Tracking (tracking.html) ---
  const trackingForm = document.getElementById("trackingForm");
  const trackingResult = document.getElementById("trackingResult");

  if (trackingForm) {
    // Cek URL untuk nomor DO
    const urlParams = new URLSearchParams(window.location.search);
    const doParam = urlParams.get("do");
    if (doParam) {
      document.getElementById("nomorDO").value = doParam;
      // Jalankan pencarian otomatis jika ada parameter
      const trackingData = dataTracking[doParam];
      if (trackingData) {
        trackingResult.innerHTML = renderTracking(trackingData);
        trackingResult.style.display = "block";
      }
    }

    trackingForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const nomorDO = document.getElementById("nomorDO").value;

      const trackingData = dataTracking[nomorDO];

      if (trackingData) {
        trackingResult.innerHTML = renderTracking(trackingData);
        trackingResult.style.display = "block";
      } else {
        trackingResult.style.display = "none";
        Swal.fire(
          "Pencarian Gagal",
          `Nomor DO: ${nomorDO} tidak ditemukan.`,
          "error"
        );
      }
    });
  }

  function renderTracking(data) {
    let progress = 0;
    if (data.status === "Selesai") {
      progress = 100;
    } else if (data.status === "Dikirim") {
      progress = 80;
    } else if (data.status === "Dalam Perjalanan") {
      progress = 60;
    } else {
      progress = 20;
    }

    const journeyList = data.perjalanan
      .reverse()
      .map(
        (step) => `
            <div class="tracking-step">
                <p><strong>${step.waktu}</strong></p>
                <p>${step.keterangan}</p>
            </div>
        `
      )
      .join("");

    return `
            <div class="glass-card mt-20">
                <h3>📦 Detail Pengiriman</h3>
                <p><strong>Nama Pemesan:</strong> ${data.nama}</p>
                <p><strong>Nomor DO:</strong> ${data.nomorDO}</p>
                <p><strong>Status:</strong> <span style="font-weight: bold; color: ${
                  progress === 100
                    ? "var(--primary-color)"
                    : "var(--secondary-color)"
                }">${data.status}</span></p>

                <div class="progress-container">
                    <div class="progress-bar" style="width: ${progress}%;"></div>
                </div>

                <div class="tracking-details mt-20">
                    <h4>Informasi Ekspedisi</h4>
                    <p><strong>Ekspedisi:</strong> ${data.ekspedisi}</p>
                    <p><strong>Tanggal Kirim:</strong> ${data.tanggalKirim}</p>
                    <p><strong>Jenis Paket:</strong> ${data.paket}</p>
                    <p><strong>Total Pembayaran:</strong> ${data.total}</p>
                </div>

                <div class="tracking-journey mt-20">
                    <h4>Riwayat Perjalanan</h4>
                    ${journeyList}
                </div>
            </div>
        `;
  }

  // --- Logika Halaman Checkout (checkout.html) ---
  const checkoutForm = document.getElementById("checkoutForm");
  if (checkoutForm) {
    checkoutForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const requiredFields = ["namaPenerima", "alamat", "metodePembayaran"];
      let isValid = true;
      requiredFields.forEach((id) => {
        if (!document.getElementById(id).value) {
          isValid = false;
        }
      });

      if (!isValid) {
        Swal.fire("Validasi", "Mohon lengkapi semua data pemesan!", "warning");
        return;
      }

      Swal.fire({
        icon: "success",
        title: "Pemesanan Berhasil!",
        text: "Pesanan Anda telah kami proses. Silakan cek status pengiriman di halaman Tracking.",
      }).then(() => {
        checkoutForm.reset();
      });
    });
  }

  // ----------------------------------------------------------------------
  // --- Logika Halaman History Transaksi (history.html) ---
  // ----------------------------------------------------------------------
  const historyBody = document.getElementById("historyBody");

  if (historyBody) {
    const user = getLoggedInUser();
    // Cek login
    if (!user) {
      window.location.href = "index.html";
      return;
    }

    const userId = user.id;
    const role = user.role;

    const historyRoleText = document.getElementById("historyRoleText");
    const historyTitle = document.getElementById("historyTitle");

    if (role === "Admin") {
      historyTitle.textContent = "📜 History Transaksi";
      historyRoleText.textContent =
        "Menampilkan riwayat transaksi dari semua pengguna sistem.";
      renderHistory(null); // Kirim null untuk tampilkan semua
    } else {
      historyTitle.textContent = "📜 History Transaksi Anda";
      historyRoleText.textContent = `Menampilkan riwayat transaksi Anda, ${user.nama}.`;
      renderHistory(userId); // Kirim userId untuk filter
    }
  }

  function getStatusBadge(status) {
    let className = "status-warning";
    if (status === "Selesai") {
      className = "status-success";
    } else if (status === "Dibatalkan") {
      className = "status-danger";
    }
    return `<span class="status-badge ${className}">${status}</span>`;
  }

  // Fungsi helper untuk mendapatkan nama pengguna dari ID
  function getUserNameById(id) {
    const user = dataPengguna.find((u) => u.id === id);
    return user ? user.nama : "Unknown User";
  }

  // Fungsi render history yang kini menerima filter userId (atau null untuk semua)
  function renderHistory(currentUserId) {
    if (!historyBody) return;
    historyBody.innerHTML = "";

    let filteredHistory;

    if (currentUserId === null) {
      // Admin: Tampilkan SEMUA data history
      filteredHistory = dataHistoryTransaksi;
    } else {
      // User: HANYA tampilkan history milik user yang sedang login
      filteredHistory = dataHistoryTransaksi.filter(
        (trx) => trx.userId === currentUserId
      );
    }

    if (filteredHistory.length === 0) {
      historyBody.innerHTML =
        '<tr><td colspan="7" class="text-center">Belum ada riwayat transaksi.</td></tr>';
      return;
    }

    filteredHistory.forEach((trx, index) => {
      const row = historyBody.insertRow();

      // Tambahkan kolom Nama Pengguna jika diakses oleh Admin
      const userNameCell =
        currentUserId === null ? `<td>${getUserNameById(trx.userId)}</td>` : "";

      row.innerHTML = `
                <td>${index + 1}</td>
                ${userNameCell} 
                <td>${trx.tanggal}</td>
                <td><a href="tracking.html?do=${
                  trx.nomorDO
                }" style="color: var(--secondary-color); font-weight: 600;">${
        trx.nomorDO
      }</a></td>
                <td>${trx.namaBuku}</td>
                <td>${trx.total}</td>
                <td>${getStatusBadge(trx.status)}</td>
            `;
    });

    // Perbaiki header tabel (history.html) jika ini admin
    const tableHead = document.querySelector("#historyTable thead tr");
    if (tableHead) {
      if (currentUserId === null) {
        // Pastikan kolom "Pengguna" ada di header Admin
        if (!tableHead.querySelector(".user-header")) {
          const newTh = document.createElement("th");
          newTh.textContent = "Pengguna";
          newTh.classList.add("user-header");
          // Sisipkan setelah No.
          tableHead.insertBefore(newTh, tableHead.children[1]);
        }
      } else {
        // Hapus kolom "Pengguna" dari header User
        const userHeader = tableHead.querySelector(".user-header");
        if (userHeader) {
          userHeader.remove();
        }
      }
    }
  }

  // ----------------------------------------------------------------------
  // --- Logika Halaman Laporan Pemesanan (laporan.html) - ADMIN ONLY ---
  // ----------------------------------------------------------------------
  const laporanRingkasan = document.getElementById("laporanRingkasan");
  const bukuTerlarisList = document.getElementById("bukuTerlarisList");

  if (laporanRingkasan) {
    const user = getLoggedInUser();
    const role = user ? user.role : "Guest";

    // Cek Login
    if (!user) {
      window.location.href = "index.html";
      return;
    }

    // Pembatasan akses Admin
    if (role !== "Admin") {
      Swal.fire({
        icon: "error",
        title: "Akses Ditolak",
        text: "Halaman Laporan Pemesanan hanya dapat diakses oleh Admin.",
      }).then(() => {
        window.location.href = "dashboard.html";
      });
      return;
    }

    renderLaporan(dataLaporan);
  }

  function renderLaporan(data) {
    if (!laporanRingkasan || !bukuTerlarisList) return;

    // 1. Render Ringkasan Utama
    const ringkasanHTML = `
            <div class="summary-card glass-card">
                <p>Periode:</p>
                <h4>${data.bulan}</h4>
            </div>
            <div class="summary-card glass-card">
                <p>Total Transaksi:</p>
                <h1 style="color: var(--secondary-color);">${data.totalTransaksi}</h1>
            </div>
            <div class="summary-card glass-card">
                <p>Total Pendapatan Kotor:</p>
                <h4 style="color: var(--primary-color);">${data.totalPendapatan}</h4>
            </div>
        `;
    laporanRingkasan.innerHTML = ringkasanHTML;

    // 2. Render Buku Terlaris
    bukuTerlarisList.innerHTML = "";
    data.bukuTerlaris.forEach((buku, index) => {
      const listItem = document.createElement("li");
      listItem.innerHTML = `
                <span>${index + 1}. ${buku.nama}</span>
                <span style="font-weight: 700;">${buku.terjual} terjual</span>
            `;
      bukuTerlarisList.appendChild(listItem);
    });
  }
});
