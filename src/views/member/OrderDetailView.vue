<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import Sidebar from "../../components/Sidebar.vue";

const route = useRoute();
const router = useRouter();

const isLoading = ref(true);
const order = ref(null);

const BACKEND_URL = "http://localhost/toko-emas-main";
const API_BASE_URL = `${BACKEND_URL}/index.php/api/v1`;

// Helper Format Mata Uang Rupiah
const formatRupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};

// Ambil data detail order berdasarkan ID di URL
const fetchOrderDetail = async () => {
  try {
    isLoading.value = true;
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");

    const orderId = route.params.id; // Ambil ID dari URL (misal: /member/orders/1)

    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(
      `${API_BASE_URL}/orders/detail/${orderId}`,
      config,
    );

    if (response.data && response.data.data) {
      order.value = response.data.data;
    }
  } catch (error) {
    console.error("Gagal mengambil detail order:", error);
    alert("Data pesanan tidak ditemukan.");
    router.push("/member/orders");
  } finally {
    isLoading.value = false;
  }
};

const getImageUrl = (imagePath, folder = "products") => {
  if (!imagePath) return "https://via.placeholder.com/150";

  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  // 🔥 Path sekarang dinamis menyesuaikan nama folder
  return `${BACKEND_URL}/uploads/${folder}/${imagePath}`;
};

const contactWhatsApp = () => {
  if (!order.value || !order.value.shop_whatsapp) {
    alert("Nomor WhatsApp admin belum diatur di sistem backend.");
    return;
  }

  // 🔥 Mengambil nomor whatsapp dinamis hasil tarikan dari database settings
  let phone = order.value.shop_whatsapp.trim();

  // Logika Auto-Format agar kebal dari kesalahan penulisan di database
  if (phone.startsWith("0")) {
    phone = "62" + phone.slice(1);
  } else if (phone.startsWith("+62")) {
    phone = phone.replace("+62", "62");
  }

  // Menghilangkan spasi, strip, atau karakter non-angka jika admin salah ketik
  phone = phone.replace(/\D/g, "");

  // Pesan dinamis mengambil invoice_no dari database
  const message = `Halo Admin, saya ingin bertanya tentang pesanan: ${order.value.invoice_no}`;

  // Encode URI agar spasi dan karakter khusus aman di URL
  const encodedMessage = encodeURIComponent(message);

  // Buka tab baru menuju WhatsApp dengan nomor dinamis
  const waUrl = `https://wa.me/${phone}?text=${encodedMessage}`;
  window.open(waUrl, "_blank");
};

const formatGram = (weight) => {
  if (!weight) return "0";
  return new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 4, // Membatasi maksimal 4 angka di belakang koma (jika ada)
  }).format(parseFloat(weight));
};

const getStatusDisplay = (status) => {
  const s = status?.toLowerCase() || "";

  if (s === "pending" || s === "unpaid") {
    return {
      title: "Menunggu Pembayaran",
      desc: "Selesaikan pembayaran Anda agar pesanan emas dapat segera kami proses.",
      icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", // Jam
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
    };
  } else if (s === "paid" || s === "processed") {
    return {
      title: "Pesanan Diproses",
      desc: "Pembayaran berhasil! Kami sedang mengemas logam mulia Anda dengan aman.",
      icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", // Centang
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
    };
  } else if (s === "shipped") {
    return {
      title: "Sedang Dikirim",
      desc: "Pesanan Anda telah diserahkan ke kurir dan sedang dalam perjalanan.",
      icon: "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4", // Truk
      bg: "bg-indigo-50",
      text: "text-indigo-700",
      border: "border-indigo-200",
    };
  } else if (s === "completed" || s === "success") {
    return {
      title: "Pesanan Selesai",
      desc: "Logam mulia telah diterima. Terima kasih telah berinvestasi bersama kami!",
      icon: "M5 13l4 4L19 7", // Centang Selesai
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
    };
  } else {
    return {
      title: "Dibatalkan",
      desc: "Pesanan ini telah dibatalkan atau pembayaran gagal (kedaluwarsa).",
      icon: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z", // Silang
      bg: "bg-red-50",
      text: "text-red-700",
      border: "border-red-200",
    };
  }
};

