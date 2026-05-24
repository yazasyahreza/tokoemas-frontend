<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";

// 🔥 ALAMAT GERBANG ENDPOINT API BACKEND
const BACKEND_URL = "http://localhost/toko-emas-main";
const API_BASE_URL = `${BACKEND_URL}/index.php/api/v1`;

const limit = ref(12);
const selectedCategory = ref("Semua");
const searchQuery = ref("");
const sortBy = ref("terbaru");
const showToast = ref(false);
const isLoading = ref(false);

// State penampung data dinamis dari database
const categories = ref(["Semua"]); // "Semua" dikunci manual di awal
const products = ref([]);

// 🔥 FUNGSI UTAMA MENGAMBIL DATA DARI BACKEND
const fetchProductPageData = async () => {
  try {
    isLoading.value = true;

    // 1. Ambil data katalog produk dari database
    const productResponse = await axios.get(`${API_BASE_URL}/products`);

    // Mengakomodasi response.data.status maupun response.data.success
    if (
      productResponse.data &&
      (productResponse.data.success || productResponse.data.status)
    ) {
      // 🔥 TRIK AMAN: Cek apakah data langsung berbentuk Array atau objek didalamnya
      let rawProducts = [];
      if (Array.isArray(productResponse.data.data)) {
        rawProducts = productResponse.data.data;
      } else if (
        productResponse.data.data &&
        Array.isArray(productResponse.data.data.products)
      ) {
        rawProducts = productResponse.data.data.products;
      }

      // Petakan data ke dalam card
      products.value = rawProducts.map((p, index) => {
        const isExternalImage =
          p.image &&
          (p.image.startsWith("http://") || p.image.startsWith("https://"));
        const finalImage = isExternalImage
          ? p.image
          : `${BACKEND_URL}/uploads/products/${p.image}`;

        return {
          id: p.id,
          name: p.name,
          slug: p.slug,
          category: p.category_name || p.category || "Emas Batangan",
          price_num: parseFloat(p.price) || 0,
          weight: p.weight || 0,
          image: finalImage,
          stok: parseInt(p.stock) || 0,
          star: index % 3 === 0 ? "★★★★★" : index % 3 === 1 ? "★★★★" : "★★★",
          rating: index * 3 + 2,
        };
      });
    }

    // 2. Ambil data kategori-kategori dinamis dari database
    const categoryResponse = await axios.get(`${API_BASE_URL}/categories`);
    if (
      categoryResponse.data &&
      (categoryResponse.data.success || categoryResponse.data.status)
    ) {
      // 🔥 TRIK AMAN: Cek apakah kategori berbentuk Array langsung atau objek
      let rawCategories = [];
      if (Array.isArray(categoryResponse.data.data)) {
        rawCategories = categoryResponse.data.data;
      } else if (
        categoryResponse.data.data &&
        Array.isArray(categoryResponse.data.data.categories)
      ) {
        rawCategories = categoryResponse.data.data.categories;
      }

      const dynamicCategoryNames = rawCategories.map((c) => c.name);

      // Gabungkan kata "Semua" di awal dengan nama-nama kategori asli
      categories.value = ["Semua", ...dynamicCategoryNames];
    }
  } catch (error) {
    console.error("Gagal menyuplai data halaman produk! Detail:", error);
  } finally {
    isLoading.value = false;
  }
};

// Logika pemfilteran dan pengurutan (Tetap mempertahankan fungsi asli yang super cerdas)
const filteredProducts = computed(() => {
  if (!products.value) return [];

  let result = [...products.value];

  if (selectedCategory.value !== "Semua") {
    result = result.filter((p) => p.category === selectedCategory.value);
  }

  if (searchQuery.value) {
    result = result.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
    );
  }

  result.sort((a, b) => {
    if (sortBy.value === "termurah") return a.price_num - b.price_num;
    if (sortBy.value === "termahal") return b.price_num - a.price_num;
    if (sortBy.value === "nama") return a.name.localeCompare(b.name);
    return b.id - a.id;
  });

  return result;
});

const displayedProducts = computed(() =>
  filteredProducts.value.slice(0, limit.value),
);

