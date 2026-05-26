<template>
  <main class="flex-1 bg-[#f8fafc] py-6 md:py-10 px-4 lg:px-20">
    <div
      class="bg-white w-full max-w-5xl mx-auto rounded-[1.5rem] md:rounded-[2rem] shadow-sm border border-slate-100 p-5 md:p-12 relative overflow-hidden"
    >
      <div class="flex items-center justify-between mb-8 md:mb-10">
        <h1
          class="text-lg md:text-xl font-extrabold text-[#1a237e] uppercase tracking-tight"
        >
          Keranjang Belanja
        </h1>
        <span
          class="bg-blue-50 text-[#3b82f6] text-[10px] md:text-xs font-black px-3 py-1 rounded-full"
        >
          {{ cartStore.items?.length || 0 }} ITEM
        </span>
      </div>

      <div
        v-if="(cartStore.items || []).length > 0"
        class="space-y-4 md:space-y-6"
      >
        <div
          v-for="(item, index) in cartStore.items || []"
          :key="item.id || index"
          class="flex flex-row items-center gap-4 md:gap-8 p-3 md:p-6 rounded-2xl border border-slate-50 bg-white hover:border-blue-100 transition-all text-left"
        >
          <div
            class="w-20 h-20 md:w-32 md:h-32 bg-slate-50 rounded-xl overflow-hidden flex-shrink-0"
          >
            <img
              :src="getImageUrl(item.image)"
              class="w-full h-full object-cover"
              :alt="item.name"
            />
          </div>

          <div
            class="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-4"
          >
            <div class="flex-1">
              <h3
                class="text-[#1a237e] text-sm md:text-lg font-black uppercase leading-tight line-clamp-1"
              >
                {{ item.name }}
              </h3>
              <div class="mt-1 flex flex-col gap-0.5">
                <p class="text-slate-400 text-[10px] md:text-sm font-bold">
                  Rp {{ formatPrice(parsePrice(item.price)) }} / item
                </p>
                <p
                  class="text-[#FF4D4D] text-xs md:text-base font-black uppercase tracking-tight"
                >
                  Subtotal: Rp {{ formatPrice(getSubtotal(item)) }}
                </p>
              </div>
            </div>

            <div
              class="flex items-center justify-between md:justify-end gap-3 md:gap-4 mt-2 md:mt-0"
            >
              <div
                class="flex items-center bg-slate-50 border border-slate-200 rounded-lg md:rounded-xl px-1 py-1"
              >
                <button
                  class="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-slate-400 hover:text-red-500 font-bold transition-colors"
                  @click="cartStore.updateQty(index, -1)"
                >
                  -
                </button>
                <span
                  class="w-8 md:w-12 text-center text-xs md:text-base font-black text-[#1a237e]"
                >
                  {{ getQty(item) }}
                </span>
                <button
                  class="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-slate-400 hover:text-blue-600 font-bold transition-colors"
                  @click="cartStore.updateQty(index, 1)"
                >
                  +
                </button>
              </div>

              <button
                class="w-8 h-8 md:w-11 md:h-11 flex items-center justify-center bg-red-50 text-red-500 rounded-lg md:rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                @click="cartStore.removeItem(index)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 md:h-5 md:w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div
          class="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 mt-10 border-slate-100 bg-white md:bg-slate-50 p-0 md:p-8 rounded-2xl"
        >
          <div class="text-[#1a237e] text-center md:text-left">
            <p
              class="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mb-1"
            >
              Estimasi Total Pembayaran
            </p>
            <span class="text-2xl md:text-3xl font-black text-[#3b82f6]">
              Rp {{ formatPrice(cartStore.totalPrice) }}
            </span>
          </div>

          <div class="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            <button
              @click="handleCheckout"
              class="order-1 md:order-2 bg-[#1a237e] hover:bg-blue-900 text-white font-black px-8 md:px-12 py-3.5 md:py-4 rounded-xl md:rounded-2xl uppercase text-[11px] md:text-[13px] shadow-xl shadow-blue-100 text-center tracking-widest transition-all active:scale-95 flex items-center justify-center whitespace-nowrap w-full md:w-auto"
            >
              Lanjut Checkout
            </button>
            <button
              class="order-2 md:order-1 border-2 border-red-100 text-red-400 hover:bg-red-50 font-black px-8 py-3 rounded-xl md:rounded-2xl uppercase text-[10px] md:text-[11px] tracking-widest transition-all active:scale-95 text-center"
              @click="handleClearCart"
            >
              Kosongkan
            </button>
          </div>
        </div>
      </div>

      <div v-else class="py-20 text-center">
        <div
          class="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-10 w-10 text-slate-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
        </div>
        <h2 class="text-[#1a237e] text-lg font-black uppercase mb-2">
          Keranjang Kosong
        </h2>
        <p class="text-slate-400 text-sm mb-8">
          Sepertinya Anda belum memilih produk emas.
        </p>
        <RouterLink
          to="/produk"
          class="inline-block bg-[#1a237e] text-white font-black px-10 py-4 rounded-xl uppercase text-xs tracking-widest shadow-lg shadow-blue-100"
        >
          Mulai Belanja
        </RouterLink>
      </div>
    </div>
  </main>

  <Teleport to="body">
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showModal"
        class="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
        @click.self="closeModal"
      >
        <div
          class="bg-white rounded-3xl w-full max-w-[360px] shadow-2xl overflow-hidden p-8 text-center animate-in fade-in zoom-in-95 duration-300"
        >
          <div
            class="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-6"
            :class="
              modalType === 'warning'
                ? 'bg-amber-100 text-amber-500'
                : 'bg-rose-100 text-rose-500'
            "
          >
            <svg
              v-if="modalType === 'warning'"
              xmlns="http://www.w3.org/2000/svg"
              class="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2.5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              class="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2.5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>

          <h3 class="text-xl font-black text-slate-800 tracking-tight mb-2">
            {{ modalTitle }}
          </h3>
          <p
            class="text-xs text-slate-500 font-medium leading-relaxed whitespace-pre-line mb-8"
          >
            {{ modalMessage }}
          </p>

          <div v-if="modalType === 'warning'" class="flex gap-3">
            <button
              @click="closeModal"
              class="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-black py-3.5 rounded-2xl uppercase text-xs tracking-widest transition-all"
            >
              Batal
            </button>
            <button
              @click="executeAction"
              class="flex-1 bg-rose-500 hover:bg-rose-600 text-white shadow-rose-200 shadow-lg font-black py-3.5 rounded-2xl uppercase text-xs tracking-widest transition-all active:scale-95"
            >
              Hapus
            </button>
          </div>

          <button
            v-else
            @click="closeModal"
            class="w-full bg-rose-500 hover:bg-rose-600 text-white shadow-rose-200 shadow-lg font-black py-4 rounded-2xl uppercase text-xs tracking-widest transition-all active:scale-95"
          >
            Mengerti
          </button>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
