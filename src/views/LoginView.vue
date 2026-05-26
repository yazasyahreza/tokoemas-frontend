<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-100"
  >
    <div class="animate-login flex flex-col items-center w-full">
      <RouterLink
        to="/"
        class="flex items-center text-[#0085FF] text-sm font-bold mb-8 hover:underline"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Kembali ke Beranda
      </RouterLink>

      <main
        class="login-card bg-white w-full max-w-[500px] rounded-[40px] p-12 text-center"
      >
        <div class="mb-8">
          <img
            src="https://www.butikemaslogammuliastore.com/_next/image?url=%2Flogo.webp&w=256&q=75"
            alt="Logo Logam Mulia"
            class="h-20 mx-auto object-contain"
          />
        </div>

        <h1
          class="text-[#0F172A] text-2xl font-extrabold mb-2 uppercase tracking-tight"
        >
          LOGIN MEMBER
        </h1>
        <p class="text-slate-500 text-sm mb-10">
          Masuk untuk mulai berinvestasi emas hari ini
        </p>

        <form @submit.prevent="handleLogin" class="text-left space-y-8">
          <div>
            <label
              class="block text-[10px] font-extrabold text-slate-800 uppercase tracking-widest mb-2"
              >ALAMAT EMAIL</label
            >
            <div
              class="input-focus flex items-center bg-[#F8FAFC] border border-slate-200 rounded-2xl px-5 py-4 transition-all"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-slate-400 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <input
                type="email"
                v-model="loginForm.email"
                placeholder="name@example.com"
                required
                class="bg-transparent w-full outline-none text-sm text-slate-700 placeholder-slate-400"
              />
            </div>
          </div>

          <div>
            <div class="flex justify-between items-center mb-2">
              <label
                class="text-[10px] font-extrabold text-slate-800 uppercase tracking-widest"
                >PASSWORD</label
              >
              <RouterLink
                to="/lupa-password"
                class="text-[11px] font-bold text-[#0085FF] hover:underline"
                >Lupa Password?</RouterLink
              >
            </div>
            <div
              class="input-focus flex items-center bg-[#F8FAFC] border border-slate-200 rounded-2xl px-5 py-4 transition-all"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-slate-400 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <input
                :type="showPassword ? 'text' : 'password'"
                v-model="loginForm.password"
                placeholder="••••••••"
                required
                class="bg-transparent w-full outline-none text-sm text-slate-700"
              />
              <button
                @click="showPassword = !showPassword"
                type="button"
                class="ml-2 focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  :class="showPassword ? 'text-blue-500' : 'text-slate-400'"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div class="flex items-center">
            <label class="flex items-center group cursor-pointer">
              <input
                type="checkbox"
                class="w-4 h-4 rounded border-slate-300 text-[#3B82F6] focus:ring-[#3B82F6]"
              />
              <span class="ml-3 text-[12px] font-bold text-slate-600"
                >Ingat saya di perangkat ini</span
              >
            </label>
          </div>

          <div class="pt-2">
            <button
              type="submit"
              :disabled="isLoading"
              class="w-full bg-[#3B82F6] hover:bg-[#2563EB] disabled:bg-slate-400 text-white font-extrabold py-5 rounded-[20px] transition-all shadow-lg shadow-blue-200 uppercase tracking-widest text-sm active:scale-95 flex items-center justify-center gap-2"
            >
              <span v-if="isLoading">MENGONTENTIKASI...</span>
              <span v-else>MASUK SEKARANG</span>
            </button>
          </div>
        </form>

        <div class="mt-12">
          <p class="text-xs font-bold text-slate-500">
            Belum punya akun?
            <RouterLink to="/register" class="text-[#0085FF] hover:underline"
              >Daftar Member Baru</RouterLink
            >
          </p>
        </div>
      </main>
    </div>
  </div>

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
              modalType === 'success'
                ? 'bg-emerald-100 text-emerald-500'
                : 'bg-rose-100 text-rose-500'
            "
          >
            <svg
              v-if="modalType === 'success'"
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
                d="M5 13l4 4L19 7"
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

          <button
            @click="closeModal"
            class="w-full text-white font-black py-4 rounded-2xl uppercase text-xs tracking-widest transition-all active:scale-95 shadow-lg"
            :class="
              modalType === 'success'
                ? 'bg-[#3B82F6] hover:bg-[#2563EB] shadow-blue-200'
                : 'bg-rose-500 hover:bg-rose-600 shadow-rose-200'
            "
          >
            {{ modalType === "success" ? "Lanjutkan" : "Mengerti" }}
          </button>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { useCartStore } from "../stores/cart";

const router = useRouter();
const cartStore = useCartStore();
const showPassword = ref(false);
const isLoading = ref(false);
const loginForm = ref({ email: "", password: "" });

// 🔥 ALAMAT GERBANG ENDPOINT API BACKEND
const BACKEND_URL = "http://localhost/toko-emas-main";
const API_BASE_URL = `${BACKEND_URL}/index.php/api/v1`;

// ==========================================
// 🔥 STATE & FUNGSI UNTUK MODAL NOTIFIKASI
// ==========================================
const showModal = ref(false);
const modalType = ref("success"); // 'success' atau 'error'
const modalTitle = ref("");
const modalMessage = ref("");
const modalAction = ref(null);

const openModal = (type, title, message, action = null) => {
  modalType.value = type;
  modalTitle.value = title;
  modalMessage.value = message;
  modalAction.value = action;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  if (modalAction.value) {
    modalAction.value(); // Eksekusi fungsi lanjutan (misal pindah halaman)
  }
};

const handleLogin = async () => {
  try {
    isLoading.value = true;

    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: loginForm.value.email,
      password: loginForm.value.password,
    });

    if (
      response.data &&
      (response.data.status === true || response.data.success === true)
    ) {
      // Simpan token JWT dan data user ke localStorage
      localStorage.setItem("token", response.data.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.data.user));

      try {
        await cartStore.syncCart();
      } catch (syncError) {
        console.warn("Sinkronisasi keranjang tertunda:", syncError);
      }

      const redirectPath = localStorage.getItem("redirectAfterLogin");

      if (redirectPath) {
        // 🔥 JALUR 1: LOGIN DARI CHECKOUT
        localStorage.removeItem("redirectAfterLogin");
        openModal(
          "success",
          "Login Berhasil!",
          "Selamat datang kembali! Anda akan diarahkan kembali ke halaman Checkout untuk melanjutkan pesanan emas Anda.",
          () => router.push(redirectPath),
        );
      } else {
        // 🔥 JALUR 2: LOGIN NORMAL KE DASHBOARD
        openModal(
          "success",
          "Login Berhasil!",
          "Selamat datang kembali! Mari pantau portofolio investasi Logam Mulia Anda hari ini.",
          () => router.push("/member/dashboard"),
        );
      }
    } else {
      openModal(
        "error",
        "Login Gagal",
        response.data.message || "Periksa kembali akun Anda!",
      );
    }
  } catch (error) {
    console.error("Eror login:", error);
    if (error.response && error.response.data) {
      openModal(
        "error",
        "Akses Ditolak",
        error.response.data.message ||
          "Email atau Password yang Anda masukkan salah!",
      );
    } else {
      openModal(
        "error",
        "Koneksi Terputus",
        "Koneksi ke server backend terputus! Pastikan server menyala.",
      );
    }
  } finally {
    isLoading.value = false;
  }
};
</script>
