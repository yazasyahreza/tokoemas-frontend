<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import Sidebar from "../../components/Sidebar.vue";

const router = useRouter();

// State Kontrol Utama
const isLoading = ref(true);
const orders = ref([]);
const selectedStatus = ref("Semua Status");

// URL Backend disamakan dengan DashboardView agar tidak CORS
const BACKEND_URL = "http://localhost/toko-emas-main";
const API_BASE_URL = `${BACKEND_URL}/index.php/api/v1`;

// Options untuk Dropdown Filter Status
const statusOptions = [
  "Semua Status",
  "Pending",
  "Paid",
  "Processed",
  "Shipped",
  "Completed",
  "Cancelled",
];

// === STATE & LOGIKA PAGINATION ===
const currentPage = ref(1);
const itemsPerPage = 10;

// Menghitung total halaman berdasarkan data yang difilter
const totalPages = computed(() => {
  return Math.ceil(filteredOrders.value.length / itemsPerPage);
});

// Memotong data orders agar tampil maksimal 10 per halaman
const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredOrders.value.slice(start, end);
});

// Fungsi Navigasi Halaman
const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

// Reset ke halaman 1 jika filter status diubah
watch(selectedStatus, () => {
  currentPage.value = 1;
});

// Helper Format Mata Uang Rupiah
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

// Pengondisian Warna Status Badge
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

// Ambil Data Asli dari API Orders
const fetchOrders = async () => {
  try {
    isLoading.value = true;
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    const response = await axios.get(`${API_BASE_URL}/orders`, config);

    if (response.data && response.data.data) {
      orders.value = response.data.data;
    }
  } catch (error) {
    console.error("Gagal mengambil riwayat order:", error);
    orders.value = [];
  } finally {
    isLoading.value = false;
  }
};

// Fungsi Filter data berdasarkan dropdown status
const filteredOrders = computed(() => {
  if (selectedStatus.value === "Semua Status") {
    return orders.value;
  }
  return orders.value.filter(
    (order) =>
      order.order_status?.toLowerCase() === selectedStatus.value.toLowerCase(),
  );
});