// 🔥 PERBAIKAN: Pastikan ref ikut di-import
import { ref, onMounted } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { useCartStore } from "../stores/cart";

const router = useRouter();
const cartStore = useCartStore();

// 🔥 ALAMAT BACKEND
const BACKEND_URL = "http://localhost/toko-emas-main";

// ==========================================
// 🔥 STATE & FUNGSI UNTUK MODAL NOTIFIKASI
// ==========================================
const showModal = ref(false);
const modalType = ref("warning"); // 'error' atau 'warning'
const modalTitle = ref("");
const modalMessage = ref("");
const modalConfirmAction = ref(null);

const openModal = (type, title, message, confirmAction = null) => {
  modalType.value = type;
  modalTitle.value = title;
  modalMessage.value = message;
  modalConfirmAction.value = confirmAction;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  modalConfirmAction.value = null; // reset aksi
};

const executeAction = () => {
  if (modalConfirmAction.value) {
    modalConfirmAction.value(); // Jalankan perintah hapus
  }
  closeModal();
};

// ==========================================
// HELPER FUNCTIONS (Tetap sama)
// ==========================================
const getQty = (item) => {
  return parseInt(item.qty) || parseInt(item.quantity) || 1;
};

const getImageUrl = (img) => {
  if (!img) return "";
  if (img.startsWith("http://") || img.startsWith("https://")) return img;
  return `${BACKEND_URL}/uploads/products/${img}`;
};

const getSubtotal = (item) => {
  const price = parsePrice(item.price);
  const qty = getQty(item);
  return price * qty;
};

const parsePrice = (priceStr) => {
  if (!priceStr) return 0;
  return parseInt(String(priceStr).replace(/[^0-9]/g, "")) || 0;
};

const formatPrice = (val) => {
  return new Intl.NumberFormat("id-ID").format(val);
};

// ==========================================
// 🔥 PERBAIKAN: Fungsi Tombol Keranjang (Tanpa Alert Bawaan)
// ==========================================
const handleClearCart = () => {
  // Panggil modal konfirmasi dengan 2 tombol
  openModal(
    "warning",
    "Kosongkan Keranjang?",
    "Apakah Anda yakin ingin menghapus semua isi keranjang belanja Anda?",
    () => {
      cartStore.clearCart();
    },
  );
};

const handleCheckout = () => {
  if (!cartStore.items || cartStore.items.length === 0) {
    // Panggil modal peringatan dengan 1 tombol
    openModal(
      "error",
      "Keranjang Kosong",
      "Keranjang belanja masih kosong! Silakan pilih produk emas terlebih dahulu.",
    );
    return;
  }
  // Jika aman, arahkan ke checkout
  router.push("/checkout");
};

onMounted(async () => {
  await cartStore.fetchCart();
});
</script>
