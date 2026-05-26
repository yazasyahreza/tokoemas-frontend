<script setup>
import { ref, onMounted, computed, watch } from "vue"; // 🔥 Tambahkan computed di sini
import { useRoute, useRouter } from "vue-router";
import { useCartStore } from "../stores/cart";
import axios from "axios";

// 🔥 ALAMAT GERBANG ENDPOINT API BACKEND
const BACKEND_URL = "http://localhost/toko-emas-main";
const API_BASE_URL = `${BACKEND_URL}/index.php/api/v1`;

const route = useRoute();
const router = useRouter();
const qty = ref(1);
const product = ref(null);
const showToast = ref(false);
const cartStore = useCartStore();
const isLoading = ref(false);
const showZoomModal = ref(false);
const zoomedImageUrl = ref("");

// 🔥 SUNTIKKAN STATE UNTUK MENAMPUNG SELURUH KOLEKSI PRODUK DATABASE
const rawProductsList = ref([]);

const openZoomModal = (imgName) => {
  // Ganti url sesuai konstanta BACKEND_URL Bos
  zoomedImageUrl.value = `${BACKEND_URL}/uploads/reviews/${imgName}`;
  showZoomModal.value = true;
};

const closeZoomModal = () => {
  showZoomModal.value = false;
};

// 🔥 AMANKAN VARIABEL ALIAS UNTUK KOLEKSI TERKAIT DI TEMPLATE BAWAHAN
const allProducts = computed(() => rawProductsList.value);

// 🔥 FUNGSI UTAMA DETAIL PRODUK + REVIEW DINAMIS (VERSI AMAN & ANTI-BERANTAKAN)
const fetchProductDetail = async () => {
  try {
    isLoading.value = true;
    const productId = route.params.id;

    // 1. Ambil list massal produk dari API untuk data cadangan & Koleksi Terkait
    const response = await axios.get(`${API_BASE_URL}/products`);

    if (response.data) {
      let rawProducts = [];
      if (Array.isArray(response.data.products)) {
        rawProducts = response.data.products;
      } else if (
        response.data.data &&
        Array.isArray(response.data.data.products)
      ) {
        rawProducts = response.data.data.products;
      } else if (Array.isArray(response.data.data)) {
        rawProducts = response.data.data;
      }

      // Suplai data untuk Koleksi Terkait di bawah
      rawProductsList.value = rawProducts.map((p) => {
        // 🔥 LOGIKA PERAKITAN GAMBAR LOKAL
        const isExternalImage =
          p.image &&
          (p.image.startsWith("http://") || p.image.startsWith("https://"));
        const finalImage = isExternalImage
          ? p.image
          : `${BACKEND_URL}/uploads/products/${p.image}`;

        return {
          id: p.id,
          name: p.name,
          category: p.category_name || p.category || "Emas Batangan",
          price:
            "Rp " +
            new Intl.NumberFormat("id-ID").format(parseFloat(p.price) || 0),
          image: finalImage,

          stok: parseInt(p.stok) || parseInt(p.stock) || 0,
          rating: parseInt(p.id) * 3 + 2,
        };
      });

      // Cari produk berdasarkan ID URL
      const foundProduct = rawProducts.find((p) => p.id == productId);

      if (foundProduct) {
        // Amankan data dasar dari list massal terlebih dahulu
        let d = { ...foundProduct };

        // 2. Tembak detail spesifik berdasarkan SLUG untuk menarik review dari Product_model.php
        try {
          const detailResponse = await axios.get(
            `${API_BASE_URL}/products/${foundProduct.slug}`,
          );
          if (detailResponse.data) {
            // Gabungkan data agar properti slug tidak menimpa data stok asli massal
            const incomingData =
              detailResponse.data.product ||
              detailResponse.data.data ||
              detailResponse.data;
            d = { ...d, ...incomingData };
          }
        } catch (slugError) {
          console.warn(
            "Endpoint slug belum merespon, menggunakan data massal!",
            slugError,
          );
        }

        // Kunci penamaan variabel stok & harga agar tidak menjadi 0 atau Habis
        const finalStock =
          parseInt(d.stok) !== undefined && !isNaN(parseInt(d.stok))
            ? parseInt(d.stok)
            : parseInt(d.stock) || 0;
        const finalPrice = parseFloat(d.price) || 0;

        // 🔥 LOGIKA KALKULATOR DISTRIBUSI BINTANG REVIEW DATABASE
        const productReviews = Array.isArray(d.reviews) ? d.reviews : [];
        const totalReviews = productReviews.length;
        const avgRating = parseFloat(d.average_rating) || 0.0;

        // Hitung persebaran bintang (5,4,3,2,1)
        const starDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        productReviews.forEach((rev) => {
          const r = Math.round(parseFloat(rev.rating));
          if (starDistribution[r] !== undefined) {
            starDistribution[r]++;
          }
        });

        const isExternalDetailImage =
          d.image &&
          (d.image.startsWith("http://") || d.image.startsWith("https://"));
        const finalDetailImage = isExternalDetailImage
          ? d.image
          : `${BACKEND_URL}/uploads/products/${d.image}`;

        // Masukkan data utuh ke dalam state reaktif tanpa merusak layout atas
        product.value = {
          id: d.id,
          name: d.name,
          category: d.category_name || d.category || "Emas Batangan",
          price_num: finalPrice,
          price: "Rp " + new Intl.NumberFormat("id-ID").format(finalPrice),
          image: finalDetailImage,
          stok: finalStock,
          weight: d.weight || 0,
          description:
            d.description || d.deskripsi || "Tidak ada deskripsi produk.",
          rating_avg_num: avgRating.toFixed(1),
          rating_avg_float: avgRating,
          rating: totalReviews,
          reviews_list: productReviews,
          distribution: starDistribution,
        };
      } else {
        console.error("Produk tidak ditemukan!");
        router.push("/produk");
      }
    }
  } catch (error) {
    console.error("Gagal menyinkronkan detail ulasan! Detail:", error);
  } finally {
    isLoading.value = false;
  }
};