onMounted(() => {
  fetchOrderDetail();
});
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex flex-col md:flex-row font-jakarta">
    <Sidebar />

    <main class="flex-1 p-4 md:p-8 w-full md:pl-80 transition-all duration-300">
      <button
        @click="router.push('/member/orders')"
        class="flex items-center space-x-2 text-xs font-bold text-slate-400 hover:text-[#1a237e] transition-colors mb-6 uppercase tracking-wider"
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
            d="M15 19l-7-7 7-7"
          />
        </svg>
        <span>Kembali ke Daftar Pesanan</span>
      </button>

      <div v-if="isLoading" class="animate-pulse space-y-6">
        <div class="h-40 bg-white rounded-3xl"></div>
        <div class="h-64 bg-white rounded-3xl"></div>
      </div>

      <div v-else-if="order" class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div class="col-span-1 lg:col-span-8 space-y-6">
          <div
            v-if="order"
            :class="[
              'p-6 md:p-8 rounded-3xl border shadow-sm flex items-start sm:items-center gap-5 transition-all duration-300',
              getStatusDisplay(order.order_status).bg,
              getStatusDisplay(order.order_status).border,
            ]"
          >
            <div
              :class="[
                'p-4 rounded-2xl bg-white shadow-sm flex-shrink-0',
                getStatusDisplay(order.order_status).text,
              ]"
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
                  :d="getStatusDisplay(order.order_status).icon"
                />
              </svg>
            </div>

            <div>
              <p
                class="text-[10px] font-bold tracking-widest uppercase mb-1 opacity-70"
                :class="getStatusDisplay(order.order_status).text"
              >
                ID PESANAN: {{ order.invoice_no }}
              </p>
              <h1
                class="text-xl md:text-2xl font-black tracking-tight mb-1"
                :class="getStatusDisplay(order.order_status).text"
              >
                {{ getStatusDisplay(order.order_status).title }}
              </h1>
              <p
                class="text-xs font-medium opacity-80"
                :class="getStatusDisplay(order.order_status).text"
              >
                {{ getStatusDisplay(order.order_status).desc }}
              </p>
            </div>
          </div>

          <div
            class="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm"
          >
            <h3
              class="text-xs font-bold text-slate-400 tracking-wider uppercase mb-6"
            >
              Produk Yang Dibeli
            </h3>

            <div class="divide-y divide-slate-100">
              <div
                v-for="item in order.items"
                :key="item.id"
                class="py-4 flex items-center justify-between gap-4"
              >
                <div class="flex items-center gap-4">
                  <div
                    class="w-16 h-16 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0 border border-slate-200"
                  >
                    <img
                      :src="getImageUrl(item.image)"
                      alt="Produk"
                      class="w-full h-full object-cover mix-blend-multiply"
                    />
                  </div>

                  <div>
                    <h4 class="font-bold text-[#1a237e] text-sm md:text-base">
                      {{ item.product_name }}
                    </h4>

                    <p
                      v-if="item.weight"
                      class="text-[11px] font-bold text-slate-400 mt-0.5 mb-1"
                    >
                      {{ formatGram(item.weight) }} Gram
                    </p>

                    <p class="text-xs text-slate-500 font-medium">
                      {{ item.quantity }} x {{ formatRupiah(item.price) }}
                    </p>
                  </div>
                </div>

                <div class="text-right">
                  <p class="font-black text-slate-800 text-sm md:text-base">
                    {{ formatRupiah(item.subtotal) }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div
            class="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden"
          >
            <div
              class="absolute -top-4 -left-4 w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 text-blue-500 ml-4 mt-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>

            <h3
              class="text-base font-black text-[#1a237e] tracking-tight uppercase ml-12 mb-6"
            >
              Informasi Pengiriman
            </h3>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4 mb-8">
              <div>
                <p
                  class="text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1"
                >
                  Alamat Tujuan
                </p>
                <p class="text-xs text-slate-700 font-bold leading-relaxed">
                  {{ order.shipping_address || "Alamat belum diatur" }}
                </p>
              </div>
              <div>
                <p
                  class="text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1"
                >
                  Kurir & Resi
                </p>
                <p class="text-xs font-black text-slate-700 uppercase mb-1">
                  {{ order.courier_name }}
                  <span v-if="order.service"> ({{ order.service }})</span>
                </p>
                <p
                  class="text-sm font-black text-[#00a279] uppercase font-mono bg-emerald-50 inline-block px-2 py-0.5 rounded border border-emerald-100"
                >
                  {{ order.tracking_number || "BELUM TERBIT" }}
                </p>
              </div>
            </div>

            <hr class="border-slate-100 mb-6" />

            <div v-if="order.tracking_number" class="space-y-2 pl-2">
              <div
                class="flex items-start gap-3 relative pb-6 border-l-2 border-emerald-500 pl-4"
              >
                <div
                  class="absolute -left-[7px] top-0.5 w-3 h-3 bg-emerald-500 rounded-full ring-4 ring-white"
                ></div>
                <div>
                  <p class="text-xs font-black text-slate-800">
                    Pesanan Berhasil Diproses
                  </p>
                  <p class="text-[10px] text-slate-400 mt-0.5">
                    Sistem memverifikasi pembayaran emas Anda.
                  </p>
                </div>
              </div>

              <div
                class="flex items-start gap-3 relative pb-6 border-l-2 pl-4 transition-colors duration-500"
                :class="
                  order.shipping_status === 'Shipped' ||
                  order.shipping_status === 'Delivered'
                    ? 'border-emerald-500'
                    : 'border-slate-200'
                "
              >
                <div
                  class="absolute -left-[7px] top-0.5 w-3 h-3 rounded-full ring-4 ring-white transition-colors duration-500"
                  :class="
                    order.shipping_status === 'Shipped' ||
                    order.shipping_status === 'Delivered'
                      ? 'bg-emerald-500'
                      : 'bg-slate-200'
                  "
                ></div>
                <div>
                  <p
                    class="text-xs font-black transition-colors"
                    :class="
                      order.shipping_status === 'Shipped' ||
                      order.shipping_status === 'Delivered'
                        ? 'text-slate-800'
                        : 'text-slate-400'
                    "
                  >
                    Paket Telah Diserahkan ke Kurir
                  </p>
                  <p
                    v-if="order.shipped_at"
                    class="text-[10px] font-bold text-blue-500 mt-1"
                  >
                    Berangkat: {{ order.shipped_at }}
                  </p>
                </div>
              </div>

              <div class="flex items-start gap-3 relative pl-4">
                <div
                  class="absolute -left-[7px] top-0.5 w-3 h-3 rounded-full ring-4 ring-white transition-all duration-500"
                  :class="
                    order.shipping_status === 'Delivered'
                      ? 'bg-emerald-500 scale-110'
                      : 'bg-slate-200'
                  "
                ></div>
                <div>
                  <p
                    class="text-xs font-black transition-colors"
                    :class="
                      order.shipping_status === 'Delivered'
                        ? 'text-emerald-600'
                        : 'text-slate-400'
                    "
                  >
                    Emas Diterima oleh Pembeli
                  </p>
                  <p
                    v-if="order.delivered_at"
                    class="text-[10px] font-bold text-emerald-500 mt-1"
                  >
                    Tiba: {{ order.delivered_at }}
                  </p>
                  <p class="text-[10px] text-slate-400 mt-0.5">
                    Pastikan merekam video unboxing untuk klaim asuransi.
                  </p>
                </div>
              </div>
            </div>

            <div
              v-else
              class="bg-amber-50/50 border border-amber-100 rounded-2xl p-4 flex items-center justify-center gap-3"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-amber-500 animate-spin-slow"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <p class="text-xs font-bold text-amber-700">
                Admin sedang menyiapkan asuransi & resi pengiriman Anda.
              </p>
            </div>
          </div>
        </div>

        <div class="col-span-1 lg:col-span-4 space-y-6">
          <div class="bg-[#111827] p-6 rounded-3xl shadow-lg text-white">
            <div class="flex items-center gap-3 mb-6">
              <div class="p-2 bg-slate-800 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 text-slate-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              <h3 class="font-black tracking-widest uppercase text-sm">
                Rincian Pembayaran
              </h3>
            </div>

            <div
              class="space-y-4 text-xs font-medium border-b border-slate-700 pb-4 mb-4"
            >
              <div class="flex justify-between">
                <span class="text-slate-400">Metode</span>
                <span class="font-bold">{{
                  order.shop_account_name || "Bank Transfer"
                }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-slate-400">Status Bayar</span>
                <span
                  class="px-2 py-1 bg-amber-500/20 text-amber-400 rounded text-[10px] font-bold uppercase"
                  >{{ order.payment_status || "Pending" }}</span
                >
              </div>
            </div>

            <div class="space-y-3 text-xs font-medium mb-6">
              <div class="flex justify-between">
                <span class="text-slate-400">Total Belanja</span>
                <span>{{ formatRupiah(order.subtotal || 0) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Ongkos Kirim</span>
                <span>{{ formatRupiah(order.shipping_cost || 0) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">PPN (Service Fee)</span>
                <span>{{ formatRupiah(order.admin_fee || 0) }}</span>
              </div>
            </div>

            <div
              class="flex justify-between items-center pt-4 border-t border-slate-700"
            >
              <span class="font-bold text-sm">Total Bayar</span>
              <span class="text-xl font-black text-amber-400">{{
                formatRupiah(order.grand_total)
              }}</span>
            </div>
          </div>

          <div
            class="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 text-center"
          >
            <div
              class="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm text-emerald-500"
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
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <h3
              class="font-black text-[#1a237e] text-sm uppercase tracking-widest mb-2"
            >
              Butuh Bantuan?
            </h3>
            <p class="text-[10px] text-slate-500 mb-4 px-2">
              Hubungi CS kami via WhatsApp untuk bantuan pembayaran atau
              pengiriman.
            </p>
            <button
              @click="contactWhatsApp"
              class="w-full py-3 bg-[#00a279] hover:bg-[#008764] text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 shadow-md shadow-emerald-900/20"
            >
              Hubungi WhatsApp
            </button>
          </div>
          <div
            class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-center"
          >
            <h3
              class="text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-4"
            >
              Bukti Transfer
            </h3>

            <div
              v-if="!order.payment_proof"
              class="bg-slate-50 border border-slate-200 border-dashed rounded-2xl py-8 px-4 flex flex-col items-center justify-center"
            >
              <div
                class="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-300 mb-3 shadow-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2.5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p class="text-[11px] font-bold text-slate-500">
                Belum ada bukti transfer.
              </p>
            </div>

            <div
              v-else
              class="rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative group"
            >
              <img
                :src="getImageUrl(order.payment_proof, 'payment_proofs')"
                alt="Bukti Transfer"
                class="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
              />

              <a
                :href="getImageUrl(order.payment_proof, 'payment_proofs')"
                target="_blank"
                class="absolute inset-0 bg-[#1a237e]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer backdrop-blur-[2px]"
              >
                <span
                  class="text-white text-[10px] font-black uppercase tracking-widest bg-[#1a237e]/80 px-4 py-2 rounded-lg border border-white/20 shadow-lg"
                >
                  Buka Gambar
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
