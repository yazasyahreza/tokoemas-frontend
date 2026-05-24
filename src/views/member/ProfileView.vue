<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import Sidebar from "../../components/Sidebar.vue";

const router = useRouter();

// State Kontrol Utama Loader & Saving
const isSavingProfile = ref(false);
const isSavingPassword = ref(false);
const isUploadingKtp = ref(false);

// 🔥 KONFIGURASI ALAMAT API BACKEND (SINKRON DENGAN LOGINVIEW)
const BACKEND_URL = "http://localhost/toko-emas-main";
const API_BASE_URL = `${BACKEND_URL}/index.php/api/v1`;

// State Identitas Diri
const profileData = ref({
  id: null,
  name: "",
  email: "",
  phone: "",
  avatar: null,
  avatar_url: "",
});

const avatarError = ref("");
let rawAvatarFile = null;

// State Ganti Password
const passwordData = ref({
  new_password: "",
  confirm_password: "",
});

const activeTab = ref("ktp");
const docs = ref({
  ktp: { preview: "", status: null, error: "" },
  npwp: { preview: "", status: null, error: "" },
});

const message = ref({ type: "", text: "" });
const showMessage = (type, text) => {
  message.value = { type, text };
  setTimeout(() => {
    message.value = { type: "", text: "" };
  }, 1000);
};

