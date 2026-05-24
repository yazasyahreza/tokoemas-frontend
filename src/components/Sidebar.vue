<script setup>
// 🔥 PERBAIKAN 1: onUnmounted ditambahkan ke dalam import!
import { useCartStore } from "../stores/cart";
import { ref, onMounted, onUnmounted } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";

const cartStore = useCartStore();
const route = useRoute();
const router = useRouter();
const isMobileMenuOpen = ref(false);

// State untuk menampung sesi data user secara reaktif
const user = ref({});

const loadUserData = () => {
  const savedUser = localStorage.getItem("user");
  if (savedUser) {
    try {
      user.value = JSON.parse(savedUser);
    } catch (e) {
      console.error("Gagal membaca session user:", e);
    }
  }
};

// 🔥 PERBAIKAN 2: Dua onMounted digabung jadi satu agar kodenya bersih
onMounted(() => {
  loadUserData();
  window.addEventListener("profile-updated", loadUserData);
});

onUnmounted(() => {
  window.removeEventListener("profile-updated", loadUserData);
});

// Fungsi untuk mengecek kesesuaian halaman aktif
const isActive = (path) => {
  return route.path === path || route.path.startsWith(`${path}/`);
};

const getAvatarUrl = (avatarPath) => {
  if (!avatarPath) return "";

  // Jika avatar sudah berupa URL lengkap (misal dari Google/URL luar), langsung tampilkan
  if (avatarPath.startsWith("http")) {
    return avatarPath;
  }

  // Gabungkan URL backend dengan nama file
  const BACKEND_URL = "http://localhost/toko-emas-main";
  return `${BACKEND_URL}/uploads/avatars/${avatarPath}`;
};

const navigateWithDelay = (path) => {
  // Jika dibuka di HP dan menu sedang terbuka
  if (window.innerWidth < 768 && isMobileMenuOpen.value) {
    isMobileMenuOpen.value = false; // Trigger animasi tutup sidebar

    // Tunda perpindahan rute selama 300ms (menunggu animasi Tailwind selesai)
    setTimeout(() => {
      router.push(path);
    }, 300);
  } else {
    // Jika di layar besar (desktop), langsung pindah tanpa jeda
    router.push(path);
  }
};

const navigateToProfile = () => {
  // Tunda 200ms agar efek animasi tombol (scale) terlihat mulus oleh mata
  setTimeout(() => {
    router.push("/member/profile");
  }, 200);
};

const handleLogout = () => {
  const yakinKeluar = window.confirm("Apakah Anda yakin ingin keluar dari akun ini?");

  if (!yakinKeluar) {
    return; 
  }
  
  localStorage.removeItem("token");
  localStorage.removeItem("user"); 
  cartStore.clearCart();
  router.push("/login");
};
</script>

