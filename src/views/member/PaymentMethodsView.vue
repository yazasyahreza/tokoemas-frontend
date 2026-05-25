<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import Sidebar from "../../components/Sidebar.vue";

// State untuk menyimpan data dari API
const paymentMethods = ref([]);
const isLoading = ref(true);

// State untuk Notifikasi Copy per ID Card
const copiedId = ref(null);

// 🔥 State untuk Modal Preview Gambar
const previewImageUrl = ref(null);

const openPreview = (url) => {
  if (url) previewImageUrl.value = url;
};

const closePreview = () => {
  previewImageUrl.value = null;
};

// Konfigurasi API (Sesuaikan dengan backend)
const BACKEND_URL = "http://localhost/toko-emas-main";
const API_BASE_URL = `${BACKEND_URL}/index.php/api/v1`;

// Mengambil data dari endpoint tabel payment_methods
const fetchPaymentMethods = async () => {
  try {
    isLoading.value = true;
    const token = localStorage.getItem("token");

    // Asumsi endpoint API menggunakan format CI3
    const response = await axios.get(`${API_BASE_URL}/shop-accounts`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data && response.data.status) {
      paymentMethods.value = response.data.data;
    }
  } catch (error) {
    console.error("Gagal mengambil data metode pembayaran:", error);
  } finally {
    isLoading.value = false;
  }
};

// Fungsi untuk merakit URL gambar/logo bank
const getImageUrl = (imagePath) => {
  if (!imagePath) return "";
  if (imagePath.startsWith("http")) return imagePath;

  // Sesuaikan nama folder penyimpanan gambar rekening di CodeIgniter
  return `${BACKEND_URL}/uploads/shop_accounts/${imagePath}`;
};

// Fungsi Salin ke Clipboard dinamis
const copyToClipboard = (text, id) => {
  if (!text) return;
  navigator.clipboard.writeText(text).then(() => {
    copiedId.value = id;
    setTimeout(() => {
      copiedId.value = null;
    }, 2000);
  });
};

onMounted(() => {
  fetchPaymentMethods();
});
</script>

