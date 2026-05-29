import { defineStore } from "pinia";
import axios from "axios";

// 🔥 SESUAIKAN DENGAN URL BACKEND
const BACKEND_URL = "http://localhost/toko-emas-main";
const API_BASE_URL = `${BACKEND_URL}/index.php/api/v1`;

export const useCartStore = defineStore("cart", {
  state: () => ({
    items: JSON.parse(localStorage.getItem("cart") || "[]"),
  }),

  getters: {
    totalItems: (state) =>
      state.items.reduce(
        (total, item) =>
          total + (parseInt(item.qty) || parseInt(item.quantity) || 1),
        0,
      ),

    totalPrice: (state) =>
      state.items.reduce((total, item) => {
        let strVal = String(item.price);

        // Amankan dari desimal database
        if (strVal.match(/\.\d{2}$/)) {
          strVal = strVal.replace(/\.\d{2}$/, "");
        }

        const cleanPrice = parseInt(strVal.replace(/[^0-9]/g, "")) || 0;
        const qty = parseInt(item.qty) || parseInt(item.quantity) || 1;

        return total + cleanPrice * qty;
      }, 0),
  },

  actions: {
    // Bantuan untuk mengambil token
    getToken() {
      return localStorage.getItem("token");
    },

    // Bantuan untuk header axios
    getAuthHeader() {
      return { headers: { Authorization: `Bearer ${this.getToken()}` } };
    },

    // 🔥 1. FASE MEMBER: Tarik keranjang dari Database
    async fetchCart() {
      const token = localStorage.getItem("token");
      if (!token) return; // Jika belum login, abaikan.

      try {
        const response = await axios.get(
          `${API_BASE_URL}/cart`,
          this.getAuthHeader(),
        );
        if (response.data && response.data.status) {
          // Ganti isi state dengan data dari database
          this.items = response.data.data.items || [];
        }
      } catch (error) {
        console.error("Gagal menarik keranjang dari database:", error);
      }
    },

    // 🔥 2. FASE KRITIS: Sinkronisasi saat Login
    async syncCart() {
      const token = this.getToken();
      if (!token) return;

      const localItems = JSON.parse(localStorage.getItem("cart") || "[]");

      // Jika di LocalStorage ada barang, lempar ke API
      if (localItems.length > 0) {
        try {
          // Format ulang data agar sesuai permintaan backend
          const syncData = localItems.map((item) => ({
            product_id: item.id,
            quantity: item.qty,
          }));

          // Tembak API Sync yang baru kita buat di CI3
          await axios.post(
            `${API_BASE_URL}/cart/sync`,
            { items: syncData },
            this.getAuthHeader(),
          );

          // Bersihkan jejak LocalStorage setelah sukses pindah ke DB
          localStorage.removeItem("cart");
        } catch (error) {
          console.error("Gagal sinkronisasi keranjang:", error);
        }
      }

      // Apapun yang terjadi, tarik data terbaru dari database
      await this.fetchCart();
    },

    // 🔥 3. LOGIKA CERDAS: Add, Update, Remove
    async addToCart(product, quantity = 1) {
      const token = this.getToken();

      if (token) {
        // JIKA LOGIN: Simpan ke Database
        try {
          await axios.post(
            `${API_BASE_URL}/cart/add`,
            {
              product_id: product.id,
              quantity: quantity, // 🔥 Kirim jumlah aslinya, bukan angka 1
            },
            this.getAuthHeader(),
          );
          await this.fetchCart(); // Refresh data dari DB
        } catch (error) {
          console.error("Gagal tambah ke DB:", error);
        }
      } else {
        // JIKA GUEST: Simpan ke LocalStorage
        const index = this.items.findIndex((i) => i.id === product.id);
        if (index !== -1) {
          this.items[index].qty += quantity; // 🔥 Tambah sesuai jumlah
        } else {
          this.items.push({ ...product, qty: quantity }); // 🔥 Set sesuai jumlah
        }
        this.saveToLocalStorage();
      }
    },

    async updateQty(index, change) {
      const item = this.items[index];
      const currentQty = parseInt(item.qty) || parseInt(item.quantity) || 1;
      const newQty = currentQty + change;

      if (newQty < 1) return; // Tidak boleh 0

      const token = this.getToken();
      if (token) {
        try {
          // Perhatikan: item.id dari DB adalah cart_items.id
          await axios.post(
            `${API_BASE_URL}/cart/update/${item.id}`,
            {
              quantity: newQty,
            },
            this.getAuthHeader(),
          );
          await this.fetchCart();
        } catch (error) {
          console.error(error);
        }
      } else {
        this.items[index].qty = newQty;
        this.saveToLocalStorage();
      }
    },

    async removeItem(index) {
      const item = this.items[index];
      const token = this.getToken();

      if (token) {
        try {
          await axios.post(
            `${API_BASE_URL}/cart/delete/${item.id}`,
            {},
            this.getAuthHeader(),
          );
          await this.fetchCart();
        } catch (error) {
          console.error(error);
        }
      } else {
        this.items.splice(index, 1);
        this.saveToLocalStorage();
      }
    },

    clearCart() {
      // Hanya berjalan untuk membersihkan UI sementara saat logout/checkout
      this.items = [];
      localStorage.removeItem("cart");
    },

    saveToLocalStorage() {
      localStorage.setItem("cart", JSON.stringify(this.items));
    },
  },
});
