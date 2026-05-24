<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import axios from "axios";

// 🔥 SESUAIKAN DENGAN STRUKTUR BASE URL REST API
const BACKEND_URL = "http://localhost/toko-emas-main";
const API_BASE_URL = `${BACKEND_URL}/index.php/api/v1`;

const currentSlide = ref(0);
const isMobile = ref(window.innerWidth < 768);
const bannerImages = ref([]);
const produkTerbaru = ref([]);
const beritaPromo = ref([]);

const emailBuletin = ref("");
const isLoading = ref(false);
const shopName = ref("Memuat nama toko...");
const shopAddress = ref("Memuat alamat...");

const fetchHomeData = async () => {
  try {
    isLoading.value = true;

    // 🔥 PERBAIKAN: Tembak API Banner dan Produk secara bersamaan
    const [resBanner, resProduk, resSettings, resNews] = await Promise.all([
      axios.get(`${API_BASE_URL}/banners`),
      axios.get(`${API_BASE_URL}/products`),
      axios.get(`${API_BASE_URL}/settings`),
      axios.get(`${API_BASE_URL}/news`),
    ]);

    // --- 1. Logika Banner ---
    if (resBanner.data && resBanner.data.status) {
      const dataBanner = resBanner.data.data || [];
      bannerImages.value = dataBanner.map((item) => {
        if (
          item.image &&
          (item.image.startsWith("http://") ||
            item.image.startsWith("https://"))
        ) {
          return item.image;
        }
        return `${BACKEND_URL}/uploads/banners/${item.image}`;
      });
    }

    // --- 2. Logika Produk Terbaru ---
    // Asumsi: API products sudah mengembalikan data (array of objects)
    let rawDataProduk = resProduk.data.data || resProduk.data;
    let arrayProduk = rawDataProduk.products || rawDataProduk;

    if (Array.isArray(arrayProduk)) {
      produkTerbaru.value = arrayProduk.slice(0, 2).map((item) => {
        return {
          id: item.id,
          name: item.name,

          // Logika perakitan gambar lokal
          img:
            item.image &&
            (item.image.startsWith("http://") ||
              item.image.startsWith("https://"))
              ? item.image
              : `${BACKEND_URL}/uploads/products/${item.image}`,
        };
      });
    } else {
      console.warn(
        "Peringatan: Format data produk dari API bukan Array!",
        arrayProduk,
      );
      produkTerbaru.value = [];
    }

    if (resSettings.data && resSettings.data.data) {
      const settingsData = resSettings.data.data;

      // Ambil shop_name dari database
      const nameItem = settingsData.find((item) => item.key === "shop_name");
      if (nameItem && nameItem.value) shopName.value = nameItem.value;

      // Ambil shop_address dari database
      const addressItem = settingsData.find(
        (item) => item.key === "shop_address",
      );
      if (addressItem && addressItem.value)
        shopAddress.value = addressItem.value;
    }

    if (resNews.data && resNews.data.status) {
      const dataNews = resNews.data.data || [];
      beritaPromo.value = dataNews.map((item) => {
        return {
          id: item.id,
          judul: item.title,
          slug: item.slug,
          banner_gambar:
            item.image &&
            (item.image.startsWith("http://") ||
              item.image.startsWith("https://"))
              ? item.image
              : `${BACKEND_URL}/uploads/news/${item.image}`,
        };
      });
    }
  } catch (error) {
    console.error("Gagal memuat data halaman utama! Detail:", error);
  } finally {
    isLoading.value = false;
  }
};

// Logika Slider Banner (Tetap Aman)
const groupedBanners = computed(() => {
  const groups = [];
  if (bannerImages.value.length === 0) return groups;
  if (isMobile.value) {
    bannerImages.value.forEach((img) => groups.push([img]));
  } else {
    for (let i = 0; i < bannerImages.value.length; i += 2) {
      groups.push(bannerImages.value.slice(i, i + 2));
    }
  }
  return groups;
});

const nextSlide = () => {
  if (groupedBanners.value.length === 0) return;
  currentSlide.value =
    currentSlide.value < groupedBanners.value.length - 1
      ? currentSlide.value + 1
      : 0;
};

const prevSlide = () => {
  if (groupedBanners.value.length === 0) return;
  currentSlide.value =
    currentSlide.value > 0
      ? currentSlide.value - 1
      : groupedBanners.value.length - 1;
};

const handleResize = () => {
  const wasMobile = isMobile.value;
  isMobile.value = window.innerWidth < 768;
  if (wasMobile !== isMobile.value) currentSlide.value = 0;
};

const formatPrice = (val) => {
  return new Intl.NumberFormat("id-ID").format(val);
};

let timer;
onMounted(() => {
  window.addEventListener("resize", handleResize);
  fetchHomeData(); // Jalankan fungsi ambil data API
  timer = setInterval(nextSlide, 5000);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
  clearInterval(timer);
});
</script>

