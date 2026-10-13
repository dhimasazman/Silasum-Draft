// URL Web App Google Apps Script
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxHjU1itJjBNQJQPlNUEAaM85Lcf8pFcMlvJd6MZowix2zNNPgC3njbrxyIakTl-7BT/exec";

document.addEventListener("DOMContentLoaded", () => {
  // Set tanggal hari ini secara otomatis
  const today = new Date();
  document.getElementById("tanggal").valueAsDate = today;

  // Navigasi Tab
  initTabs();

  // Listener input untuk update otomatis ke infografis & indikator ringkasan
  document.getElementById("wbpForm").addEventListener("input", updateInfographicValues);

  // Listener Tombol
  document.getElementById("btnSave").addEventListener("click", handleSaveToSpreadsheet);
  document.getElementById("btnDownload").addEventListener("click", handleDownloadImage);

  // Inisialisasi perhitungan awal
  updateInfographicValues();

  // Register PWA Service Worker jika didukung
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js")
      .then(reg => console.log("Service Worker terdaftar:", reg))
      .catch(err => console.error("Gagal mendaftarkan Service Worker:", err));
  }
});

// Sistem Navigasi Tab
function initTabs() {
  const tabs = document.querySelectorAll(".tab-btn");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));

      tab.classList.add("active");
      const targetId = tab.getAttribute("data-tab");
      document.getElementById(targetId).classList.add("active");
    });
  });
}

// Format Tanggal Bahasa Indonesia
function formatDateIndonesian(dateString) {
  if (!dateString) return "-";
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: '2-digit' };
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', options);
}

// Toast Notifikasi Sederhana
function showToast(message, type = "info") {
  const toast = document.getElementById("toast");
  toast.innerText = message;
  toast.style.borderColor = type === "error" ? "#ef4444" : type === "success" ? "#22c55e" : "#3b82f6";
  toast.style.display = "block";

  setTimeout(() => {
    toast.style.display = "none";
  }, 3500);
}

// Update Nilai Infografis & Ringkasan Stats
function updateInfographicValues() {
  let totalRegA = 0;
  document.querySelectorAll(".regA").forEach(el => totalRegA += Number(el.value || 0));
  
  let totalRegB = 0;
  document.querySelectorAll(".regB").forEach(el => totalRegB += Number(el.value || 0));

  const mappings = [
    { in: "kapasitas", out: "out-kapasitas", suffix: " Orang" },
    { in: "jumlahPenghuni", out: "out-jumlahPenghuni", suffix: " Orang" },
    { in: "diDalamLapas", out: "out-diDalamLapas", suffix: " Orang" },
    { in: "diLuarLapas", out: "out-diLuarLapas", suffix: " Orang" },
    { in: "regAI", out: "out-regAI" },
    { in: "regAII", out: "out-regAII" },
    { in: "regAIII", out: "out-regAIII" },
    { in: "regAIV", out: "out-regAIV" },
    { in: "regAV", out: "out-regAV" },
    { in: "regBI", out: "out-regBI" },
    { in: "regBIIa", out: "out-regBIIa" },
    { in: "regBIIb", out: "out-regBIIb" },
    { in: "regBIII", out: "out-regBIII" },
    { in: "jkLaki", out: "out-jkLaki" },
    { in: "jkPerempuan", out: "out-jkPerempuan" },
    { in: "napiLaki", out: "out-napiLaki" },
    { in: "napiPerempuan", out: "out-napiPerempuan" },
    { in: "tahananLaki", out: "out-tahananLaki" },
    { in: "tahananPerempuan", out: "out-tahananPerempuan" },
    { in: "ketTeroris", out: "out-ketTeroris" },
    { in: "ketNarkoba", out: "out-ketNarkoba" },
    { in: "ketPsikotropika", out: "out-ketPsikotropika" },
    { in: "ketKesehatan", out: "out-ketKesehatan" },
    { in: "ketKorupsi", out: "out-ketKorupsi" },
    { in: "ketPidum", out: "out-ketPidum" },
    { in: "ketIlegalLogging", out: "out-ketIlegalLogging" },
    { in: "ketHumanTrafficking", out: "out-ketHumanTrafficking" },
    { in: "ketPidanaMati", out: "out-ketPidanaMati" },
    { in: "ketPidanaSH", out: "out-ketPidanaSH" },
    { in: "bonSakit", out: "out-bonSakit" },
    { in: "bonKejaksaan", out: "out-bonKejaksaan" },
    { in: "bonLain", out: "out-bonLain" },
    { in: "m13", out: "out-m13" },
    { in: "m12", out: "out-m12" },
    { in: "m23", out: "out-m23" },
    { in: "kewarganegaraanWni", out: "out-kewarganegaraanWni" },
    { in: "kewarganegaraanWna", out: "out-kewarganegaraanWna" },
    { in: "residivis", out: "out-residivis" }
  ];

  const rawDate = document.getElementById("tanggal").value;
  document.getElementById("out-tanggal").innerText = formatDateIndonesian(rawDate);

  mappings.forEach(item => {
    const inputEl = document.getElementById(item.in);
    const outEl = document.getElementById(item.out);
    if (inputEl && outEl) {
      outEl.innerText = inputEl.value || 0;
    }
  });

  document.getElementById("out-totalRegA").innerText = totalRegA;
  document.getElementById("out-totalRegB").innerText = totalRegB;

  // Update Ringkasan Stat Atas
  const kap = Number(document.getElementById("kapasitas").value || 1);
  const penghuni = Number(document.getElementById("jumlahPenghuni").value || 0);
  const persen = Math.round((penghuni / kap) * 100);

  document.getElementById("card-kapasitas").innerText = kap;
  document.getElementById("card-penghuni").innerText = penghuni;
  document.getElementById("card-persen").innerText = persen + "%";

  const badge = document.getElementById("card-status-badge");
  if (persen > 100) {
    badge.innerText = "Overkapasitas";
    badge.style.color = "#dc2626";
  } else if (persen >= 85) {
    badge.innerText = "Waspada";
    badge.style.color = "#d97706";
  } else {
    badge.innerText = "Normal";
    badge.style.color = "#16a34a";
  }
}