const copyLink = (id) => {
  const url = `${window.location.origin}/detail_produk?id=${id}`;
  navigator.clipboard.writeText(url);
  showToast.value = true;
  setTimeout(() => (showToast.value = false), 2000);
};

// Fungsi pengubah format angka database menjadi Rupiah rapi
const formatPrice = (val) => {
  return "Rp " + new Intl.NumberFormat("id-ID").format(val);
};

onMounted(() => {
  fetchProductPageData();
});
</script>

<template>
  <main class="bg-[#f8fafc] pb-32">
    <section
      class="w-full h-[180px] md:h-[350px] overflow-hidden mb-6 md:mb-10"
    >
      <img
        src="https://www.butikemaslogammuliastore.com/_next/image?url=%2Fbanner.webp&w=1920&q=75&dpl=dpl_GeFqnygs3rKmdW6irXdYFzmaK5SP"
        class="w-full h-full object-cover"
      />
    </section>

    <div class="container mx-auto px-4 lg:px-20">
      <div class="flex flex-col lg:flex-row gap-8">
        <aside class="w-full lg:w-1/4">
          <div
            class="flex lg:flex-col overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 space-x-3 lg:space-x-0 lg:space-y-3 no-scrollbar"
          >
            <button
              v-for="cat in categories"
              :key="cat"
              @click="selectedCategory = cat"
              :class="
                selectedCategory === cat
                  ? 'bg-[#f3af1e] text-white shadow-md'
                  : 'bg-white text-slate-400 border border-slate-100'
              "
              class="whitespace-nowrap flex-shrink-0 lg:w-full font-extrabold py-3 lg:py-4 px-6 lg:px-4 rounded-xl uppercase tracking-widest text-[10px] lg:text-xs transition-all active:scale-95"
            >
              {{ cat }}
            </button>
          </div>
        </aside>

        <section class="flex-1">
          <div class="flex flex-col md:flex-row gap-3 md:gap-4 mb-6 md:mb-8">
            <div class="relative flex-1">
              <span class="absolute inset-y-0 left-4 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 text-slate-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </span>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Cari perhiasan..."
                class="w-full bg-white border border-slate-100 py-3 md:py-4 pl-12 pr-4 rounded-2xl outline-none focus:border-amber-300 text-sm shadow-sm"
              />
            </div>

            <div class="relative group">
              <select
                v-model="sortBy"
                class="appearance-none bg-white border border-slate-100 px-6 py-3 md:py-4 pr-12 rounded-2xl shadow-sm text-[10px] md:text-xs font-black text-[#1a237e] uppercase tracking-widest outline-none w-full md:w-auto"
              >
                <option value="terbaru">TERBARU</option>
                <option value="termurah">TERMURAH</option>
                <option value="termahal">TERMAHAL</option>
                <option value="nama">NAMA A-Z</option>
              </select>
              <div
                class="absolute inset-y-0 right-4 flex items-center pointer-events-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 text-[#1a237e]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div
            v-if="isLoading"
            class="text-center py-20 text-slate-400 font-bold text-sm tracking-widest uppercase"
          >
            Sedang mensinkronisasikan brankas produk...
          </div>

          <div
            v-else
            class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6"
          >
            <article
              v-for="item in displayedProducts"
              :key="item.id"
              class="bg-white rounded-2xl md:rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col group transition-all"
            >
              <div
                class="relative aspect-square bg-[#f1f5f9] flex items-center justify-center overflow-hidden"
              >
                <img
                  :src="item.image"
                  :class="[
                    'w-full h-full object-cover transition-all group-hover:scale-110 duration-500',
                    item.stok === 0 ? 'grayscale opacity-50' : '',
                  ]"
                />
                <div
                  v-if="item.stok === 0"
                  class="absolute top-2 right-2 md:top-4 md:right-4 bg-[#FF4D4D] text-white text-[8px] md:text-[10px] font-black px-2 md:px-4 py-1 rounded-full uppercase italic z-10"
                >
                  HABIS
                </div>
              </div>

              <div class="p-3 md:p-5 flex-1 flex flex-col">
                <div class="flex items-center justify-between mb-1.5 w-full">
                  <div class="flex items-center">
                    <span
                      class="text-amber-400 text-xs md:text-lg tracking-tighter"
                      >{{ item.star }}</span
                    >
                    <span
                      class="text-slate-400 text-[9px] md:text-[11px] ml-1 font-bold"
                      >({{ item.rating }})</span
                    >
                  </div>
                </div>

                <div class="flex flex-col mb-2">
                  <div class="flex justify-between items-center w-full mb-0.5">
                    <span
                      class="text-[8px] md:text-[10px] font-extrabold text-[#3B82F6] uppercase tracking-widest"
                    >
                      {{ item.category }}
                    </span>

                    <span
                      v-if="item.weight"
                      class="text-[9px] md:text-[11px] font-black text-slate-400 uppercase px-1.5 py-0.5 rounded"
                    >
                      {{ parseFloat(item.weight) }} GR
                    </span>
                  </div>

                  <h3
                    class="text-[10px] md:text-[11px] font-black text-[#1a237e] uppercase leading-tight line-clamp-2 min-h-[24px] md:min-h-[32px]"
                  >
                    {{ item.name }}
                  </h3>
                </div>

                <p class="text-xs md:text-base font-black text-[#1a237e] mb-3">
                  {{ formatPrice(item.price_num) }}
                </p>

                <div class="flex flex-row gap-1.5 md:gap-2 mt-auto pt-2">
                  <button
                    @click="copyLink(item.id)"
                    class="flex-1 flex items-center justify-center gap-1 md:gap-1.5 py-2 bg-slate-50 text-slate-500 rounded-lg text-[8px] md:text-[10px] font-extrabold uppercase hover:bg-slate-100 transition-all active:scale-95"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-3 w-3 md:h-3.5 md:w-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                      />
                    </svg>
                    <span>SHARE</span>
                  </button>

                  <RouterLink
                    :to="`/produk/${item.id}`"
                    class="flex-1 flex items-center justify-center gap-1 md:gap-1.5 py-2 bg-[#1a237e] text-white rounded-lg text-[8px] md:text-[10px] font-extrabold uppercase hover:bg-blue-900 transition-all active:scale-95"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-3 w-3 md:h-3.5 md:w-3.5"
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
                    <span>DETAIL</span>
                  </RouterLink>
                </div>
              </div>
            </article>
          </div>

          <div
            v-if="filteredProducts.length > limit"
            class="mt-8 md:mt-12 mb-20 flex justify-center"
          >
            <button
              @click="limit = filteredProducts.length"
              class="bg-[#1a237e] text-white font-black px-8 md:px-10 py-3 md:py-4 rounded-xl md:rounded-2xl shadow-xl text-[10px] md:text-xs uppercase tracking-widest"
            >
              <span>Muat Lebih Banyak</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  </main>
</template>

<style scoped>
/* 🔥 MODIFIKASI SCROLLBAR KHUSUS MOBILE AGAR MUNCUL SECARA ESTETIK */
@media (max-width: 1023px) {
  /* Mengatur ukuran tinggi scrollbar horizontal */
  .no-scrollbar::-webkit-scrollbar {
    display: block; /* Kita munculkan kembali! */
    height: 5px; /* Ukuran super tipis agar tetap elegan */
  }

  /* Mengatur warna jalur lintasan scrollbar */
  .no-scrollbar::-webkit-scrollbar-track {
    background: #f1f5f9; /* Warna abu-abu soft cocok dengan bg body */
    border-radius: 10px;
  }

  /* Mengatur warna batang penggeser scrollbar */
  .no-scrollbar::-webkit-scrollbar-thumb {
    background: #cbd5e1; /* Warna slider abu-abu kontras */
    border-radius: 10px;
  }

  /* Efek ketika batang scrollbar sedang digeser/hover */
  .no-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
}

/* Untuk tampilan desktop (LG ke atas), scrollbar tetap kita sembunyikan agar rapi */
@media (min-width: 1024px) {
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
}
</style>
