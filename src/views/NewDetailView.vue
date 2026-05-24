<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

// Sesuaikan URL Backend
const BACKEND_URL = "http://localhost/toko-emas-main";
const API_BASE_URL = `${BACKEND_URL}/index.php/api/v1`;

const route = useRoute();
const router = useRouter();

const isLoading = ref(true);
const berita = ref(null);

const fetchDetailBerita = async () => {
  try {
    isLoading.value = true;
    const slug = route.params.slug;

    // Tembak API backend berdasarkan slug
    const response = await axios.get(`${API_BASE_URL}/news/detail/${slug}`);

    if (response.data && response.data.status) {
      const data = response.data.data;

      berita.value = {
        ...data,
        // Format tanggal jika ada created_at
        tanggal: data.created_at
          ? new Date(data.created_at).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })
          : "",
        // Rakit URL gambar
        image:
          data.image &&
          (data.image.startsWith("http") || data.image.startsWith("https"))
            ? data.image
            : `${BACKEND_URL}/uploads/news/${data.image}`,
      };

      // Ubah judul tab browser otomatis sesuai judul berita
      document.title = `${data.title} | Logam Mulia TBK`;
    } else {
      // Jika berita tidak ditemukan atau status false
      router.push("/");
    }
  } catch (error) {
    console.error("Gagal mengambil detail berita:", error);
    router.push("/");
  } finally {
    isLoading.value = false;
  }
};

const goBack = () => {
  router.go(-1); // Kembali ke halaman sebelumnya
};

onMounted(() => {
  fetchDetailBerita();
});
</script>

<template>
  <main class="bg-slate-50 min-h-screen py-10 md:py-16">
    <div class="container mx-auto px-4 lg:px-20 max-w-5xl">
      <div v-if="isLoading" class="text-center py-20">
        <p class="text-slate-500 font-medium animate-pulse">
          Memuat artikel berita...
        </p>
      </div>

      <article
        v-else-if="berita"
        class="bg-white rounded-[2rem] p-6 md:p-12 shadow-sm border border-slate-100 relative"
      >
        <button
          @click="goBack"
          class="flex items-center space-x-2 text-sm font-bold text-slate-400 hover:text-amber-500 transition-colors mb-8 group"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 group-hover:-translate-x-1 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          <span class="uppercase tracking-widest">Kembali</span>
        </button>

        <header class="mb-8 text-center max-w-3xl mx-auto">
          <div
            class="inline-block bg-blue-50 text-blue-800 text-[10px] md:text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider mb-4"
          >
            Berita & Promo
          </div>
          <h1
            class="text-2xl md:text-4xl font-extrabold text-[#1a237e] leading-snug mb-4"
          >
            {{ berita.title }}
          </h1>
          <p v-if="berita.tanggal" class="text-sm text-slate-400 font-medium">
            Dipublikasikan pada {{ berita.tanggal }}
          </p>
        </header>

        <div
          class="w-full aspect-video md:aspect-[21/9] rounded-2xl overflow-hidden mb-10 shadow-inner bg-slate-100"
        >
          <img
            :src="berita.image"
            :alt="berita.title"
            class="w-full h-full object-cover"
          />
        </div>

        <div class="max-w-3xl mx-auto">
          <div
            v-html="berita.content"
            class="text-base md:text-lg text-slate-700 leading-relaxed md:leading-loose space-y-6 html-content-styling"
          ></div>
        </div>
      </article>
    </div>
  </main>
</template>

<style scoped>
/* Tambahan CSS khusus agar tag HTML dari database (seperti <strong>, <em>, <ul>) tetap memiliki style yang bagus */
.html-content-styling :deep(p) {
  margin-bottom: 1.5em;
}
.html-content-styling :deep(strong),
.html-content-styling :deep(b) {
  font-weight: 800;
  color: #1e293b;
}
.html-content-styling :deep(h2) {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a237e;
  margin-top: 2em;
  margin-bottom: 1em;
}
.html-content-styling :deep(ul) {
  list-style-type: disc;
  padding-left: 1.5em;
  margin-bottom: 1.5em;
}
.html-content-styling :deep(li) {
  margin-bottom: 0.5em;
}
.html-content-styling :deep(a) {
  color: #f59e0b;
  text-decoration: underline;
  font-weight: 600;
}
</style>