const addToCart = async () => {
  if (!product.value) return;

  await cartStore.addToCart(product.value, qty.value);
};

const buyNow = async () => {
  if (!product.value) return;
  await cartStore.addToCart(product.value, qty.value);
  router.push("/checkout");
};

watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      qty.value = 1; // Reset jumlah pembelian kembali ke 1 demi kenyamanan UX
      fetchProductDetail(); // Jalankan ulang pengisap database
    }
  },
);

onMounted(() => {
  window.scrollTo(0, 0);
  fetchProductDetail();
});

const copyLink = (productId) => {
  const productUrl = window.location.href;
  navigator.clipboard.writeText(productUrl).then(() => {
    showToast.value = true;
    setTimeout(() => {
      showToast.value = false;
    }, 3000);
  });
};
</script>

<template>
  <div v-if="product" class="flex-grow">
    <main class="container mx-auto px-0 md:px-20 py-0 md:py-10">
      <nav
        class="flex items-center text-[10px] md:text-[12px] font-bold uppercase tracking-[0.1em] py-4 px-4 md:px-0"
      >
        <RouterLink
          to="/"
          class="text-slate-400 hover:text-blue-900 transition-colors"
          >Home</RouterLink
        >
        <span class="mx-2 md:mx-3 text-slate-300">/</span>
        <RouterLink
          to="/produk"
          class="text-slate-400 hover:text-blue-900 transition-colors"
          >Produk</RouterLink
        >
        <span class="mx-2 md:mx-3 text-slate-300">/</span>
        <span class="text-blue-900 truncate">{{ product.name }}</span>
      </nav>

      <div class="flex flex-col md:flex-row gap-0 md:gap-12 items-start">
        <div class="w-full md:w-1/2">
          <div class="relative">
            <div class="absolute top-4 left-4 z-10">
              <div
                class="bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow-sm border border-slate-100"
              >
                <span
                  class="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]"
                  >{{ product.category }}</span
                >
              </div>
            </div>

            <div
              class="aspect-square w-full flex items-center justify-center overflow-hidden rounded-none md:rounded-[2rem]"
            >
              <img
                :src="product.image"
                class="w-full h-full object-cover transition-all duration-500 rounded-none border-none scale-101"
                :class="{ 'grayscale opacity-60': product.stok === 0 }"
                :alt="product.name"
              />
            </div>
          </div>
        </div>

        <div class="w-full md:w-1/2 px-4 md:px-0 py-8 md:py-4">
          <div class="flex items-center gap-2 mb-4">
            <div
              class="flex text-amber-400 text-xs md:text-sm tracking-tighter"
            >
              {{ product.star }}
            </div>
            <span class="text-[10px] md:text-[12px] text-slate-400 font-bold">
              ({{ product.rating }} Penilaian)
            </span>
          </div>

          <h1
            class="text-xl md:text-4xl font-black text-[#1a237e] uppercase leading-[1.2] mb-6 tracking-tight"
          >
            {{ product.name }}
          </h1>

          <div class="flex items-baseline gap-3 mb-8">
            <span class="text-2xl md:text-4xl font-black text-[#1a237e]">
              {{ product.price }}
            </span>
            <span
              v-if="product.stok > 0"
              class="text-[10px] md:text-[11px] font-bold text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-widest"
            >
              Stok Tersedia
            </span>
            <span
              v-else
              class="text-[10px] md:text-[11px] font-bold text-red-500 bg-red-50 px-3 py-1 rounded-full uppercase tracking-widest"
            >
              Stok Habis
            </span>
          </div>

          <div class="space-y-6 mb-10">
            <div class="flex flex-col gap-3">
              <label
                class="text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]"
              >
                Jumlah Pembelian
              </label>
              <div class="flex items-center gap-6">
                <div
                  class="grid grid-cols-3 w-32 md:w-36 bg-slate-100 rounded-2xl p-1 shadow-inner items-center"
                >
                  <button
                    @click="qty > 1 && qty--"
                    :disabled="product.stok === 0"
                    class="flex items-center justify-center text-blue-900 hover:bg-white rounded-xl transition-all font-bold disabled:opacity-30 h-10"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </button>

                  <div
                    class="flex items-center justify-center font-black text-blue-900 text-sm md:text-lg select-none"
                  >
                    {{ qty }}
                  </div>

                  <button
                    @click="qty++"
                    :disabled="product.stok === 0"
                    class="flex items-center justify-center text-blue-900 hover:bg-white rounded-xl transition-all font-bold disabled:opacity-30 h-10"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </button>
                </div>

                <div class="flex flex-col">
                  <span
                    class="text-[11px] md:text-[13px] font-black text-blue-900"
                  >
                    {{ product.stok }} Unit
                  </span>
                  <span
                    class="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest"
                  >
                    {{ product.stok > 0 ? "Tersedia" : "Habis" }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="hidden md:flex gap-4">
            <template v-if="product.stok > 0">
              <button
                @click="copyLink(product.id)"
                class="w-20 bg-slate-100 text-blue-900 flex items-center justify-center rounded-2xl hover:bg-slate-200 transition-all border border-slate-100 active:scale-95 shadow-lg shadow-slate-200/50"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 100-2.684 3 3 0 000 2.684zm0 12.684a3 3 0 100-2.684 3 3 0 000 2.684z"
                  />
                </svg>
              </button>

              <button
                @click="addToCart"
                class="w-20 bg-blue-800 text-yellow-400 py-5 rounded-2xl font-black uppercase hover:bg-blue-900 transition-all active:scale-95 flex items-center justify-center shadow-lg shadow-blue-900/30"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3z"
                  />
                </svg>
              </button>

              <button
                @click="buyNow"
                class="flex-1 bg-[#22C55E] text-white rounded-2xl font-black uppercase text-[11px] tracking-widest transition-all active:scale-95 flex items-center justify-center shadow-lg shadow-emerald-900/20"
              >
                <span>Beli Sekarang</span>
              </button>
            </template>

            <template v-else>
              <button
                disabled
                class="w-full bg-slate-200 text-slate-400 py-5 rounded-2xl font-black uppercase text-[11px] tracking-widest cursor-not-allowed border border-slate-100"
              >
                Mohon Maaf, Stok Produk Habis
              </button>
            </template>
          </div>
        </div>
      </div>

      <div
        class="mt-3 md:mt-8 mx-4 md:mx-0 bg-white border border-slate-100 rounded-[2rem] p-8 md:p-12 shadow-sm"
      >
        <h3
          class="text-[14px] md:text-[18px] font-black text-blue-900 uppercase tracking-[0.2em] mb-6 underline underline-offset-8 decoration-blue-900"
        >
          Deskripsi Produk
        </h3>
        <p
          class="text-slate-500 text-sm md:text-base leading-relaxed font-medium text-justify w-full"
        >
          {{
            product.description ||
            "Emas Antam Logam Mulia sertifikasi LBMA menjamin kemurnian 999.9. Investasi aman, terpercaya, dan mudah dicairkan di seluruh dunia."
          }}
        </p>
      </div>

      <div class="mt-34 mx-4 md:mx-0 mb-20">
        <div
          class="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden"
        >
          <div class="p-6 md:p-8 pb-0">
            <h2 class="text-[#1a237e] text-[18px] font-black tracking-tight">
              Ulasan Produk
            </h2>
          </div>

          <div
            class="p-6 md:p-8 pt-4 flex flex-col md:flex-row items-center gap-8 md:gap-12 border-b border-slate-50"
          >
            <div class="text-center md:text-left">
              <div
                class="flex items-baseline gap-1 justify-center md:justify-start"
              >
                <span class="text-5xl md:text-7xl font-black text-slate-800">
                  {{ product.rating_avg_num || "0.0" }}
                </span>
                <span class="text-xl font-bold text-slate-300">/ 5</span>
              </div>
              <div class="flex items-center text-amber-400 gap-0.5 my-2">
                <div v-for="i in 5" :key="i" class="relative w-4 h-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    class="absolute inset-0 text-slate-200 w-4 h-4"
                  >
                    <path
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                    />
                  </svg>
                  <div
                    class="absolute inset-0 overflow-hidden"
                    :style="{
                      width:
                        Math.max(
                          0,
                          Math.min(
                            100,
                            (product.rating_avg_float - (i - 1)) * 100,
                          ),
                        ) + '%',
                    }"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      class="text-amber-400 w-4 h-4"
                    >
                      <path
                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <p class="text-slate-400 text-xs font-bold">
                {{ product.rating }} Ulasan
              </p>
            </div>

            <div class="flex-1 w-full space-y-2 md:space-y-3">
              <div
                v-for="star in [5, 4, 3, 2, 1]"
                :key="star"
                class="flex items-center gap-4"
              >
                <div class="flex items-center gap-1 w-8">
                  <span class="text-xs font-bold text-slate-500">{{
                    star
                  }}</span>
                  <span class="text-amber-400 text-xs">★</span>
                </div>
                <div
                  class="flex-1 h-[4px] md:h-[6px] bg-slate-100 rounded-full overflow-hidden"
                >
                  <div
                    :style="{
                      width:
                        product.rating > 0 && product.distribution
                          ? (product.distribution[star] / product.rating) *
                              100 +
                            '%'
                          : '0%',
                    }"
                    class="h-full bg-amber-400 transition-all duration-500"
                  ></div>
                </div>
                <span class="text-xs font-medium text-slate-400 w-6 text-right">
                  ({{ product.distribution ? product.distribution[star] : 0 }})
                </span>
              </div>
            </div>
          </div>

          <div class="p-4 md:p-8 space-y-4 md:space-y-6">
            <template
              v-if="product.reviews_list && product.reviews_list.length > 0"
            >
              <div
                v-for="review in product.reviews_list"
                :key="review.id"
                class="p-4 md:p-6 rounded-[1.5rem] border border-slate-100 flex flex-col md:flex-row gap-3 md:gap-6"
              >
                <div class="md:w-48 flex-shrink-0 text-left">
                  <p class="text-sm font-black text-slate-800 mb-0.5">
                    {{ review.user_name || "Pelanggan Toko Emas" }}
                  </p>
                  <div class="flex text-amber-400 text-[10px] mb-1">
                    {{ "★".repeat(Math.round(parseFloat(review.rating))) }}
                  </div>
                  <p class="text-[9px] text-slate-400 font-bold uppercase">
                    {{
                      new Date(review.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    }}
                  </p>
                </div>
                <div class="flex-1 text-left">
                  <p class="text-slate-600 text-sm leading-relaxed">
                    {{ review.comment }}
                  </p>

                  <div
                    v-if="review.image"
                    class="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden border border-slate-200 cursor-pointer hover:border-amber-400 hover:opacity-90 transition-all shadow-sm active:scale-95 mt-4"
                    @click="openZoomModal(review.image)"
                  >
                    <img
                      :src="`${BACKEND_URL}/uploads/reviews/${review.image}`"
                      class="w-full h-full object-cover"
                      alt="Foto Bukti Ulasan"
                    />
                  </div>
                </div>
              </div>
            </template>

            <div
              v-else
              class="text-center py-10 text-slate-400 font-bold text-sm tracking-widest uppercase"
            >
              Belum ada ulasan untuk produk ini.
            </div>
          </div>
        </div>
      </div>

      <div class="mt-34 w-full mb-40 px-4 md:px-0">
        <div class="flex items-center justify-between mb-8">
          <h2
            class="text-[#1a237e] text-[16px] md:text-[18px] font-black uppercase tracking-[0.1em]"
          >
            Koleksi Terkait
          </h2>
          <RouterLink
            to="/produk"
            class="text-[#1a237e] text-xs font-bold hover:opacity-80 transition-opacity"
          >
            Lihat Semua →
          </RouterLink>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <div
            v-for="item in allProducts
              .filter(
                (p) => p.category === product.category && p.id !== product.id,
              )
              .slice(0, 4)"
            :key="item.id"
            class="bg-white rounded-2xl md:rounded-3xl border border-slate-100 p-3 md:p-4 transition-all group hover:shadow-xl flex flex-col"
          >
            <div
              class="aspect-square rounded-xl overflow-hidden bg-slate-50 mb-4 relative"
            >
              <img
                :src="item.image"
                class="w-full h-full object-cover transition-all duration-500"
                :class="{ 'grayscale opacity-60': item.stok === 0 }"
              />
            </div>

            <div class="flex-1 mb-4">
              <p class="text-[#1a237e] text-sm md:text-lg font-black mb-1">
                {{ item.price }}
              </p>

              <h3
                class="text-slate-500 text-[10px] md:text-[12px] font-bold leading-tight line-clamp-1 mb-2"
              >
                {{ item.name }}
              </h3>

              <div class="flex items-center gap-1.5">
                <div class="flex text-amber-400 text-[10px] md:text-xs">
                  ★★★★★
                </div>
                <span
                  class="text-slate-400 text-[9px] md:text-[10px] font-bold"
                >
                  (5.0) ({{ item.rating || 4346 }})
                </span>
              </div>
            </div>

            <div class="flex flex-row gap-2 mt-auto">
              <button
                @click="copyLink(item.id)"
                class="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 transition-all border border-slate-100"
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
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
              </button>

              <RouterLink
                :to="`/produk/${item.id}`"
                class="flex-1 flex items-center justify-center bg-[#2b67f6] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all active:scale-95"
              >
                Lihat Detail
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </main>

    <div
      class="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-100 p-4 z-[100] md:hidden"
    >
      <div class="flex gap-3 h-14">
        <button
          @click="copyLink(product.id)"
          class="w-14 h-14 flex items-center justify-center bg-[#F1F5F9] text-slate-500 rounded-2xl transition-all active:scale-90 border border-slate-200 shadow-sm shadow-lg shadow-slate-200/50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
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
        </button>

        <template v-if="product.stok > 0">
          <button
            @click="addToCart"
            class="w-14 h-14 bg-blue-800 text-yellow-400 rounded-2xl font-black transition-all active:scale-95 flex items-center justify-center shadow-lg shadow-blue-900/30"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3z"
              />
            </svg>
          </button>

          <button
            @click="buyNow"
            class="flex-1 bg-[#22C55E] text-white rounded-2xl font-black uppercase text-[11px] tracking-widest transition-all active:scale-95 flex items-center justify-center shadow-lg shadow-emerald-900/20"
          >
            <span>Beli Sekarang</span>
          </button>
        </template>

        <button
          v-else
          disabled
          class="w-full bg-slate-200 text-slate-400 rounded-2xl font-black uppercase text-[11px] tracking-widest"
        >
          Mohon Maaf, Stok Habis
        </button>
      </div>
    </div>

    <transition name="fade">
      <div
        v-if="showToast"
        class="fixed bottom-24 md:bottom-10 left-1/2 -translate-x-1/2 z-[200]"
      >
        <div
          class="bg-white border border-emerald-100 px-6 py-3 rounded-full shadow-2xl flex items-center gap-3"
        >
          <div class="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
          <span class="text-xs font-black text-blue-900"
            >Link Produk Disalin!</span
          >
        </div>
      </div>
    </transition>

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
          v-if="showZoomModal"
          class="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
          @click.self="closeZoomModal"
        >
          <button
            @click="closeZoomModal"
            class="absolute top-6 right-6 p-3 bg-slate-800/50 hover:bg-slate-700/70 text-white rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-amber-500 z-10 active:scale-90"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div
            class="relative max-w-7xl max-h-[90vh] bg-white rounded-3xl p-3 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300"
            @click.stop
          >
            <img
              :src="zoomedImageUrl"
              class="w-full h-auto max-h-[85vh] object-contain rounded-2xl"
              alt="Preview Gambar Ulasan Full Size"
            />
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translate(-50%, 20px);
}

::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
</style>