// --- 🔄 INITIAL LOAD DATA USER (SINKRON ENDPOINT v1) ---
const initUserProfile = async () => {
  try {
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    // 1. Tampilkan data sesi lokal dulu biar form tidak kosong melompong
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        profileData.value.id = userData.id;
        profileData.value.name = userData.name || "";
        profileData.value.email = userData.email || "";
        profileData.value.phone = userData.phone || "";
        if (userData.avatar) {
          profileData.value.avatar_url = `${BACKEND_URL}/uploads/avatars/${userData.avatar}`;
        }

        // 🔥 TEMPAT 1: SINKRON AWAL DARI LOCAL STORAGE (BIAR KOTAK TIDAK BERKEDIP KOSONG)
        docs.value.ktp.status = userData.ktp_status || null;
        docs.value.ktp.preview = userData.ktp_file
          ? `${BACKEND_URL}/uploads/documents/${userData.ktp_file}`
          : "";

        docs.value.npwp.status = userData.npwp_status || null;
        docs.value.npwp.preview = userData.npwp_file
          ? `${BACKEND_URL}/uploads/documents/${userData.npwp_file}`
          : "";

        if (docs.value.ktp.preview) {
          activeTab.value = "ktp";
        } else if (docs.value.npwp.preview) {
          activeTab.value = "npwp";
        } else {
          activeTab.value = "ktp"; // Default jika keduanya kosong
        }

        localStorage.setItem("user", JSON.stringify(userData));
        window.dispatchEvent(new Event("profile-updated"));
      } catch (e) {
        console.error("Gagal parsing data user lokal:", e);
      }
    }

    // 2. Tembak API resmi ke endpoint GET v1/auth/profile murni backend
    const response = await axios.get(`${API_BASE_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data?.success || response.data?.status === true) {
      const liveUser = response.data.data;

      // Sinkron Identitas
      profileData.value.name = liveUser.name || profileData.value.name;
      profileData.value.phone = liveUser.phone || profileData.value.phone;

      // Sinkron Avatar
      if (liveUser.avatar) {
        profileData.value.avatar_url = `${BACKEND_URL}/uploads/avatars/${liveUser.avatar}`;
      }

      // 🔥 TEMPAT 2: DISINI LETAK UTAMANYA UNTUK SINKRON DARI DATABASE SERVER!
      // Kita hapus total blok "if (liveUser.ktp_file)" yang lama, lalu ganti dengan ini:
      docs.value.ktp.status = liveUser.ktp_status || null;
      docs.value.ktp.preview = liveUser.ktp_file
        ? `${BACKEND_URL}/uploads/documents/${liveUser.ktp_file}`
        : "";

      docs.value.npwp.status = liveUser.npwp_status || null;
      docs.value.npwp.preview = liveUser.npwp_file
        ? `${BACKEND_URL}/uploads/documents/${liveUser.npwp_file}`
        : "";

      // Simpan data live terbaru ke local storage agar sesi berikutnya update
      localStorage.setItem("user", JSON.stringify(liveUser));
      window.dispatchEvent(new Event("profile-updated"));
    }
  } catch (error) {
    console.error("Gagal sinkronisasi data profil dari server:", error);
  }
};

const updateProfileIdentitas = async () => {
  if (!profileData.value.name || !profileData.value.phone) {
    showMessage("error", "Kolom Nama dan Nomor Telepon wajib diisi!.");
    return;
  }

  try {
    isSavingProfile.value = true;
    const token = localStorage.getItem("token");

    // Karena cuma kirim teks, kita kembalikan pakai JSON payload biasa biar lebih ringan dan cepat
    const payload = {
      name: profileData.value.name,
      phone: profileData.value.phone,
    };

    const response = await axios.post(
      `${API_BASE_URL}/auth/update-profile`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.data?.success || response.data?.status === true) {
      showMessage("success", "Identitas baru telah tersimpan.");

      // Sinkronkan data localstorage baru agar UI Sidebar dll ikut berubah
      const currentLocalData = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))
        : {};

      const updatedUser = {
        ...currentLocalData,
        name: profileData.value.name,
        phone: profileData.value.phone,
      };

      // Catatan: Kita hapus blok penangkap avatar di sini karena sudah diurus oleh onAvatarChange

      localStorage.setItem("user", JSON.stringify(updatedUser));
      window.dispatchEvent(new Event("profile-updated"));
    } else {
      showMessage(
        "error",
        response.data?.message || "Gagal menyimpan data profil.",
      );
    }
  } catch (error) {
    console.error("Detail Error Update Profil:", error);
    showMessage(
      "error",
      "Server menolak perubahan data. Pastikan jaringan aman.",
    );
  } finally {
    isSavingProfile.value = false;
  }
};

// --- 🔐 API UPDATE PASSWORD (SINKRON ENDPOINT v1) ---
const updatePassword = async () => {
  if (!passwordData.value.new_password) {
    showMessage("error", "Password baru tidak boleh kosong.");
    return;
  }

  if (passwordData.value.new_password !== passwordData.value.confirm_password) {
    showMessage("error", "Konfirmasi password baru tidak cocok.");
    return;
  }

  try {
    isSavingPassword.value = true;
    const token = localStorage.getItem("token");

    const response = await axios.post(
      `${API_BASE_URL}/auth/change_password`,
      {
        new_password: passwordData.value.new_password,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    if (response.data?.success || response.data?.status === true) {
      showMessage("success", "Password baru berhasil disimpan.");
      passwordData.value = { new_password: "", confirm_password: "" };
    } else {
      showMessage(
        "error",
        response.data?.message || "Gagal mengubah password.",
      );
    }
  } catch (error) {
    console.error("Detail Error Password:", error);
    showMessage("error", "Gagal memperbarui password baru ke server backend.");
  } finally {
    isSavingPassword.value = false;
  }
};

// --- 📸 FITUR AUTO-UPLOAD FOTO DENGAN TEKS ERROR LOKAL ---
const onAvatarChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // 1. Bersihkan error lama setiap kali user memilih foto baru
  avatarError.value = "";

  // 2. SATPAM UKURAN FILE (MAKS 2MB)
  const maxSizeInBytes = 2 * 1024 * 1024;
  if (file.size > maxSizeInBytes) {
    // 🔥 ISI TEKS ERROR KE BAWAH FOTO, JANGAN PAKAI showMessage LAGI!
    avatarError.value = "* Ukuran foto terlalu besar! Maksimal 2MB.";
    e.target.value = "";
    return;
  }

  const oldAvatarUrl = profileData.value.avatar_url;
  profileData.value.avatar_url = URL.createObjectURL(file);

  // (Pesan sukses/loading tetap pakai showMessage tidak apa-apa karena sifatnya global)
  showMessage("success", "Ukuran aman! Mengunggah foto ke server...");

  const formData = new FormData();
  formData.append("avatar", file);

  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_BASE_URL}/auth/update-profile`,
      formData,
      { headers: { Authorization: `Bearer ${token}` } },
    );

    if (response.data?.success || response.data?.status === true) {
      showMessage("success", "Foto profil berhasil tersimpan!");

      const currentLocalData = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))
        : {};
      if (response.data.data && response.data.data.avatar) {
        currentLocalData.avatar = response.data.data.avatar;
        profileData.value.avatar_url = `${BACKEND_URL}/uploads/avatars/${response.data.data.avatar}`;
        localStorage.setItem("user", JSON.stringify(currentLocalData));
        window.dispatchEvent(new Event("profile-updated"));
      }
    } else {
      profileData.value.avatar_url = oldAvatarUrl;
      avatarError.value =
        "* " + (response.data?.message || "Gagal mengunggah foto.");
    }
  } catch (error) {
    profileData.value.avatar_url = oldAvatarUrl;
    avatarError.value = "* Server menolak foto. Pastikan format gambar sesuai.";
  } finally {
    e.target.value = "";
  }
};