onMounted(() => {
  fetchOrders();
});
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex flex-col md:flex-row font-jakarta">
    <Sidebar />

    <main
      class="flex-1 p-4 md:p-8 space-y-6 w-full md:pl-80 transition-all duration-300"
    >
      <div v-if="isLoading" class="space-y-6 animate-pulse">
        <div class="h-20 bg-white rounded-2xl"></div>
        <div class="h-96 bg-white rounded-2xl"></div>
      </div>

      <template v-else>
        <div
          class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div>
            <h1
              class="text-2xl font-black text-[#1a237e] tracking-tight uppercase"
            >
              Pesanan Saya
            </h1>
            <p class="text-xs md:text-sm text-slate-500 mt-0.5">
              Pantau status pengiriman emas batangan Anda.
            </p>
          </div>

          <div class="relative w-full sm:w-auto">
            <select
              v-model="selectedStatus"
              class="w-full sm:w-48 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-[#1a237e] shadow-xs focus:outline-none focus:border-[#00a279] appearance-none cursor-pointer"
            >
              <option
                v-for="option in statusOptions"
                :key="option"
                :value="option"
              >
                {{ option }}
              </option>
            </select>
            <div
              class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500"
            >
              <svg
                class="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M7 10l5 5 5-5H7z" />
              </svg>
            </div>
          </div>
        </div>

        <div
          class="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden"
        >
          <div
            v-if="filteredOrders.length === 0"
            class="p-16 text-center flex flex-col justify-center items-center"
          >
            <div
              class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-5 border border-slate-100 shadow-inner"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-9 w-9 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="1.5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <h3 class="text-lg font-black text-[#1a237e] tracking-tight">
              ANDA BELUM BERBELANJA
            </h3>
            <p
              class="text-xs text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed"
            >
              Dapatkan koleksi emas terbaik Anda di Logam Mulia hari ini.
            </p>
            <button
              @click="router.push('/produk')"
              class="mt-6 bg-[#1a237e] hover:bg-[#2a36b1] text-white text-xs font-black uppercase tracking-widest px-8 py-3.5 rounded-xl transition-all duration-300 shadow-md shadow-blue-900/20 active:scale-95"
            >
              Mulai Belanja
            </button>
          </div>

          <div v-else class="w-full overflow-x-auto">
            <table
              class="w-full min-w-[900px] text-left text-sm border-collapse"
            >
              <thead
                class="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100"
              >
                <tr>
                  <th class="px-6 py-4 w-[45%]">Produk & Transaksi</th>
                  <th class="px-6 py-4 w-[25%]">Logistik</th>
                  <th class="px-6 py-4 w-[15%] text-center">Status</th>
                  <th class="px-6 py-4 w-[15%] text-center">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr
                  v-for="order in paginatedOrders"
                  :key="order.id"
                  class="hover:bg-slate-50/50 transition-colors"
                >
                  <td class="px-6 py-5">
                    <div class="flex flex-col space-y-1">
                      <span
                        class="text-xs font-bold text-slate-400 tracking-wider uppercase"
                      >
                        INVOICE: {{ order.invoice_no }}
                      </span>
                      <span
                        class="text-sm font-black text-[#1a237e] tracking-tight leading-snug"
                      >
                        {{
                          order.list_produk_detail || "Memuat Detail Produk..."
                        }}
                      </span>
                      <div
                        class="flex items-center space-x-2 pt-1 text-[11px] text-slate-500 font-medium"
                      >
                        <span>Tgl: {{ formatDate(order.created_at) }}</span>
                        <span>•</span>
                        <span class="text-emerald-600 font-bold text-xs">
                          Total:
                          {{ formatRupiah(parseFloat(order.grand_total || 0)) }}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td class="px-6 py-5">
                    <div class="flex flex-col space-y-0.5 text-xs">
                      <span class="font-bold text-slate-700"
                        >Kurir Pengiriman</span
                      >
                      <span
                        class="text-slate-500 font-medium uppercase text-[11px]"
                      >
                        {{
                          order.courier_name ||
                          "Standar (ID: " + order.shipping_method_id + ")"
                        }}
                      </span>
                    </div>
                  </td>

                  <td class="px-6 py-5 text-center">
                    <span
                      :class="[
                        getStatusClass(order.order_status),
                        'px-3 py-1 text-[11px] font-bold rounded-full border inline-block min-w-[85px] text-center uppercase tracking-wide',
                      ]"
                    >
                      {{ order.order_status }}
                    </span>
                  </td>

                  <td class="px-6 py-5 text-center">
                    <button
                      @click="router.push(`/member/orders/${order.id}`)"
                      class="px-5 py-2 bg-slate-50 hover:bg-[#00a279] text-[#1a237e] hover:text-white rounded-xl text-xs font-black border border-slate-200 hover:border-[#00a279] transition-all duration-300 active:scale-95 shadow-sm"
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div
            v-if="filteredOrders.length > itemsPerPage"
            class="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <span class="text-xs font-medium text-slate-500">
              Menampilkan
              <span class="font-bold text-slate-800">{{
                (currentPage - 1) * itemsPerPage + 1
              }}</span>
              sampai
              <span class="font-bold text-slate-800">{{
                Math.min(currentPage * itemsPerPage, filteredOrders.length)
              }}</span>
              dari
              <span class="font-bold text-slate-800">{{
                filteredOrders.length
              }}</span>
              pesanan
            </span>

            <div class="flex items-center space-x-1">
              <button
                @click="prevPage"
                :disabled="currentPage === 1"
                class="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-xs font-bold"
              >
                Sebelumnya
              </button>

              <div
                class="px-4 py-1.5 rounded-lg bg-[#1a237e] text-white text-xs font-bold shadow-sm"
              >
                {{ currentPage }} / {{ totalPages }}
              </div>

              <button
                @click="nextPage"
                :disabled="currentPage === totalPages"
                class="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-xs font-bold"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        </div>
      </template>
    </main>
  </div>
</template>
