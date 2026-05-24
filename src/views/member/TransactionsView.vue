<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import Sidebar from "../../components/Sidebar.vue";

const router = useRouter();

// State Utama Kontrol
const isLoading = ref(true);
const transactions = ref([]);
const selectedType = ref("Semua Jenis");

// Opsi filter metode pembayaran
const typeOptions = ["Semua Jenis", "Pembelian", "Refund"];

const filteredTransactions = computed(() => {
  if (selectedType.value === "Semua Jenis") {
    return transactions.value;
  }

  // Mapping dari teks UI (Indonesia) ke nilai Database (Inggris)
  const targetType = selectedType.value === "Pembelian" ? "payment" : "refund";

  return transactions.value.filter((tx) => tx.type === targetType);
});

// Helper Format Mata Uang Rupiah
const formatRupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};

// Helper Format Tanggal Lengkap Indonesia
const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// Pengondisian Warna Status Transaksi
const getStatusClass = (status) => {
  switch (status?.toLowerCase()) {
    case "paid":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "unpaid":
      return "bg-amber-50 text-amber-700 border-amber-200 animate-pulse";
    case "failed":
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "bg-slate-50 text-slate-600 border-slate-200";
  }
};

// Ambil Data dari API Backend
const fetchTransactions = async () => {
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

    const BACKEND_URL = "http://localhost/toko-emas-main";
    const API_BASE_URL = `${BACKEND_URL}/index.php/api/v1`;

    const response = await axios.get(`${API_BASE_URL}/transactions`, config);

    // 🔥 PERBAIKAN 1: Menggunakan response.data.status (sesuai JSON)
    if (response.data && response.data.status) {
      transactions.value = response.data.data || [];
    }
  } catch (error) {
    console.error("Gagal mengambil riwayat transaksi:", error);
    transactions.value = [];
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchTransactions();
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
          class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4"
        >
          <div>
            <h1
              class="text-2xl font-black text-[#1a237e] tracking-tight uppercase"
            >
              Riwayat Transaksi
            </h1>
            <p class="text-xs md:text-sm text-slate-500 mt-0.5">
              Catatan lengkap mutasi pembayaran invoice akun Anda.
            </p>
          </div>

          <div
            class="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto"
          >
            <div class="relative w-full sm:w-auto">
              <div class="relative w-full sm:w-auto">
                <select
                  v-model="selectedType"
                  class="w-full sm:w-48 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-[#1a237e] shadow-xs focus:outline-none focus:border-[#00a279] appearance-none cursor-pointer"
                >
                  <option v-for="type in typeOptions" :key="type" :value="type">
                    {{ type }}
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
        </div>

        <div
          class="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden"
        >
          <div
            v-if="filteredTransactions.length === 0"
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3
              class="text-lg font-black text-[#1a237e] tracking-tight uppercase"
            >
              BELUM ADA TRANSAKSI
            </h3>
            <p
              class="text-xs text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed"
            >
              Semua riwayat tagihan invoice dan pembayaran sukses Anda akan
              tercatat rapi di sini.
            </p>
            <button
              @click="router.push('/produk')"
              class="mt-6 bg-[#1a237e] hover:bg-[#2a36b1] text-white text-xs font-black uppercase tracking-widest px-8 py-3.5 rounded-xl transition-all duration-300 shadow-md shadow-blue-900/20 active:scale-95"
            >
              Beli Emas
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
                  <th class="px-6 py-4 w-[15%]">ID Transaksi</th>
                  <th class="px-6 py-4 w-[30%]">Keterangan</th>
                  <th class="px-6 py-4 w-[20%]">Metode</th>
                  <th class="px-6 py-4 w-[15%]">Nominal</th>
                  <th class="px-6 py-4 w-[10%] text-center">Status</th>
                  <th class="px-6 py-4 w-[10%] text-center">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr
                  v-for="tx in filteredTransactions"
                  :key="tx.id"
                  class="hover:bg-slate-50/50 transition-colors"
                >
                  <td class="px-6 py-5">
                    <span
                      class="text-sm font-black text-slate-800 font-mono tracking-tight"
                    >
                      #TX-{{ tx.id }}
                    </span>
                  </td>

                  <td class="px-6 py-5">
                    <div class="flex items-start gap-3">
                      <div
                        :class="
                          tx.type === 'payment'
                            ? 'bg-blue-50 text-blue-600 border-blue-100'
                            : 'bg-amber-50 text-amber-600 border-amber-100'
                        "
                        class="p-2 rounded-xl flex-shrink-0 mt-0.5 border shadow-sm"
                      >
                        <svg
                          v-if="tx.type === 'payment'"
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
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>

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
                            d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                          />
                        </svg>
                      </div>

                      <div class="flex flex-col space-y-1">
                        <span class="text-xs font-bold text-slate-700">
                          {{
                            tx.type === "payment"
                              ? "Pembayaran Pesanan"
                              : "Pengembalian Dana"
                          }}
                        </span>
                        <span
                          :class="
                            tx.type === 'payment'
                              ? 'text-blue-600'
                              : 'text-amber-600'
                          "
                          class="text-[11px] font-bold"
                        >
                          ORD-{{ tx.invoice_no }}
                        </span>
                        <span class="text-[10px] text-slate-400 font-medium">
                          {{ formatDate(tx.created_at) }}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td class="px-6 py-5">
                    <span
                      class="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg"
                    >
                      {{ tx.payment_method_name || "Transfer Bank" }}
                    </span>
                  </td>

                  <td class="px-6 py-5">
                    <span class="text-sm font-extrabold text-[#1a237e]">
                      {{ formatRupiah(tx.amount) }}
                    </span>
                  </td>

                  <td class="px-6 py-5 text-center">
                    <span
                      :class="[
                        getStatusClass(tx.payment_status),
                        'px-3 py-1 text-[10px] font-black rounded-full border tracking-wide uppercase inline-block min-w-[85px] text-center',
                      ]"
                    >
                      {{ tx.payment_status }}
                    </span>
                  </td>

                  <td class="px-6 py-5 text-center">
                    <button
                      @click="router.push(`/member/orders/${tx.order_id}`)"
                      class="px-5 py-2 bg-slate-50 hover:bg-[#1a237e] hover:text-white text-slate-600 rounded-xl text-xs font-black border border-slate-200 hover:border-[#1a237e] transition-all duration-300 active:scale-95 shadow-sm"
                    >
                      Detail
                    </button>
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
