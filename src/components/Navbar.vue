<script setup>
// 🔥 PERBAIKAN 1: Tambahkan onUnmounted di import
import { ref, onMounted, onUnmounted, watch } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { useCartStore } from "../stores/cart";
import axios from "axios";

const BACKEND_URL = "http://localhost/toko-emas-main";
const API_BASE_URL = `${BACKEND_URL}/index.php/api/v1`;

const isMenuOpen = ref(false);
const cartStore = useCartStore();
const route = useRoute();

// State reaktif untuk status login & logo
const isAuthenticated = ref(false);
const shopLogo = ref("");

const checkLoginStatus = () => {
  const token = localStorage.getItem("token");
  isAuthenticated.value = !!token;
};

const fetchSettings = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/settings`);
    if (response.data && response.data.data) {
      const settingsData = response.data.data;
      const logoItem = settingsData.find((item) => item.key === "logo");

      if (logoItem && logoItem.value) {
        shopLogo.value = `${BACKEND_URL}/uploads/settings/${logoItem.value}`;
      }
    }
  } catch (error) {
    console.error("Gagal memuat logo toko:", error);
  }
};

// 🔥 PERBAIKAN 2: Gabungkan semua onMounted agar lebih bersih dan pasang Event Listener
onMounted(async () => {
  checkLoginStatus();
  fetchSettings();
  await cartStore.fetchCart();

  // 👉 Pasang "Telinga" untuk mendengarkan sinyal token expired dari main.js
  window.addEventListener("auth-changed", checkLoginStatus);
  window.addEventListener("profile-updated", checkLoginStatus);
});

// 🔥 PERBAIKAN 3: Cabut Event Listener saat komponen hancur agar tidak membebani memori browser
onUnmounted(() => {
  window.removeEventListener("auth-changed", checkLoginStatus);
  window.removeEventListener("profile-updated", checkLoginStatus);
});

watch(
  () => route.path,
  async () => {
    // 1. Cek wujud fisik token di localStorage
    checkLoginStatus();

    // 2. Jika secara fisik tokennya ada, mari kita tes "keasliannya" ke Backend!
    if (isAuthenticated.value) {
      try {
        // Memanggil fetchCart diam-diam.
        // Jika token asli, angka badge keranjang akan update.
        // Jika token RUSAK/EXPIRED, backend membalas 401 dan Interceptor langsung bekerja!
        await cartStore.fetchCart();
      } catch (error) {
        console.warn("Sesi tidak valid, memicu mode Guest secara otomatis.");
      }
    }
  },
);
</script>

<template>
  <header
    class="bg-white py-4 md:py-5 px-4 md:px-6 sticky top-0 z-[100] shadow-sm border-b border-slate-50"
  >
    <nav class="container mx-auto flex justify-between items-center">
      <div class="flex items-center">
        <RouterLink to="/">
          <img
            v-if="shopLogo"
            :src="shopLogo"
            class="h-8 md:h-11 object-contain"
            alt="Logo Toko Emas"
          />
        </RouterLink>
      </div>

      <div class="flex items-center space-x-2 md:space-x-5">
        <RouterLink
          to="/produk"
          class="hidden md:flex items-center space-x-1 md:space-x-3 px-2 md:px-4 py-2 md:py-2.5 mr-4 rounded-2xl transition-all duration-300 hover:bg-slate-50 active:scale-95 group"
        >
          <div
            class="relative flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-0.5"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 text-blue-900 transition-colors group-hover:text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2.2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-14v10m0-10l-8 4m0 0v10l8 4"
              />
            </svg>
          </div>
          <span
            class="text-[13px] font-black text-blue-900 transition-colors duration-300 group-hover:text-blue-600 uppercase tracking-wider"
          >
            Produk
          </span>
        </RouterLink>

        <RouterLink
          to="/cart"
          class="group relative flex items-center space-x-1 md:space-x-3 px-2 md:px-4 py-2 md:py-2.5 rounded-2xl transition-all duration-300 hover:bg-slate-50 active:scale-95"
        >
          <div
            class="relative transition-transform duration-300 group-hover:-translate-y-0.5"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 text-blue-900 group-hover:scale-105 transition-all duration-300 group-hover:text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>

            <span
              v-if="cartStore.totalItems > 0"
              class="absolute -top-1.5 -right-1.5 bg-[#ef4444] text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white"
            >
              {{ cartStore.totalItems }}
            </span>
          </div>
          <span
            class="hidden md:inline text-[13px] font-black text-blue-900 transition-colors duration-300 group-hover:text-blue-600 uppercase tracking-wider"
            >Keranjang</span
          >
        </RouterLink>

        <template v-if="isAuthenticated">
          <RouterLink
            to="/member/dashboard"
            class="hidden md:flex bg-[#064e3b] text-white px-7 py-3 rounded-2xl text-[11px] font-black items-center space-x-3 shadow-lg shadow-emerald-950/10 hover:shadow-emerald-950/20 hover:bg-[#022c22] transition-all duration-300 active:scale-95 group border border-white/10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 text-amber-400 transition-transform duration-300 group-hover:scale-110"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2.5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
            <span class="uppercase tracking-[0.2em]">Dashboard Anda</span>
          </RouterLink>
        </template>

        <template v-else>
          <RouterLink
            to="/login"
            class="hidden md:flex bg-[#1a237e] text-white px-7 py-3 rounded-2xl text-[11px] font-black items-center space-x-3 shadow-lg shadow-blue-900/10 hover:shadow-blue-900/20 hover:bg-[#121858] transition-all duration-300 active:scale-95 group border border-white/10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 text-amber-400 transition-transform duration-300 group-hover:scale-110"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clip-rule="evenodd"
              />
            </svg>
            <span class="uppercase tracking-[0.2em]">Login / Register</span>
          </RouterLink>
        </template>

        <button
          class="md:hidden p-2 text-[#1a237e] focus:outline-none"
          @click="isMenuOpen = !isMenuOpen"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
      </div>
    </nav>

    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        class="fixed inset-0 z-[150] md:hidden transition-all duration-500"
        :class="isMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'"
      >
        <div
          class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-500 ease-in-out"
          :class="isMenuOpen ? 'opacity-100' : 'opacity-0'"
          @click="isMenuOpen = false"
        />

        <div
          class="absolute right-0 top-0 bottom-0 w-[320px] bg-white shadow-2xl p-6 overflow-y-auto transition-transform duration-500 ease-in-out"
          :class="isMenuOpen ? 'translate-x-0' : 'translate-x-full'"
        >
          <div class="flex flex-col items-center mb-8">
            <div class="flex justify-between items-center w-full mb-6">
              <img
                v-if="shopLogo"
                :src="shopLogo"
                class="h-8 object-contain"
                alt="Logo Toko Emas"
              />
              <button
                class="p-2 text-slate-400 hover:text-slate-600 bg-slate-50 rounded-full"
                @click="isMenuOpen = false"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div class="mb-7 px-2">
            <h3
              class="text-[10px] font-medium text-slate-400 uppercase tracking-[0.3em]"
            >
              Menu Navigasi
            </h3>
          </div>

          <div class="space-y-8">
            <RouterLink
              to="/"
              class="flex items-center space-x-5 group"
              @click="isMenuOpen = false"
            >
              <div
                class="w-11 h-11 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </div>
              <span class="text-[15px] font-medium text-slate-800"
                >Beranda</span
              >
            </RouterLink>

            <RouterLink
              to="/produk"
              class="flex items-center space-x-5 group"
              @click="isMenuOpen = false"
            >
              <div
                class="w-11 h-11 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-14v10m0-10l-8 4m0 0v10l8 4"
                  />
                </svg>
              </div>
              <span class="text-[15px] font-medium text-slate-800">Produk</span>
            </RouterLink>

            <RouterLink
              to="/login"
              class="flex items-center space-x-5 group"
              @click="isMenuOpen = false"
            >
              <div
                class="w-11 h-11 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
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
              <span class="text-[15px] font-medium text-slate-800"
                >Order Saya</span
              >
            </RouterLink>

            <RouterLink
              to="/login"
              class="flex items-center space-x-5 group"
              @click="isMenuOpen = false"
            >
              <div
                class="w-11 h-11 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <span class="text-[15px] font-medium text-slate-800"
                >Profil Saya</span
              >
            </RouterLink>

            <template v-if="isAuthenticated">
              <RouterLink
                to="/member/dashboard"
                class="flex items-center space-x-4 bg-[#064e3b] hover:bg-[#022c22] p-4 rounded-[1.8rem] shadow-lg shadow-emerald-950/10 transition-all active:scale-95 group"
                @click="isMenuOpen = false"
              >
                <div
                  class="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-amber-400 backdrop-blur-sm"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2.5"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    />
                  </svg>
                </div>
                <span class="text-[16px] font-medium text-white tracking-tight"
                  >Dashboard Anda</span
                >
              </RouterLink>
            </template>

            <template v-else>
              <RouterLink
                to="/login"
                class="flex items-center space-x-4 bg-[#1a237e] hover:bg-[#121858] p-4 rounded-[1.8rem] shadow-lg shadow-blue-900/10 transition-all active:scale-95 group"
                @click="isMenuOpen = false"
              >
                <div
                  class="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-amber-400 backdrop-blur-sm"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <span class="text-[16px] font-medium text-white tracking-tight"
                  >Login / Register</span
                >
              </RouterLink>
            </template>
          </div>
        </div>
      </div>
    </transition>
  </header>
</template>
