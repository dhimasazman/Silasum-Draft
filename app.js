// URL Web App Google Apps Script Anda
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxHjU1itJjBNQJQPlNUEAaM85Lcf8pFcMlvJd6MZowix2zNNPgC3njbrxyIakTl-7BT/exec";

// Variabel PWA Install Prompt
let deferredPrompt;

document.addEventListener("DOMContentLoaded", () => {
  // Set tanggal hari ini
  const today = new Date();
  document.getElementById("tanggal").valueAsDate = today;

  // Render nilai default awal ke infografis
  updateInfographicValues();

  // Listener input otomatis update ke infografis
  document.getElementById("wbpForm").addEventListener("input", updateInfographicValues);

  // Event listener tombol terpisah
  document.getElementById("btnSave").addEventListener("click", handleSaveToSpreadsheet);
  document.getElementById("btnDownload").addEventListener("click", handleDownloadImage);

  // Register PWA Service Worker
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js")
      .then(reg => console.log("Service Worker terdaftar:", reg))
      .catch(err => console.error("Gagal mendaftarkan Service Worker:", err));
  }
});

// EVENT POP-UP PROMPT INSTALL PWA UNTUK SMARTPHONE
window.addEventListener("beforeinstallprompt", (e) => {
  // Cegah browser memunculkan mini-infobar bawaan
  e.preventDefault();
  deferredPrompt = e;

  // Tampilkan modal / banner promosi install aplikasi
  showInstallPromotion();
});

function showInstallPromotion() {
  // Cegah duplikasi jika modal sudah ada
  if (document.getElementById("installModal")) return;

  const installModal = document.createElement("div");
  installModal.id = "installModal";
  installModal.innerHTML = `
    <div style="position: fixed; bottom: 20px; left: 20px; right: 20px; background: #0d2b45; color: white; padding: 15px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); z-index: 9999; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <strong style="font-size: 14px;">Install Silasum</strong>
        <p style="font-size: 11px; margin-top: 2px; color: #cbd5e0;">Pasang aplikasi di layar utama HP Anda</p>
      </div>
      <div style="display: flex; gap: 8px; align-items: center;">
        <button id="btnInstallPWA" style="background: #16a34a; color: white; border: none; padding: 8px 12px; border-radius: 6px; font-weight: bold; font-size: 12px; cursor: pointer;">Install</button>
        <button id="btnClosePWA" style="background: transparent; color: white; border: none; font-size: 16px; cursor: pointer; padding: 0 4px;">✕</button>
      </div>
    </div>
  `;
  document.body.appendChild(installModal);

  document.getElementById("btnInstallPWA").addEventListener("click", async () => {
    installModal.remove();
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`Pilihan user: ${outcome}`);
      deferredPrompt = null;
    }
  });

  document.getElementById("btnClosePWA").addEventListener("click", () => {
    installModal.remove();
  });
}

function formatDateIndonesian(dateString) {
  if (!dateString) return "-";
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: '2-digit' };
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', options);
}

function updateInfographicValues() {
  // Hitung total Register A & B
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
    const val = document.getElementById(item.in).value || 0;
    document.getElementById(item.out).innerText = val;
  });

  document.getElementById("out-totalRegA").innerText = totalRegA;
  document.getElementById("out-totalRegB").innerText = totalRegB;
}

// FUNGSI SIMPAN KE SPREADSHEET
async function handleSaveToSpreadsheet() {
  const btn = document.getElementById("btnSave");
  btn.innerText = "⏳ Menyimpan...";
  btn.disabled = true;

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

    alert("✅ Data berhasil dikirim dan disimpan ke Google Spreadsheet!");
  } catch (err) {
    alert("❌ Gagal menyimpan data: " + err.message);
  } finally {
    btn.innerText = "📊 Simpan ke Spreadsheet";
    btn.disabled = false;
  }
}

// FUNGSI UNDUH GAMBAR INFOGRAFIS
async function handleDownloadImage() {
  const btn = document.getElementById("btnDownload");
  btn.innerText = "⏳ Memproses Gambar...";
  btn.disabled = true;

  try {
    updateInfographicValues();

    const captureArea = document.getElementById("capture-area");
    const canvas = await html2canvas(captureArea, { 
      scale: 2,
      logging: false,
      allowTaint: true,
      useCORS: false
    });
    
    const link = document.createElement("a");
    const dateVal = document.getElementById("tanggal").value || "Laporan";
    link.download = `Laporan Harian WBP ${dateVal}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  } catch (err) {
    alert("❌ Gagal mengunduh gambar: " + err.message);
  } finally {
    btn.innerText = "🖼️ Unduh Gambar Infografis";
    btn.disabled = false;
  }
}
