import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import ProductView from "../views/ProductView.vue";
import ProductDetailView from "../views/ProductDetailView.vue";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import CartView from "../views/CartView.vue";
import CheckoutView from "../views/CheckoutView.vue";
import DashboardView from "../views/member/DashboardView.vue";
import OrdersView from "../views/member/OrdersView.vue";
import OrderDetailView from "../views/member/OrderDetailView.vue";
import TransactionsView from "../views/member/TransactionsView.vue";
import PaymentMethodsView from "../views/member/PaymentMethodsView.vue";
import ProfileView from "../views/member/ProfileView.vue";
import NewDetail from "../views/NewDetailView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: {
        title: "Logam Mulia TBK | Investasi Emas Online",
      },
    },
    {
      path: "/produk",
      name: "produk",
      component: ProductView,
      meta: {
        title: "Koleksi Produk Emas Batangan & Gift Series | Logam Mulia TBK",
      },
    },
    {
      path: "/produk/:id",
      name: "produk-detail",
      component: ProductDetailView,
      meta: { isDetailProduk: true },
    },
    {
      path: "/berita/:slug",
      name: "berita-detail",
      component: NewDetail,
      meta: {
        title: "Detail Berita | Logam Mulia TBK",
      },
    },
    {
      path: "/cart",
      name: "cart",
      component: CartView,
      meta: {
        title: "Keranjang Belanja Anda | Logam Mulia TBK",
      },
    },
    {
      path: "/checkout",
      name: "checkout",
      component: CheckoutView,
      meta: {
        title: "Proses Checkout Aman | Logam Mulia TBK",
        requiresAuth: true,
      },
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
      meta: {
        hideNav: true,
        title: "Masuk Akun | Logam Mulia TBK",
      },
    },
    {
      path: "/register",
      name: "register",
      component: RegisterView,
      meta: {
        hideNav: true,
        title: "Daftar Akun | Logam Mulia TBK",
      },
    },
    {
      path: "/member",
      meta: { hideNav: true, requiresAuth: true },
      children: [
        {
          path: "dashboard",
          name: "member-dashboard",
          component: DashboardView,
        },
        {
          path: "orders",
          name: "member-orders",
          component: OrdersView,
        },
        {
          path: "/member/orders/:id",
          name: "OrderDetail",
          component: OrderDetailView,
        },
        {
          path: "transactions",
          name: "member-transactions",
          component: TransactionsView,
        },
        {
          path: "payment-methods",
          name: "member-payment-methods",
          component: PaymentMethodsView,
        },
        {
          path: "profile",
          name: "member-profile",
          component: ProfileView,
        },
      ],
    },
  ],

  hideNav: true,
  requiresAuth: true,

  scrollBehavior(to, from, savedPosition) {
    return { top: 0, behavior: "smooth" };
  },
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");

  if (to.meta.requiresAuth && !token) {
    localStorage.setItem("redirectAfterLogin", to.fullPath);

    next({ name: "login" });
  } else {
    next();
  }
});

router.afterEach((to) => {
  const defaultTitle = "Logam Mulia TBK | Investasi Emas Online";
  if (to.meta.isDetailProduk) {
    const productId = parseInt(to.params.id);

    const allProducts = [
      { id: 1, name: "EMAS ANTAM LM BATANGAN IDUL FITRI 2026 - 5GR" },
      { id: 2, name: "Emas Antam LM Gift Series Idul Fitri 2026 - 1 gr" },
      {
        id: 3,
        name: "Emas Antam LM Gift Series Imlek 2026 Year of The Dragon - 8 gr",
      },
      { id: 4, name: "Emas Batangan - 0,5 gram" },
      { id: 8, name: "Perak batangan 250 gram" },
    ];

    const foundProduct = allProducts.find((p) => p.id === productId);

    if (foundProduct) {
      document.title = `${foundProduct.name.toUpperCase()} | Logam Mulia TBK`;
      return;
    }
  }
  document.title = to.meta.title || defaultTitle;
});

router.beforeResolve((to, from, next) => {
  if (to.path === from.path) {
    next();
    return;
  }

  setTimeout(() => {
    next();
  }, 400);
});

export default router;