<template>
  <main class="flex-grow bg-white">
    <section
      class="py-0 md:py-10 overflow-hidden relative group"
      aria-label="Banner Promo"
    >
      <div class="w-full md:container mx-auto max-w-7xl px-0 md:px-32 relative">
        <div
          class="relative overflow-hidden rounded-0 md:rounded-[2.5rem] shadow-sm md:border md:border-slate-100"
        >
          <button
            class="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-50 bg-white/50 hover:bg-white/90 backdrop-blur-md p-3 rounded-full shadow-lg transition-all active:scale-90 items-center justify-center border border-white/30"
            @click="prevSlide"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 text-blue-900"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2.5"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <div
            class="flex transition-transform duration-500 ease-in-out"
            :style="{ transform: 'translateX(-' + currentSlide * 100 + '%)' }"
          >
            <div
              v-for="(slideGroup, sIndex) in groupedBanners"
              :key="sIndex"
              class="w-full flex-shrink-0"
            >
              <div class="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-4">
                <div
                  v-for="(img, iIndex) in slideGroup"
                  :key="iIndex"
                  class="w-full relative"
                >
                  <img
                    :src="img"
                    class="w-full h-auto block"
                    alt="Banner Promo"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            class="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-50 bg-white/50 hover:bg-white/90 backdrop-blur-md p-3 rounded-full shadow-lg transition-all active:scale-90 items-center justify-center border border-white/30"
            @click="nextSlide"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 text-blue-900"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2.5"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          <div
            class="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 px-3 py-2 bg-black/20 backdrop-blur-md rounded-full border border-white/10 z-40 md:hidden font-bold"
          >
            <button
              v-for="(dot, index) in groupedBanners.length"
              :key="index"
              :class="[
                'h-1.5 transition-all duration-300 rounded-full',
                currentSlide === index ? 'w-8 bg-amber-400' : 'w-2 bg-white/50',
              ]"
              @click="currentSlide = index"
            />
          </div>
        </div>

        <div class="hidden md:flex justify-center space-x-2 mt-6">
          <button
            v-for="(dot, index) in groupedBanners.length"
            :key="index"
            :class="[
              'h-1.5 transition-all duration-300 rounded-full',
              currentSlide === index ? 'w-10 bg-amber-400' : 'w-2 bg-slate-200',
            ]"
            @click="currentSlide = index"
          />
        </div>
      </div>
    </section>

    <div class="bg-[#1a237e] py-6 text-center shadow-inner mb-16">
      <RouterLink
        to="/produk"
        class="bg-amber-400 text-blue-900 px-14 py-3 rounded-xl text-xs md:text-sm font-black uppercase flex items-center mx-auto space-x-3 shadow-lg hover:shadow-amber-500/20 transition-all active:scale-95 tracking-widest w-fit"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
          />
        </svg>
        <span>Beli Emas Disini</span>
      </RouterLink>
    </div>

    <section class="bg-white py-12">
      <div class="container mx-auto px-4 lg:px-20">
        <div
          v-if="isLoading"
          class="text-center text-sm font-bold text-slate-400 py-10"
        >
          Memuat produk emas terbaru...
        </div>

        <div
          v-else
          class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto"
        >
          <article
            v-for="produk in produkTerbaru"
            :key="produk.id"
            class="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden flex flex-col group relative"
          >
            <div
              class="w-full relative overflow-hidden bg-slate-50/50 flex-shrink-0"
            >
              <div
                class="absolute top-4 left-4 z-10 flex items-center space-x-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-amber-500/40 shadow-lg shadow-amber-500/20"
              >
                <span class="relative flex h-2 w-2">
                  <span
                    class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"
                  ></span>
                  <span
                    class="relative inline-flex rounded-full h-2 w-2 bg-amber-500"
                  ></span>
                </span>

                <span
                  class="text-amber-400 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em]"
                  >New</span
                >
              </div>

              <img
                :src="produk.img"
                class="w-full h-auto object-contain aspect-square group-hover:scale-105 transition-transform duration-700"
                :alt="produk.name"
              />
            </div>

            <div
              class="p-6 md:p-8 flex flex-col flex-grow text-center items-center justify-center"
            >
              <h3
                class="text-xs md:text-sm font-bold mb-6 text-[#1a237e] uppercase tracking-tight leading-relaxed px-2"
              >
                {{ produk.name }}
              </h3>

              <RouterLink
                to="/produk"
                class="mt-auto text-[10px] md:text-xs text-amber-500 font-extrabold border-b-2 border-amber-500 pb-1.5 uppercase hover:text-amber-600 hover:border-amber-600 transition-all tracking-widest"
              >
                Lihat Detail
              </RouterLink>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="py-18 bg-white" aria-labelledby="layanan-antam">
      <div class="container mx-auto px-4 lg:px-20 text-center">
        <div class="mb-20">
          <h2
            id="layanan-antam"
            class="text-blue-900 font-bold text-lg md:text-xl uppercase tracking-[0.2em] mb-4"
          >
            Layanan Logam Mulia
          </h2>
          <p
            class="text-sm md:text-base text-slate-600 max-w-4xl leading-relaxed mb-8 mx-auto px-4"
          >
            Dengan kompetensi kami di bidang pemurnian, custom minting &
            casting, jasa analisis yang berstandar internasional dengan
            teknologi terkini dan ramah lingkungan, serta didukung dengan sumber
            daya yang profesional, kami siap membantu memenuhi kebutuhan
            investasi emas Anda.
          </p>
          <div
            class="rounded-3xl overflow-hidden shadow-xl max-w-4xl mx-auto border border-slate-50"
          >
            <img
              src="https://www.butikemaslogammuliastore.com/_next/image?url=https%3A%2F%2Fbutikemasantamlogammulia.com%2Fstatic%2Fmedia%2Fservice.45fd26bf33ef26f3b5ea.webp&w=1920&q=75"
              alt="Fasilitas Layanan Logam Mulia"
              class="w-full h-auto"
            />
          </div>
        </div>

        <div class="mb-4 pt-10">
          <h2
            class="text-amber-500 font-bold text-xl md:text-2xl uppercase tracking-wider mb-3"
          >
            Berita dan Promo Terbaru
          </h2>
          <p
            class="text-sm md:text-base text-slate-600 max-w-3xl mx-auto mb-10 px-4"
          >
            Semua informasi terkini, kegiatan, promo, dan berita menarik lainnya
            dari ANTAM Logam Mulia untuk membantu Anda berinvestasi lebih
            cerdas.
          </p>
          <div
            v-if="!isLoading && beritaPromo.length > 0"
            class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto text-left"
          >
            <article
              v-for="promo in beritaPromo"
              :key="promo.id"
              class="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden flex flex-col group"
            >
              <div
                class="relative aspect-[16/9] overflow-hidden bg-slate-50 flex-shrink-0"
              >
                <img
                  :src="promo.banner_gambar"
                  :alt="promo.judul"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              <div class="p-4 md:p-8 flex flex-col flex-grow">
                <h3
                  class="text-base md:text-lg font-bold text-[#1a237e] leading-snug mb-5 line-clamp-2"
                >
                  {{ promo.judul }}
                </h3>

                <div class="mt-auto">
                  <RouterLink
                    :to="`/berita/${promo.slug}`"
                    class="inline-block text-xs md:text-sm text-amber-500 font-extrabold border-b-2 border-amber-500 pb-1.5 uppercase hover:text-amber-600 hover:border-amber-600 transition-all tracking-widest"
                  >
                    Lihat Detail
                  </RouterLink>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
    <section class="py-12 bg-white" aria-labelledby="kontak-info">
      <div class="container mx-auto px-4 lg:px-20">
        <div class="mb-24 pt-3">
          <p
            class="text-md text-center text-slate-500 max-w-5xl mx-auto leading-relaxed mb-8"
          >
            Hanya di
            <span class="font-semibold text-blue-900"
              >butikemaslogammuliastore.com</span
            >
            Anda mendapatkan emas batangan ANTAM LM yang asli dengan kemurnian
            999.9. Produk k ami memberikan keamanan dan ketenangan pikiran dalam
            berinvestasi. Nikmati kenyamanan berbelanja emas tanpa meninggalkan
            rumah. butikemaslogammuliastore.com menawarkan layanan pengiriman
            yang cepat dan aman langsung ke alamat Anda, menjadikan investasi
            emas lebih praktis.
          </p>
          <div class="max-w-4xl mx-auto">
            <img
              src="https://www.butikemaslogammuliastore.com/_next/image?url=%2Fbelanja.webp&w=1920&q=75"
              alt="Informasi Belanja Aman Emas Antam"
              class="w-full h-auto"
            />
          </div>
        </div>

        <div
          class="grid grid-cols-1 md:grid-cols-2 gap-8 text-left max-w-5xl mx-auto"
        >
          <div>
            <h3
              id="kontak-info"
              class="text-blue-900 font-bold text-md uppercase mb-3 tracking-wider"
            >
              Alamat Kantor Pusat
            </h3>
            <address
              class="text-md md:text-sm text-slate-600 mb-5 not-italic leading-relaxed whitespace-pre-line"
            >
              <p class="font-bold text-lg mb-1 text-slate-800">
                {{ shopName }}
              </p>
              <p>{{ shopAddress }}</p>
            </address>
          </div>
          <div>
            <h3
              class="text-blue-900 font-bold text-md uppercase mb-3 mt-5 tracking-wider"
            >
              Berlangganan Buletin
            </h3>
            <p class="text-md text-slate-500 mb-4">
              Dapatkan update terbaru dari kami langsung di email Anda
            </p>
            <form
              class="flex flex-col sm:flex-row gap-0"
              @submit.prevent="handleSubscribeBuletin"
              aria-label="Formulir Buletin"
            >
              <input
                v-model="emailBuletin"
                type="email"
                placeholder="Email Anda"
                aria-label="Alamat Email"
                class="flex-grow border border-slate-300 p-2.5 rounded-l-lg text-sm mb-2 focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                class="bg-amber-500 hover:bg-amber-600 mb-2 text-blue-900 font-bold px-6 py-2.5 rounded-r-lg uppercase text-[12px] shadow-sm"
              >
                Kirim
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