<template>
  <div
    class="min-h-screen bg-slate-50 flex flex-col md:flex-row font-jakarta relative"
  >
    <Sidebar />

    <main
      class="flex-1 p-4 md:p-8 space-y-8 w-full md:pl-80 transition-all duration-300"
    >
      <div class="border-b border-slate-200/60 pb-5">
        <h1 class="text-2xl font-black text-[#1a237e] tracking-tight uppercase">
          Metode Pembayaran
        </h1>
        <p
          class="text-xs md:text-sm text-slate-500 mt-1.5 max-w-2xl leading-relaxed"
        >
          Pilih salah satu metode pembayaran resmi di bawah ini. Pastikan
          nominal transfer sesuai hingga digit terakhir agar sistem dapat
          memverifikasi secara otomatis.
        </p>
      </div>

      <div
        v-if="isLoading"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <div
          v-for="i in 3"
          :key="i"
          class="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm animate-pulse flex flex-col h-[240px]"
        >
          <div class="flex gap-4 items-center mb-6">
            <div class="w-16 h-16 bg-slate-200 rounded-2xl"></div>
            <div class="space-y-2 flex-1">
              <div class="h-4 bg-slate-200 rounded w-2/3"></div>
              <div class="h-3 bg-slate-200 rounded w-1/3"></div>
            </div>
          </div>
          <div class="mt-auto bg-slate-100 rounded-2xl h-24 w-full"></div>
        </div>
      </div>

      <div
        v-else-if="paymentMethods.length === 0"
        class="flex flex-col items-center justify-center bg-white border border-slate-100 rounded-3xl p-12 shadow-sm"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-16 w-16 text-slate-300 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="1.5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
          />
        </svg>
        <h3 class="text-lg font-black text-slate-600">Belum Ada Rekening</h3>
        <p class="text-sm text-slate-400 mt-1">
          Admin belum menambahkan metode pembayaran ke dalam sistem.
        </p>
      </div>

      <div
        v-else
        class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-6xl"
      >
        <div
          v-for="method in paymentMethods"
          :key="method.id"
          class="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col relative overflow-hidden group"
        >
          <div
            class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#1a237e] to-[#00a279] opacity-0 group-hover:opacity-100 transition-opacity"
          ></div>

          <div class="flex items-center gap-4 mb-8">
            <div
              class="relative w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center p-2 shrink-0 shadow-inner overflow-hidden group/img"
            >
              <template v-if="method.image">
                <img
                  :src="getImageUrl(method.image)"
                  :alt="method.name"
                  @click="openPreview(getImageUrl(method.image))"
                  class="w-full h-full object-contain cursor-pointer group-hover/img:scale-110 transition-transform duration-500"
                />

                <div
                  @click="openPreview(getImageUrl(method.image))"
                  class="absolute inset-0 bg-slate-900/40 opacity-0 md:group-hover/img:opacity-100 transition-opacity duration-300 hidden md:flex items-center justify-center cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 text-white drop-shadow-md"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2.5"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                    />
                  </svg>
                </div>

                <div
                  @click="openPreview(getImageUrl(method.image))"
                  class="absolute bottom-1 right-1 bg-white/90 backdrop-blur-sm rounded-full p-1 shadow-sm border border-slate-200 text-slate-600 md:hidden cursor-pointer active:scale-95 transition-transform"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="3"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                    />
                  </svg>
                </div>
              </template>

              <span v-else class="text-2xl font-black text-slate-300 uppercase">
                {{ method.name.charAt(0) }}
              </span>
            </div>

            <div>
              <h3
                class="text-base font-black text-[#1a237e] tracking-tight uppercase leading-tight"
              >
                {{ method.name }}
              </h3>
              <span
                class="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 mt-1.5 inline-block tracking-widest uppercase"
              >
                Aktif
              </span>
            </div>
          </div>

          <div
            class="mt-auto bg-slate-50 group-hover:bg-[#f8fafc] transition-colors rounded-2xl p-4 border border-slate-100 space-y-4"
          >
            <div>
              <p
                class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5"
              >
                Atas Nama
              </p>
              <p
                class="text-xs font-bold text-slate-700 uppercase line-clamp-1"
                :title="method.account_name"
              >
                {{ method.account_name || "Tidak Tersedia" }}
              </p>
            </div>

            <div class="border-t border-slate-200/70 border-dashed"></div>

            <div class="flex items-end justify-between gap-3">
              <div class="overflow-hidden">
                <p
                  class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1"
                >
                  Nomor Rekening
                </p>
                <p
                  class="text-lg font-black text-[#1a237e] font-mono tracking-wider truncate"
                >
                  {{ method.account_number || "-" }}
                </p>
              </div>

              <button
                v-if="method.account_number"
                @click="copyToClipboard(method.account_number, method.id)"
                class="shrink-0 p-2.5 rounded-xl border transition-all active:scale-95 focus:outline-none"
                :class="
                  copiedId === method.id
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                    : 'bg-white border-slate-200 text-slate-500 hover:text-[#1a237e] hover:bg-slate-100 shadow-sm'
                "
              >
                <span
                  v-if="copiedId === method.id"
                  class="text-[10px] font-black px-1 uppercase tracking-wider"
                  >Tersalin!</span
                >
                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2.5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <div
      v-if="previewImageUrl"
      @click="closePreview"
      class="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-300 cursor-zoom-out"
    >
      <div
        class="relative max-w-2xl w-full flex justify-center items-center group"
      >
        <button
          @click.stop="closePreview"
          class="absolute -top-12 right-0 md:-right-8 p-2 text-white/70 hover:text-white hover:rotate-90 transition-all duration-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <img
          :src="previewImageUrl"
          alt="Preview Gambar"
          @click.stop
          class="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl cursor-default animate-[zoomIn_0.2s_ease-out_forwards] border-4 border-white/10"
        />
      </div>
    </div>
  </div>
</template>
