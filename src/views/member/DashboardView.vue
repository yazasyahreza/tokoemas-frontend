<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import Sidebar from "../../components/Sidebar.vue";

const router = useRouter();

// State Reaktif Utama Dashboard Area Member
const isLoading = ref(true);
const user = ref({ name: "INVESTOR", email: "" });
const latestOrders = ref([]);
const stats = ref({
  total_belanja: 0,
  total_order: 0,
  order_pending: 0,
});

const BACKEND_URL = "http://localhost/toko-emas-main";
const API_BASE_URL = `${BACKEND_URL}/index.php/api/v1`;

// Helper Format Mata Uang Rupiah Indonesia
const formatRupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};

// Helper Format Tanggal Indonesia
const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// Pengondisian Warna Status Badge Berdasarkan Database
const getStatusClass = (status) => {
  switch (status?.toLowerCase()) {
    case "completed":
    case "success":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "paid":
    case "processed":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "shipped":
      return "bg-indigo-50 text-indigo-700 border-indigo-200";
    case "pending":
      return "bg-amber-50 text-amber-700 border-amber-200 animate-pulse";
    case "cancelled":
    case "failed":
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "bg-slate-50 text-slate-600 border-slate-200";
  }
};

// Fungsi Mengambil Data dari API Orders
const fetchDashboardData = async () => {
  try {
    isLoading.value = true;

    // 🔥 PERBAIKAN: Definisikan 'config' di sini agar dikenali
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    // 1. Ambil Profil User (Ganti 'INVESTOR' dengan nama asli)
    const profileRes = await axios.get(`${API_BASE_URL}/auth/profile`, config);
    if (profileRes.data && profileRes.data.data) {
      // Kita masukkan langsung seluruh objek data ke state user
      user.value = profileRes.data.data;

      // Jika ingin memastikan nama ter-update, log ini
      console.log("Nama user sekarang:", user.value.name);
    }

    // 2. Ambil Data Orders
    const ordersRes = await axios.get(`${API_BASE_URL}/orders`, config);

    if (ordersRes.data && ordersRes.data.data) {
      const allOrders = ordersRes.data.data;

      const uniqueOrdersMap = new Map();
      allOrders.forEach((o) =>
        uniqueOrdersMap.set(o.invoice_no, parseFloat(o.grand_total)),
      );

      let totalBelanja = 0;
      uniqueOrdersMap.forEach((val) => (totalBelanja += val));

      stats.value = {
        total_belanja: totalBelanja,
        total_order: uniqueOrdersMap.size, // Jumlah invoice unik
        order_pending: [
          ...new Set(
            allOrders
              .filter((o) => o.order_status === "pending")
              .map((o) => o.invoice_no),
          ),
        ].length,
      };

      latestOrders.value = allOrders.slice(0, 5);
    }
  } catch (error) {
    console.error("Gagal:", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchDashboardData();
});
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex flex-col md:flex-row font-jakarta">
    <Sidebar />

    <main
      class="flex-1 p-4 md:p-8 space-y-6 w-full md:pl-80 transition-all duration-300"
    >
      <div v-if="isLoading" class="space-y-6 animate-pulse">
        <div class="h-32 bg-white rounded-2xl border border-slate-100"></div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div class="h-24 bg-white rounded-2xl"></div>
          <div class="h-24 bg-white rounded-2xl"></div>
          <div class="h-24 bg-white rounded-2xl"></div>
        </div>
        <div class="h-64 bg-white rounded-2xl"></div>
      </div>

      <template v-else>
        <div
          class="bg-gradient-to-r from-[#1a237e] to-[#2a36b1] p-6 md:p-8 rounded-2xl border border-blue-900/10 shadow-lg text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative overflow-hidden group"
        >
          <div
            class="absolute -right-10 -top-10 w-40 h-40 bg-amber-400/10 rounded-full blur-2xl group-hover:bg-amber-400/15 transition-all duration-500"
          ></div>

          <div class="space-y-2 relative z-10">
            <h1
              class="text-xl md:text-2xl font-black tracking-tight flex items-center gap-2"
            >
              Selamat Datang Kembali,
              <span class="text-amber-400 uppercase">{{
                user.name || "INVESTOR"
              }}</span>
            </h1>
            <p class="text-xs md:text-sm text-slate-200 font-medium max-w-xl">
              Pantau perkembangan portofolio logam mulia Anda. Mulai cicil
              investasi emas batangan Antam & Gift Series andalan hari ini
              dengan aman.
            </p>
          </div>

          <button
            @click="router.push('/produk')"
            class="relative z-10 shrink-0 bg-[#00a279] hover:bg-[#008764] text-white font-black px-6 py-3.5 rounded-xl text-xs uppercase tracking-widest flex items-center gap-2 transition-all duration-300 active:scale-95 shadow-md shadow-emerald-950/20"
          >
            <svg
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
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <span>Lihat Produk Emas</span>
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div
            class="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-all duration-300 border-l-4 border-emerald-500"
          >
            <div class="flex justify-between items-center">
              <span
                class="text-xs font-bold text-slate-400 uppercase tracking-wider"
                >Total Belanja</span
              >
              <div class="p-2 bg-emerald-50 rounded-xl text-[#00a279]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <p class="text-2xl font-black text-slate-800 mt-3 tracking-tight">
              {{ formatRupiah(stats.total_belanja) }}
            </p>
            <p class="text-[11px] text-slate-400 mt-1 font-medium">
              Akumulasi seluruh transaksi termasuk biaya pengiriman + PPN
            </p>
          </div>

          <div
            class="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-all duration-300 border-l-4 border-blue-500"
          >
            <div class="flex justify-between items-center">
              <span
                class="text-xs font-bold text-slate-400 uppercase tracking-wider"
                >Total Order</span
              >
              <div class="p-2 bg-blue-50 rounded-xl text-blue-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
            </div>
            <p class="text-2xl font-black text-slate-800 mt-3 tracking-tight">
              {{ stats.total_order }} Nota
            </p>
            <p class="text-[11px] text-slate-400 mt-1 font-medium">
              Jumlah invoice terbit sistem
            </p>
          </div>

          <div
            class="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-all duration-300 border-l-4 border-amber-500"
          >
            <div class="flex justify-between items-center">
              <span
                class="text-xs font-bold text-slate-400 uppercase tracking-wider"
                >Order Pending</span
              >
              <div class="p-2 bg-amber-50 rounded-xl text-amber-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <p class="text-2xl font-black text-slate-800 mt-3 tracking-tight">
              {{ stats.order_pending }} Menunggu
            </p>
            <p class="text-[11px] text-slate-400 mt-1 font-medium">
              Segera selesaikan pembayaran Anda
            </p>
          </div>
        </div>

        <div
          class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
        >
          <div
            class="p-5 border-b border-slate-100 flex justify-between items-center"
          >
            <div>
              <h3 class="text-base font-black text-slate-800 tracking-tight">
                5 Riwayat Order Terbaru
              </h3>
              <p class="text-[11px] text-slate-400 mt-0.5 font-medium">
                Daftar transaksi mutakhir yang ditarik real-time dari database.
              </p>
            </div>
            <button
              @click="router.push('/member/orders')"
              class="text-xs font-bold text-[#00a279] hover:text-[#008764] hover:underline flex items-center gap-1 transition-all"
            >
              <span>Lihat Semua</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2.5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          <div
            v-if="latestOrders.length === 0"
            class="p-12 text-center flex flex-col justify-center items-center"
          >
            <div
              class="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300 border border-slate-100 mb-3"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <p class="text-sm font-bold text-slate-700">
              Belum Ada Transaksi Tercatat
            </p>
            <p class="text-xs text-slate-400 mt-0.5">
              Sistem siap merekam otomatis begitu Anda melakukan transaksi
              produk.
            </p>
          </div>

          <div v-else class="overflow-x-auto">
            <table class="w-full text-left text-sm">
              <thead
                class="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold"
              >
                <tr>
                  <th class="py-3 px-6">Invoice</th>
                  <th class="py-3 px-6">Produk</th>
                  <th class="py-3 px-6">Total</th>
                  <th class="py-3 px-6 text-center">Status</th>
                  <th class="py-3 px-6">Tanggal</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr v-for="order in latestOrders" :key="order.id">
                  <td class="py-4 px-6 font-bold text-slate-800">
                    {{ order.invoice_no }}
                  </td>

                  <td class="py-4 px-6 text-slate-500 text-xs">
                    {{ order.list_produk_detail }}
                  </td>

                  <td class="py-4 px-6 font-bold text-slate-800">
                    {{ formatRupiah(parseFloat(order.grand_total || 0)) }}
                  </td>

                  <td class="py-4 px-6 text-center">
                    <span :class="getStatusClass(order.order_status)">{{
                      order.order_status
                    }}</span>
                  </td>

                  <td class="py-4 px-6 text-slate-500 text-xs">
                    {{ formatDate(order.created_at) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </template>
    </main>
  </div>
</template>
