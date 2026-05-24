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

const handleLogin = async () => {
  try {
    isLoading.value = true;

    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: loginForm.value.email,
      password: loginForm.value.password,
    });

    // 🔥 PERBAIKAN: Sesuaikan dengan format respons json_response murni backend
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

      alert("Selamat datang kembali! Login Berhasil.");
      
      const redirectPath = localStorage.getItem("redirectAfterLogin");

      if (redirectPath) {
        localStorage.removeItem("redirectAfterLogin");
        router.push(redirectPath);
      } else {
        router.push("/member/dashboard");
      }
    } else {
      alert(response.data.message || "Login gagal, periksa kembali akun Anda!");
    }
  } catch (error) {
    console.error("Eror login:", error);
    if (error.response && error.response.data) {
      alert(
        error.response.data.message ||
          "Email atau Password yang Anda masukkan salah!",
      );
    } else {
      alert("Koneksi ke server backend terputus!");
    }
  } finally {
    isLoading.value = false;
  }
};
</script>