<template>
  <div
    class="md:hidden bg-white border-b border-slate-100 p-4 flex justify-between items-center sticky top-0 z-40 shadow-sm"
  >
    <button
      @click="isMobileMenuOpen = !isMobileMenuOpen"
      class="p-2 bg-slate-50 border border-slate-100 rounded-xl active:scale-95 transition-all relative z-[60]"
    >
      <svg
        v-if="!isMobileMenuOpen"
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5 text-slate-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5 text-slate-600"
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

    <div class="flex items-center gap-3">
      <div class="flex flex-col items-end">
        <span
          class="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-0.5"
        >
          Selamat Datang,
        </span>
        <span class="text-sm font-black text-slate-800 truncate max-w-[120px]">
          {{ user.name || "Member" }}
        </span>
      </div>

      <button
        @click="navigateToProfile()"
        class="w-10 h-10 rounded-full bg-gradient-to-br from-[#1a237e] to-[#2a36b1] text-white flex items-center justify-center font-black text-sm border-2 border-white shadow-md active:scale-95 transition-all cursor-pointer focus:outline-none overflow-hidden shrink-0"
      >
        <img
          v-if="user.avatar"
          :src="getAvatarUrl(user.avatar) + '?t=' + new Date().getTime()"
          alt="Foto Profil"
          class="w-full h-full object-cover"
        />
        <span v-else>
          {{ user.name ? user.name.charAt(0).toUpperCase() : "S" }}
        </span>
      </button>
    </div>
  </div>

  <aside
    :class="[
      isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
      'w-72 bg-white border-r border-slate-100 p-6 flex flex-col justify-between fixed top-0 left-0 z-50 h-screen transition-transform duration-300 ease-in-out overflow-y-auto',
    ]"
  >
    <div class="space-y-6">
      <div
        class="pb-4 mb-2 border-b border-slate-100 flex justify-start items-center"
      >
        <RouterLink
          to="/"
          class="transition-transform duration-300 hover:scale-102"
        >
          <img
            src="https://www.butikemaslogammuliastore.com/_next/image?url=%2Flogo.webp&w=256&q=75"
            class="h-8 md:h-9 object-contain"
            alt="Logo Logam Mulia"
          />
        </RouterLink>
      </div>

      <div>
        <span
          class="block text-[11px] font-extrabold text-slate-400 uppercase tracking-[0.2em] mb-3 px-3"
          >Dashboard</span
        >
        <button
          @click="navigateWithDelay('/member/dashboard')"
          :class="[
            isActive('/member/dashboard')
              ? 'bg-[#00a279] text-white shadow-lg shadow-emerald-700/20 font-bold'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-semibold',
            'w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 text-sm active:scale-[0.98] text-left focus:outline-none',
          ]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 shrink-0"
            :class="
              isActive('/member/dashboard')
                ? 'text-amber-300'
                : 'text-slate-400'
            "
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
          <span>Dashboard</span>
        </button>
      </div>

      <div>
        <span
          class="block text-[11px] font-extrabold text-slate-400 uppercase tracking-[0.2em] mb-3 px-3"
          >Transaksi</span
        >
        <div class="space-y-1">
          <button
            @click="navigateWithDelay('/member/orders')"
            :class="[
              isActive('/member/orders')
                ? 'bg-[#00a279] text-white shadow-lg shadow-emerald-700/20 font-bold'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-semibold',
              'w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 text-sm active:scale-[0.98] text-left focus:outline-none',
            ]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 shrink-0"
              :class="
                isActive('/member/orders') ? 'text-amber-300' : 'text-slate-400'
              "
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
            <span>Order Saya</span>
          </button>

          <button
            @click="navigateWithDelay('/member/transactions')"
            :class="[
              isActive('/member/transactions')
                ? 'bg-[#00a279] text-white shadow-lg shadow-emerald-700/20 font-bold'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-semibold',
              'w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 text-sm active:scale-[0.98] text-left focus:outline-none',
            ]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 shrink-0"
              :class="
                isActive('/member/transactions')
                  ? 'text-amber-300'
                  : 'text-slate-400'
              "
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2.5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <span>Transaksi</span>
          </button>
        </div>
      </div>

      <div>
        <span
          class="block text-[11px] font-extrabold text-slate-400 uppercase tracking-[0.2em] mb-3 px-3"
          >Pengaturan</span
        >
        <div class="space-y-1">
          <button
            @click="navigateWithDelay('/member/payment-methods')"
            :class="[
              isActive('/member/payment-methods')
                ? 'bg-[#00a279] text-white shadow-lg shadow-emerald-700/20 font-bold'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-semibold',
              'w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 text-sm active:scale-[0.98] text-left focus:outline-none',
            ]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 shrink-0"
              :class="
                isActive('/member/payment-methods')
                  ? 'text-amber-300'
                  : 'text-slate-400'
              "
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2.5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
            <span>Rekening Pembayaran</span>
          </button>

          <button
            @click="navigateWithDelay('/member/profile')"
            :class="[
              isActive('/member/profile')
                ? 'bg-[#00a279] text-white shadow-lg shadow-emerald-700/20 font-bold'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-semibold',
              'w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 text-sm active:scale-[0.98] text-left focus:outline-none',
            ]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 shrink-0"
              :class="
                isActive('/member/profile')
                  ? 'text-amber-300'
                  : 'text-slate-400'
              "
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2.5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M16 7a4 4 0 11-8 0 4 4 0 0118 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span>Profil</span>
          </button>
        </div>
      </div>
    </div>

    <div class="mt-8 pt-6 border-t border-slate-100 space-y-4">
      <div
        class="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col"
      >
        <span
          class="text-sm font-black uppercase text-slate-800 tracking-wide"
          >{{ user.name }}</span
        >
        <span class="text-xs text-slate-400 truncate mt-0.5">{{
          user.email
        }}</span>
      </div>

      <button
        @click="handleLogout"
        class="w-full bg-[#f2811d] hover:bg-[#d96e14] text-white font-extrabold py-3.5 rounded-xl transition-all duration-300 text-xs uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-orange-500/10"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2.5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
        <span>Keluar</span>
      </button>
    </div>
  </aside>

  <div
    v-if="isMobileMenuOpen"
    @click="isMobileMenuOpen = false"
    class="md:hidden fixed inset-0 bg-slate-900/30 z-30 transition-opacity backdrop-blur-xs"
  ></div>
</template>