// Simpan ke Spreadsheet
// SIMPAN KE SPREADSHEET (INTERAKTIF)
async function handleSaveToSpreadsheet() {
  const btn = document.getElementById("btnSave");
  const icon = btn.querySelector(".btn-icon");
  const text = btn.querySelector(".btn-text");

  // State: Loading
  btn.disabled = true;
  icon.innerHTML = '<span class="spinner"></span>';
  text.innerText = "Menyimpan Data...";

  try {
    const inputs = document.querySelectorAll("input");
    const formData = {};
    inputs.forEach(input => {
      formData[input.id] = input.value || 0;
    });

    await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });

    // State: Sukses Berhasil
    btn.classList.add("btn-state-success");
    icon.innerText = "✓";
    text.innerText = "Berhasil Disimpan!";
    showToast("✅ Data berhasil dikirim ke Google Spreadsheet!", "success");

  } catch (err) {
    showToast("❌ Gagal menyimpan data: " + err.message, "error");
  } finally {
    // Kembalikan ke state semula setelah 2.5 detik
    setTimeout(() => {
      btn.disabled = false;
      btn.classList.remove("btn-state-success");
      icon.innerText = "💾";
      text.innerText = "Simpan ke Spreadsheet";
    }, 2500);
  }
}

// UNDUH GAMBAR INFOGRAFIS (INTERAKTIF)
async function handleDownloadImage() {
  const btn = document.getElementById("btnDownload");
  const icon = btn.querySelector(".btn-icon");
  const text = btn.querySelector(".btn-text");

  // State: Loading
  btn.disabled = true;
  icon.innerHTML = '<span class="spinner"></span>';
  text.innerText = "Memproses Gambar...";

  try {
    updateInfographicValues();

    const captureArea = document.getElementById("capture-area");
    
    // Pastikan semua gambar selesai dimuat
    const images = captureArea.getElementsByTagName("img");
    for (let img of images) {
      if (!img.complete) {
        await new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
        });
      }
    }

    const canvas = await html2canvas(captureArea, { 
      scale: 2,
      logging: false,
      allowTaint: false,
      useCORS: true
    });
    
    const link = document.createElement("a");
    const dateVal = document.getElementById("tanggal").value || "Laporan";
    link.download = `Laporan_Harian_WBP_${dateVal}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();

    // State: Sukses Unduh
    btn.classList.add("btn-state-success");
    icon.innerText = "✓";
    text.innerText = "Gambar Diunduh!";
    showToast("🖼️ Gambar infografis berhasil diunduh!", "success");

  } catch (err) {
    showToast("❌ Gagal mengunduh gambar: " + err.message, "error");
  } finally {
    // Kembalikan ke state semula setelah 2.5 detik
    setTimeout(() => {
      btn.disabled = false;
      btn.classList.remove("btn-state-success");
      icon.innerText = "🖼️";
      text.innerText = "Unduh Gambar Infografis";
    }, 2500);
  }
}

// Unduh Gambar Infografis
async function handleDownloadImage() {
  const btn = document.getElementById("btnDownload");
  btn.innerText = "⏳ Memproses Gambar...";
  btn.disabled = true;

  try {
    updateInfographicValues();

    const captureArea = document.getElementById("capture-area");
    
    // Pastikan gambar selesai dimuat sebelum merender canvas
    const images = captureArea.getElementsByTagName("img");
    for (let img of images) {
      if (!img.complete) {
        await new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
        });
      }
    }

    const canvas = await html2canvas(captureArea, { 
      scale: 2,
      logging: false,
      allowTaint: false,
      useCORS: true
    });
    
    const link = document.createElement("a");
    const dateVal = document.getElementById("tanggal").value || "Laporan";
    link.download = `Laporan_Harian_WBP_${dateVal}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    showToast("🖼️ Gambar infografis berhasil diunduh!", "success");
  } catch (err) {
    showToast("❌ Gagal mengunduh gambar: " + err.message, "error");
  } finally {
    btn.innerText = "🖼️ Unduh Gambar Infografis";
    btn.disabled = false;
  }
}
