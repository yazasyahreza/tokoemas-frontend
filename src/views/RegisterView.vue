<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center py-12 px-6 bg-slate-100"
  >
    <div class="animate-register flex flex-col items-center w-full">
      <RouterLink
        :to="{ path: '/' }"
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
        class="register-card bg-white w-full max-w-[550px] rounded-[40px] p-10 md:p-12 text-center"
      >
        <div class="mb-8">
          <img
            src="https://www.butikemaslogammuliastore.com/_next/image?url=%2Flogo.webp&w=256&q=75"
            alt="Logo Logam Mulia"
            class="h-16 mx-auto object-contain"
          />
        </div>

        <h1
          class="text-[#0F172A] text-2xl font-extrabold mb-2 uppercase tracking-tight"
        >
          DAFTAR MEMBER
        </h1>
        <p class="text-slate-500 text-sm mb-10">
          Lengkapi data diri Anda untuk mulai berinvestasi
        </p>

        <form @submit.prevent="handleRegister" class="text-left space-y-7">
          <div>
            <label
              class="block text-[10px] font-extrabold text-slate-800 uppercase tracking-widest mb-2"
              >NAMA LENGKAP (Sesuai KTP)</label
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <input
                type="text"
                v-model="regForm.name"
                placeholder="Masukkan nama lengkap Anda"
                required
                class="bg-transparent w-full outline-none text-sm text-slate-700 placeholder-slate-400"
              />
            </div>
          </div>

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
                v-model="regForm.email"
                placeholder="name@example.com"
                required
                class="bg-transparent w-full outline-none text-sm text-slate-700 placeholder-slate-400"
              />
            </div>
          </div>

          <div>
            <label
              class="block text-[10px] font-extrabold text-slate-800 uppercase tracking-widest mb-2"
              >NOMOR WHATSAPP</label
            >
            <div
              class="input-focus flex items-center bg-[#F8FAFC] border border-slate-200 rounded-2xl px-5 py-4 transition-all"
            >
              <span class="text-sm font-bold text-slate-400 mr-2">+62</span>
              <input
                type="tel"
                v-model="regForm.phone"
                placeholder="8123456789"
                required
                class="bg-transparent w-full outline-none text-sm text-slate-700 placeholder-slate-400"
              />
            </div>
          </div>

          <div>
            <label
              class="block text-[10px] font-extrabold text-slate-800 uppercase tracking-widest mb-2"
              >BUAT PASSWORD</label
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
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <input
                type="password"
                v-model="regForm.password"
                placeholder="Minimal 6 karakter"
                required
                class="bg-transparent w-full outline-none text-sm text-slate-700"
              />
            </div>
          </div>

          <div>
            <label
              class="block text-[10px] font-extrabold text-slate-800 uppercase tracking-widest mb-2"
              >Konfirmasi Password</label
            >
            <div
              class="input-focus flex flex-col items-start bg-[#F8FAFC] border rounded-2xl px-5 py-4 transition-all w-full"
              :class="{ 'border-red-500 bg-red-50/30': passwordMismatch }"
            >
              <div class="flex items-center w-full">
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
                  type="password"
                  v-model="regForm.confirmPassword"
                  placeholder="Ulangi Kata Sandi"
                  class="bg-transparent w-full outline-none text-sm text-slate-700"
                  required
                />
              </div>
              <p
                v-if="passwordMismatch"
                class="text-[10px] font-bold text-red-500 mt-2 uppercase tracking-tighter"
              >
                Kata sandi tidak cocok!
              </p>
            </div>
          </div>

          <div class="flex items-start">
            <label class="flex items-center group cursor-pointer">
              <input
                type="checkbox"
                required
                class="mt-1 w-4 h-4 rounded border-slate-300 text-[#3B82F6] focus:ring-[#3B82F6]"
              />
              <span
                class="ml-3 text-[12px] font-bold text-slate-600 leading-relaxed"
              >
                Saya setuju dengan
                <a href="#" class="text-[#0085FF] hover:underline"
                  >Syarat & Ketentuan</a
                >
                serta
                <a href="#" class="text-[#0085FF] hover:underline"
                  >Kebijakan Privasi</a
                >
                yang berlaku.
              </span>
            </label>
          </div>

          <div class="pt-4">
            <button
              type="submit"
              :disabled="isLoading || passwordMismatch"
              class="w-full bg-[#3B82F6] hover:bg-[#2563EB] disabled:bg-slate-400 text-white font-extrabold py-5 rounded-[20px] transition-all shadow-lg shadow-blue-200 uppercase tracking-widest text-sm active:scale-95"
            >
              <span v-if="isLoading">MEMBENTUK AKUN...</span>
              <span v-else>DAFTAR SEKARANG</span>
            </button>
          </div>
        </form>

        <div class="mt-12">
          <p class="text-xs font-bold text-slate-500">
            Sudah punya akun?
            <RouterLink to="/login" class="text-[#0085FF] hover:underline"
              >Masuk di Sini</RouterLink
            >
          </p>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();
const isLoading = ref(false);

// Properti form pendaftaran menyertakan 'phone'
const regForm = ref({
  name: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
});

const BACKEND_URL = "http://localhost/toko-emas-main";
const API_BASE_URL = `${BACKEND_URL}/index.php/api/v1`;

// Cek validasi kecocokan sandi secara reaktif
const passwordMismatch = computed(() => {
  if (!regForm.value.password || !regForm.value.confirmPassword) return false;
  return regForm.value.password !== regForm.value.confirmPassword;
});

const handleRegister = async () => {
  if (passwordMismatch.value) return;

  try {
    isLoading.value = true;

    const response = await axios.post(`${API_BASE_URL}/auth/register`, {
      name: regForm.value.name,
      email: regForm.value.email,
      phone: regForm.value.phone || "",
      password: regForm.value.password,
    });

    if (
      response.data &&
      (response.data.status === true ||
        response.data.success === true ||
        response.status === 210 ||
        response.status === 201)
    ) {
      alert(
        "Pendaftaran Sukses! Akun Anda telah berhasil dibuat. Silakan klik OK untuk masuk ke halaman Login.",
      );
      router.push("/login");
    }
  } catch (error) {
    console.error("Eror registrasi:", error);
    if (error.response && error.response.data) {
      if (error.response.data.data && error.response.data.data.errors) {
        const errObj = error.response.data.data.errors;
        alert(Object.values(errObj).join("\n"));
      } else {
        alert(
          error.response.data.message ||
            "Registrasi gagal, periksa kembali data Anda!",
        );
      }
    } else {
      alert("Koneksi ke backend bermasalah!");
    }
  } finally {
    isLoading.value = false;
  }
};
</script>