// --- 📸 FITUR AUTO-UPLOAD KTP DENGAN TEKS ERROR LOKAL ---
const onDocChange = async (e) => {
  const type = activeTab.value; // 'ktp' atau 'npwp'
  const file = e.target.files[0];
  if (!file) return;

  docs.value[type].error = "";
  const maxSize = 2 * 1024 * 1024;

  if (file.size > maxSize) {
    docs.value[type].error =
      `* Ukuran ${type.toUpperCase()} terlalu besar! Maks 2MB.`;
    e.target.value = "";
    return;
  }

  const oldPreview = docs.value[type].preview;
  docs.value[type].preview = URL.createObjectURL(file);

  const formData = new FormData();
  formData.append("document", file);
  formData.append("doc_type", type); // 🔥 INI YG DIKIRIM KE BACKEND!

  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_BASE_URL}/auth/upload_document`,
      formData,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    if (response.data?.success || response.data?.status === true) {
      showMessage("success", `Dokumen ${type.toUpperCase()} sukses terkirim.`);
      docs.value[type].status = "pending";
    } else {
      docs.value[type].preview = oldPreview;
      docs.value[type].error = "* " + response.data?.message;
    }
  } catch (error) {
    docs.value[type].preview = oldPreview;
    docs.value[type].error = `* Server menolak ${type.toUpperCase()}.`;
  } finally {
    e.target.value = "";
  }
};

const removeAvatar = async () => {
  if (!confirm("Yakin ingin menghapus foto profil ini?")) return;

  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(`${API_BASE_URL}/auth/delete_avatar`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data?.success || response.data?.status === true) {
      showMessage("success", "Foto profil berhasil dihapus.");

      // Bersihkan UI Web
      profileData.value.avatar = null;
      profileData.value.avatar_url = "";

      // Sinkronisasi LocalStorage agar Sidebar kembali ke huruf inisial
      const currentLocalData = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))
        : {};
      currentLocalData.avatar = null;
      localStorage.setItem("user", JSON.stringify(currentLocalData));
      window.dispatchEvent(new Event("profile-updated"));
    }
  } catch (error) {
    showMessage("error", "Gagal menghapus foto profil.");
  }
};

const removeDoc = async () => {
  const type = activeTab.value;
  if (!confirm(`Yakin ingin menghapus dokumen ${type.toUpperCase()}?`)) return;

  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(
      `${API_BASE_URL}/auth/delete_document`,
      {
        headers: { Authorization: `Bearer ${token}` },
        params: { type: type }, // 🔥 Kirim tipe ke backend via Query String
      },
    );

    if (response.data?.success || response.data?.status === true) {
      showMessage(
        "success",
        `Dokumen ${type.toUpperCase()} berhasil di hapus.`,
      );
      docs.value[type].preview = "";
      docs.value[type].status = null;
    }
  } catch (error) {
    docs.value[type].error = "Gagal menghapus dokumen.";
  }
};

onMounted(() => {
  initUserProfile();
});
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex flex-col md:flex-row font-jakarta">
    <Sidebar />

    <main
      class="flex-1 p-4 md:p-8 space-y-6 w-full md:pl-80 transition-all duration-300"
    >
      <div>
        <h1 class="text-2xl font-black text-[#1a237e] tracking-tight uppercase">
          Pengaturan Profil
        </h1>
        <p class="text-xs md:text-sm text-slate-500 mt-0.5">
          Kelola informasi identitas diri, foto profil, dan keamanan enkripsi
          password Anda.
        </p>
      </div>

      <Teleport to="body">
        <transition name="fade">
          <div
            v-if="message.text"
            class="fixed top-0 left-0 w-screen h-screen z-[9999] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 transition-all duration-300 m-0"
          >
            <div
              class="bg-white rounded-[2rem] p-8 shadow-2xl flex flex-col items-center text-center max-w-sm w-full transform transition-all duration-300 scale-100"
            >
              <div
                v-if="message.type === 'success'"
                class="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-inner"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="3"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <div
                v-if="message.type === 'error'"
                class="w-24 h-24 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-6 shadow-inner"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="3"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>

              <h2
                :class="[
                  'text-2xl font-black uppercase tracking-tight mb-2',
                  message.type === 'success'
                    ? 'text-emerald-600'
                    : 'text-red-600',
                ]"
              >
                {{ message.type === "success" ? "Berhasil!" : "Oops, Gagal!" }}
              </h2>

              <p class="text-sm text-slate-500 font-medium leading-relaxed">
                {{ message.text }}
              </p>
            </div>
          </div>
        </transition>
      </Teleport>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div class="lg:col-span-4 space-y-6">
          <div
            class="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs flex flex-col items-center text-center space-y-4"
          >
            <div
              class="relative w-24 h-24 rounded-full border-4 border-slate-50 shadow-sm overflow-visible bg-slate-100 flex items-center justify-center select-none group"
            >
              <div class="w-full h-full rounded-full overflow-hidden">
                <img
                  v-if="profileData.avatar_url"
                  :src="profileData.avatar_url"
                  class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  alt="User Avatar"
                />
                <div
                  v-else
                  class="w-full h-full bg-[#1a237e]/10 text-[#1a237e] flex items-center justify-center text-3xl font-black uppercase"
                >
                  {{
                    profileData.name ? profileData.name.trim().charAt(0) : "U"
                  }}
                </div>
              </div>

              <button
                v-if="profileData.avatar_url"
                @click.stop="removeAvatar"
                class="absolute -top-1 -right-1 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full shadow-md border-2 border-white"
                title="Hapus Foto"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="3"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>

            <p
              v-if="avatarError"
              class="text-[10px] font-black text-red-500 animate-pulse px-3 py-0.5 rounded-lg"
            >
              {{ avatarError }}
            </p>

            <div class="space-y-0.5">
              <h3
                class="text-base font-black text-slate-800 tracking-tight leading-snug"
              >
                {{ profileData.name || "Nama Pengguna" }}
              </h3>
              <p
                class="text-xs text-slate-400 font-semibold tracking-normal truncate max-w-[220px]"
              >
                {{ profileData.email || "email@database.com" }}
              </p>
            </div>

            <div class="pt-1 w-full">
              <label
                class="inline-block text-[11px] font-black text-[#1a237e] uppercase tracking-wider cursor-pointer bg-slate-50 hover:bg-slate-100 border border-slate-200 px-5 py-2.5 rounded-xl shadow-xs transition-all active:scale-95"
              >
                {{
                  profileData.avatar_url
                    ? "Ganti Foto Profil"
                    : "Pilih Foto Profil"
                }}
                <input
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="onAvatarChange"
                />
              </label>
            </div>
          </div>

          <div
            class="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-4"
          >
            <div
              class="flex items-center justify-between border-b border-slate-50 pb-2.5"
            >
              <h2
                class="text-xs font-black text-[#1a237e] uppercase tracking-wider flex items-center gap-1.5"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2.5"
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                </svg>
                <span>Verifikasi Identitas</span>
              </h2>

              <span
                v-if="docs[activeTab].status"
                :class="[
                  docs[activeTab].status === 'approved'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : docs[activeTab].status === 'rejected'
                      ? 'bg-red-50 text-red-700 border-red-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200',
                  'px-2 py-0.5 text-[8px] font-black uppercase tracking-wider border rounded-md',
                ]"
              >
                {{
                  docs[activeTab].status === "approved"
                    ? "Verifikasi Berhasil"
                    : docs[activeTab].status === "rejected"
                      ? "Verifikasi Ditolak"
                      : "Belum Verifikasi"
                }}
              </span>
            </div>

            <p class="text-[11px] text-slate-400 font-medium leading-relaxed">
              Unggah berkas KTP atau NPWP asli Anda untuk memvalidasi legalitas
              akun dan membuka batas penuh transaksi emas.
            </p>

            <div
              v-if="!docs.ktp.preview && !docs.npwp.preview"
              class="flex gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-100 transition-all duration-300"
            >
              <button
                @click="activeTab = 'ktp'"
                :class="
                  activeTab === 'ktp'
                    ? 'bg-white shadow-sm text-[#1a237e] border border-slate-200'
                    : 'text-slate-400 hover:bg-slate-100'
                "
                class="flex-1 py-2 text-[10px] font-black tracking-widest uppercase rounded-lg transition-all"
              >
                Data KTP
              </button>
              <button
                @click="activeTab = 'npwp'"
                :class="
                  activeTab === 'npwp'
                    ? 'bg-white shadow-sm text-[#1a237e] border border-slate-200'
                    : 'text-slate-400 hover:bg-slate-100'
                "
                class="flex-1 py-2 text-[10px] font-black tracking-widest uppercase rounded-lg transition-all"
              >
                Data NPWP
              </button>
            </div>

            <div
              class="w-full aspect-video bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-3 text-center relative overflow-hidden group"
            >
              <img
                v-if="docs[activeTab].preview"
                :src="docs[activeTab].preview"
                class="w-full h-full object-cover absolute inset-0"
                alt="Document Preview"
              />

              <button
                v-if="
                  docs[activeTab].preview &&
                  docs[activeTab].status !== 'approved'
                "
                @click.prevent="removeDoc"
                class="absolute top-3 right-3 bg-red-500/90 hover:bg-red-600 text-white p-2 rounded-xl shadow-lg transition-all z-20"
                title="Hapus Dokumen"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2.5"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>

              <template v-else-if="!docs[activeTab].preview">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6 text-slate-300 mb-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 16l4.586-4.586a1 1 0 011.414 0L16 16m-2-2l1.586-1.586a1 1 0 011.414 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span
                  class="text-[10px] font-black text-[#1a237e] uppercase tracking-wider block"
                >
                  Klik Untuk Unggah {{ activeTab }}
                </span>
                <span class="text-[8px] text-slate-400 font-medium block mt-0.5"
                  >Format file: JPG, PNG (Maks 2MB)</span
                >
              </template>

              <input
                type="file"
                accept="image/*"
                :disabled="docs[activeTab].status === 'approved'"
                class="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
                @change="onDocChange"
              />
            </div>

            <p
              v-if="docs[activeTab].error"
              class="text-[10px] font-black text-red-500 animate-pulse bg-red-50 px-3 py-1.5 rounded-lg border border-red-100 mt-2 text-center"
            >
              {{ docs[activeTab].error }}
            </p>
          </div>
        </div>

        <div class="lg:col-span-8 space-y-6">
          <div
            class="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-5"
          >
            <h2
              class="text-sm font-black text-[#1a237e] uppercase tracking-wider border-b border-slate-50 pb-3"
            >
              Identitas Diri
            </h2>

            <form @submit.prevent="updateProfileIdentitas" class="space-y-4">
              <div class="space-y-1">
                <label
                  class="text-[10px] font-black text-[#1a237e] uppercase tracking-wider"
                  >Nama Lengkap</label
                >
                <input
                  v-model="profileData.name"
                  type="text"
                  placeholder="Masukkan nama lengkap"
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#1a237e] focus:bg-white transition-all"
                  required
                />
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label
                    class="text-[10px] font-black text-[#1a237e] uppercase tracking-wider"
                    >Alamat Email</label
                  >
                  <input
                    v-model="profileData.email"
                    type="email"
                    class="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-400 cursor-not-allowed focus:outline-none"
                    disabled
                  />
                </div>
                <div class="space-y-1">
                  <label
                    class="text-[10px] font-black text-[#1a237e] uppercase tracking-wider"
                    >Nomor WhatsApp</label
                  >
                  <input
                    v-model="profileData.phone"
                    type="tel"
                    placeholder="Contoh: 081234567xxx"
                    class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#1a237e] focus:bg-white transition-all"
                    required
                  />
                </div>
              </div>

              <div class="flex justify-end pt-2">
                <button
                  type="submit"
                  :disabled="isSavingProfile"
                  class="bg-[#1a237e] hover:bg-[#2a36b1] text-white text-xs font-black uppercase tracking-widest px-6 py-3 rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50"
                >
                  {{ isSavingProfile ? "Menyimpan..." : "Simpan Perubahan" }}
                </button>
              </div>
            </form>
          </div>

          <div
            class="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-5"
          >
            <h2
              class="text-sm font-black text-[#1a237e] uppercase tracking-wider border-b border-slate-50 pb-3"
            >
              Ganti Password
            </h2>

            <form @submit.prevent="updatePassword" class="space-y-4">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label
                    class="text-[10px] font-black text-[#1a237e] uppercase tracking-wider"
                    >Password Baru</label
                  >
                  <input
                    v-model="passwordData.new_password"
                    type="password"
                    placeholder="Minimal 6 karakter"
                    class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#1a237e] focus:bg-white transition-all"
                    required
                  />
                </div>
                <div class="space-y-1">
                  <label
                    class="text-[10px] font-black text-[#1a237e] uppercase tracking-wider"
                    >Konfirmasi Password Baru</label
                  >
                  <input
                    v-model="passwordData.confirm_password"
                    type="password"
                    placeholder="Ulangi password baru"
                    class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#1a237e] focus:bg-white transition-all"
                    required
                  />
                </div>
              </div>

              <div class="flex justify-end pt-2">
                <button
                  type="submit"
                  :disabled="isSavingPassword"
                  class="bg-[#1a237e] hover:bg-[#2a36b1] text-white text-xs font-black uppercase tracking-widest px-6 py-3 rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50"
                >
                  {{ isSavingPassword ? "Memproses..." : "Perbarui Password" }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
