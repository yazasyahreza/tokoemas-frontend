<template>
  <main class="container mx-auto px-4 lg:px-20 py-10">
    <div v-if="currentStep < 5">
      <div
        class="flex items-center space-x-3 mb-8 text-[11px] font-black uppercase tracking-wider text-slate-400 overflow-x-auto whitespace-nowrap pb-3 custom-scrollbar w-full"
      >
        x
        <div class="flex items-center space-x-1">
          <template v-if="currentStep > 1">
            <span
              class="text-emerald-600 flex items-center gap-1 cursor-pointer"
              @click="currentStep = 1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-3.5 w-3.5 stroke-[3]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Informasi Pembeli
            </span>
          </template>
          <template v-else>
            <span class="text-blue-600">Informasi Pembeli</span>
          </template>
        </div>

        <span>
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
              d="M9 5l7 7-7 7"
            />
          </svg>
        </span>

        <div class="flex items-center space-x-1">
          <template v-if="currentStep > 2">
            <span
              class="text-emerald-600 flex items-center gap-1 cursor-pointer"
              @click="currentStep = 2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-3.5 w-3.5 stroke-[3]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Metode Pengiriman
            </span>
          </template>
          <template v-else-if="currentStep === 2">
            <span class="text-blue-600">Metode Pengiriman</span>
          </template>
          <template v-else>
            <span class="text-slate-400">Metode Pengiriman</span>
          </template>
        </div>

        <span>
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
              d="M9 5l7 7-7 7"
            />
          </svg>
        </span>

        <div class="flex items-center space-x-1">
          <template v-if="currentStep > 3">
            <span
              class="text-emerald-600 flex items-center gap-1 cursor-pointer"
              @click="currentStep = 3"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-3.5 w-3.5 stroke-[3]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Metode Pembayaran
            </span>
          </template>
          <template v-else-if="currentStep === 3">
            <span class="text-blue-600">Metode Pembayaran</span>
          </template>
          <template v-else>
            <span class="text-slate-400">Metode Pembayaran</span>
          </template>
        </div>

        <span>
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
              d="M9 5l7 7-7 7"
            />
          </svg>
        </span>

        <span :class="currentStep === 4 ? 'text-blue-600' : 'text-slate-400'">
          Konfirmasi Pembayaran
        </span>
      </div>

      <div class="flex flex-col lg:flex-row gap-8">
        <div class="flex-1 space-y-6">
          <section
            class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
          >
            <div v-if="currentStep === 1" class="space-y-6">
              <h2
                class="text-lg font-bold text-blue-900 mb-6 uppercase tracking-tight"
              >
                Informasi Pembeli
              </h2>

              <form @submit.prevent="nextStep">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="md:col-span-2 space-y-1.5">
                    <label class="text-xs font-bold text-slate-500 uppercase"
                      >Email <span class="text-red-500">*</span></label
                    >
                    <input
                      type="email"
                      required
                      v-model="form.email"
                      placeholder="john@example.com"
                      class="w-full border border-slate-200 p-4 rounded-xl focus:outline-none focus:border-amber-500 text-sm bg-slate-50/50"
                    />
                  </div>

                  <div class="space-y-1.5">
                    <label class="text-xs font-bold text-slate-500 uppercase"
                      >Nama Depan <span class="text-red-500">*</span></label
                    >
                    <input
                      type="text"
                      required
                      v-model="form.firstName"
                      placeholder="John"
                      class="w-full border border-slate-200 p-4 rounded-xl focus:outline-none focus:border-amber-500 text-sm bg-slate-50/50"
                    />
                  </div>

                  <div class="space-y-1.5">
                    <label class="text-xs font-bold text-slate-500 uppercase"
                      >Nama Belakang <span class="text-red-500">*</span></label
                    >
                    <input
                      type="text"
                      required
                      v-model="form.lastName"
                      placeholder="Connor"
                      class="w-full border border-slate-200 p-4 rounded-xl focus:outline-none focus:border-amber-500 text-sm bg-slate-50/50"
                    />
                  </div>

                  <div class="md:col-span-2 space-y-1.5">
                    <label class="text-xs font-bold text-slate-500 uppercase"
                      >Upload KTP / NPWP
                      <span class="text-slate-400 font-medium normal-case ml-1"
                        >(Coret/Blur Nomor NIK KTP)</span
                      ></label
                    >
                    <div class="relative group">
                      <input
                        type="file"
                        accept="image/jpeg, image/png, image/webp"
                        @change="handleKtpChange"
                        class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div
                        class="border-2 border-dashed border-slate-100 rounded-2xl p-6 flex flex-col items-center justify-center bg-white group-hover:bg-slate-50 group-hover:border-amber-300 transition-all min-h-[160px]"
                      >
                        <div
                          v-if="ktpPreviewUrl"
                          class="w-full max-h-40 flex flex-col items-center justify-center gap-2"
                        >
                          <div
                            class="relative REGULAR-IMAGE-CONTAINER w-fit h-auto group-preview"
                          >
                            <button
                              type="button"
                              @click="clearKtpPreview"
                              class="absolute top-1 right-1 bg-rose-600 hover:bg-rose-700 text-white w-5 h-5 rounded-full flex items-center justify-center shadow-md transition-all active:scale-95 z-20"
                              title="Batalkan Gambar"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-3 w-3"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                stroke-width="3.5"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                            <img
                              :src="ktpPreviewUrl"
                              class="max-h-32 object-contain rounded-xl border shadow-sm"
                              alt="Preview KTP"
                            />
                          </div>
                          <span
                            class="text-[11px] text-blue-900 font-medium uppercase tracking-wider"
                            >Gambar Berhasil Dimuat (Klik/Drop untuk
                            Ganti)</span
                          >
                        </div>

                        <div
                          v-else
                          class="text-center flex flex-col items-center"
                        >
                          <div
                            class="w-10 h-10 border-2 border-slate-200 rounded-full flex items-center justify-center mb-4"
                          >
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
                                d="M12 4v16m8-8H4"
                              />
                            </svg>
                          </div>
                          <p class="text-[13px] font-black text-slate-600">
                            Klik untuk upload foto KTP/NPWP
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="md:col-span-2 space-y-1.5">
                    <label class="text-xs font-bold text-blue-900 mb-1 block"
                      >Lokasi Alamat</label
                    >
                    <div class="relative">
                      <select
                        v-model="form.location"
                        class="w-full border border-slate-100 p-4 rounded-xl focus:outline-none focus:border-amber-500 text-[15px] font-bold text-slate-800 appearance-none bg-slate-50/50"
                      >
                        <option value="Indonesia">Indonesia</option>
                        <option value="Luar Negeri">Luar Negeri</option>
                      </select>
                      <div
                        class="absolute inset-y-0 right-4 flex items-center pointer-events-none"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-5 w-5 text-slate-800"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2.5"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div class="space-y-1.5">
                    <label class="text-xs font-bold text-slate-500 uppercase"
                      >Provinsi <span class="text-red-500">*</span></label
                    >
                    <input
                      type="text"
                      required
                      v-model="form.province"
                      placeholder="Provinsi anda"
                      class="w-full border border-slate-200 p-4 rounded-xl focus:outline-none focus:border-amber-500 text-sm bg-slate-50/50"
                    />
                  </div>

                  <div class="space-y-1.5">
                    <label class="text-xs font-bold text-slate-500 uppercase"
                      >Kabupaten / Kota
                      <span class="text-red-500">*</span></label
                    >
                    <input
                      type="text"
                      required
                      v-model="form.regency"
                      placeholder="Kabupaten / Kota anda"
                      class="w-full border border-slate-200 p-4 rounded-xl focus:outline-none focus:border-amber-500 text-sm bg-slate-50/50"
                    />
                  </div>

                  <div class="space-y-1.5">
                    <label class="text-xs font-bold text-slate-500 uppercase"
                      >Kecamatan <span class="text-red-500">*</span></label
                    >
                    <input
                      type="text"
                      required
                      v-model="form.district"
                      placeholder="Kecamatan anda"
                      class="w-full border border-slate-200 p-4 rounded-xl focus:outline-none focus:border-amber-500 text-sm bg-slate-50/50"
                    />
                  </div>

                  <div class="space-y-1.5">
                    <label class="text-xs font-bold text-slate-500 uppercase"
                      >Desa / Kelurahan
                      <span class="text-red-500">*</span></label
                    >
                    <input
                      type="text"
                      required
                      v-model="form.village"
                      placeholder="Desa / Kelurahan anda"
                      class="w-full border border-slate-200 p-4 rounded-xl focus:outline-none focus:border-amber-500 text-sm bg-slate-50/50"
                    />
                  </div>

                  <div class="md:col-span-2 space-y-1.5">
                    <label class="text-xs font-bold text-slate-500 uppercase"
                      >Alamat Lengkap (Jalan/Rt/Rw/Blok)
                      <span class="text-red-500">*</span></label
                    >
                    <textarea
                      required
                      v-model="form.fullAddress"
                      placeholder="Alamat lengkap pengiriman emas..."
                      rows="3"
                      class="w-full border border-slate-200 p-4 rounded-xl focus:outline-none focus:border-amber-500 text-sm bg-slate-50/50"
                    ></textarea>
                  </div>

                  <div class="space-y-1.5">
                    <label class="text-xs font-bold text-slate-500 uppercase"
                      >Kode Pos <span class="text-red-500">*</span></label
                    >
                    <input
                      type="text"
                      required
                      v-model="form.postalCode"
                      placeholder="Kode pos pengiriman"
                      @input="sanitizeNumberOnly($event, 'postalCode', true)"
                      class="w-full border border-slate-200 p-4 rounded-xl focus:outline-none focus:border-amber-500 text-sm bg-slate-50/50"
                    />
                  </div>

                  <div class="space-y-1.5">
                    <label class="text-xs font-bold text-slate-500 uppercase"
                      >Telepon <span class="text-red-500">*</span></label
                    >
                    <input
                      type="tel"
                      required
                      v-model="form.phone"
                      placeholder="Masukkan nomor telepon aktif"
                      @input="sanitizeNumberOnly($event, 'phone', true)"
                      class="w-full border border-slate-200 p-4 rounded-xl focus:outline-none focus:border-amber-500 text-sm bg-slate-50/50"
                    />
                  </div>
                </div>

                <div class="mt-10">
                  <button
                    type="submit"
                    class="w-full bg-blue-800 text-white font-black py-4 rounded-xl uppercase text-xs tracking-widest shadow-lg hover:bg-blue-900 transition-all active:scale-95"
                  >
                    Lanjutkan Ke Pengiriman
                  </button>
                </div>
              </form>
            </div>

            <div v-if="currentStep === 2" class="space-y-6">
              <h2
                class="text-lg font-bold text-blue-900 mb-6 uppercase tracking-tight"
              >
                Pilih Kurir Pengiriman
              </h2>

              <form @submit.prevent="handleNextToPayment">
                <div class="grid grid-cols-1 gap-4">
                  <label
                    v-for="courier in couriers"
                    :key="courier.id"
                    class="flex items-center justify-between p-5 rounded-2xl border-2 cursor-pointer transition-all bg-slate-50/50"
                    :class="
                      selectedCourier === courier.id
                        ? 'border-blue-500 bg-blue-50/20'
                        : 'border-slate-100 hover:border-slate-200'
                    "
                  >
                    <div class="flex items-center space-x-4">
                      <input
                        v-model="selectedCourier"
                        type="radio"
                        required
                        :value="courier.id"
                        class="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300"
                      />
                      <div
                        v-if="courier.image"
                        class="w-12 h-12 bg-white rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center border border-slate-100 p-1"
                      >
                        <img
                          :src="courier.image"
                          :alt="courier.name"
                          class="w-full h-full object-contain"
                        />
                      </div>
                      <div>
                        <p class="text-sm font-black text-blue-950 uppercase">
                          {{ courier.name }}
                        </p>
                        <p class="text-[11px] text-slate-400 font-bold mt-0.5">
                          {{ courier.desc }}
                        </p>
                      </div>
                    </div>
                    <span
                      class="text-xs font-black uppercase"
                      :class="
                        parsePrice(courier.price) > 0
                          ? 'text-[#FF4D4D]'
                          : 'text-emerald-600'
                      "
                    >
                      {{ courier.price }}
                    </span>
                  </label>
                </div>

                <div
                  class="flex flex-col sm:flex-row gap-4 pt-8 border-slate-100"
                >
                  <button
                    type="button"
                    class="w-full sm:w-auto bg-white border border-blue-800 text-blue-800 hover:bg-blue-50 font-black py-4 px-8 rounded-2xl text-xs uppercase tracking-wider transition-all active:scale-95 shadow-sm"
                    @click="currentStep = 1"
                  >
                    Kembali
                  </button>
                  <button
                    type="submit"
                    class="flex-1 bg-blue-800 hover:bg-blue-900 text-white font-black py-4 px-6 rounded-2xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-blue-200 active:scale-95"
                  >
                    Lanjutkan Ke Pembayaran
                  </button>
                </div>
              </form>
            </div>

            <div v-if="currentStep === 3" class="space-y-6">
              <h2
                class="text-lg font-bold text-blue-900 mb-6 uppercase tracking-tight"
              >
                Pilih Metode Pembayaran
              </h2>

              <form @submit.prevent="handleFinishOrder">
                <div
                  class="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm text-left"
                >
                  <div class="flex items-center space-x-3 mb-6">
                    <div
                      class="w-5 h-5 rounded-full border-4 border-blue-600 flex items-center justify-center bg-white"
                    >
                      <div class="w-1.5 h-1.5 rounded-full bg-blue-600" />
                    </div>
                    <span class="text-sm font-bold text-slate-800"
                      >Bank Transfer</span
                    >
                  </div>

                  <div
                    class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full"
                  >
                    <label
                      v-for="bank in paymentBanks"
                      :key="bank.id"
                      class="flex flex-col items-center justify-center p-3 rounded-2xl border-2 cursor-pointer transition-all bg-white aspect-[4/3] text-center relative hover:shadow-sm"
                      :class="
                        selectedBank === bank.id
                          ? 'border-blue-500 bg-blue-50/10'
                          : 'border-slate-200/70 hover:border-slate-300'
                      "
                    >
                      <input
                        v-model="selectedBank"
                        type="radio"
                        required
                        :value="bank.id"
                        class="sr-only"
                      />
                      <div
                        v-if="bank.image"
                        class="h-7 w-full flex items-center justify-center mb-1.5 px-1"
                      >
                        <img
                          :src="bank.image"
                          :alt="bank.name"
                          class="max-w-full max-h-full object-contain"
                        />
                      </div>
                      <p
                        class="text-[10px] font-black text-slate-400 uppercase tracking-wider"
                      >
                        {{ bank.code }}
                      </p>
                    </label>
                  </div>
                </div>

                <div
                  class="flex flex-col sm:flex-row gap-4 pt-8 border-slate-100"
                >
                  <button
                    type="button"
                    class="w-full sm:w-auto bg-white border border-blue-500 text-blue-600 hover:bg-blue-50 font-black py-4 px-8 rounded-2xl text-xs uppercase tracking-wider transition-all active:scale-95 shadow-sm"
                    @click="currentStep = 2"
                  >
                    Kembali
                  </button>
                  <button
                    type="submit"
                    class="flex-1 bg-blue-800 hover:bg-blue-900 text-white font-black py-4 px-6 rounded-2xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-blue-200 active:scale-95"
                  >
                    Selesaikan Order
                  </button>
                </div>
              </form>
            </div>

            <form
              v-if="currentStep === 4"
              @submit.prevent="handleConfirmPayment($event)"
              class="space-y-6"
            >
              <div class="text-center my-6">
                <h2 class="text-xl font-bold text-slate-800">
                  Konfirmasi Pembayaran
                </h2>
                <p class="text-2xl font-black text-slate-900 mt-2">
                  Rp {{ formatPrice(finalTotalPrice) }}
                </p>
              </div>

              <div
                class="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm text-left space-y-4"
              >
                <div class="space-y-1.5">
                  <label class="text-xs font-bold text-slate-500 uppercase"
                    >Nomor Invoice</label
                  >
                  <input
                    type="text"
                    disabled
                    v-model="form.invoiceNumber"
                    class="w-full border border-slate-200 p-4 rounded-xl text-sm bg-slate-100 font-semibold text-blue-900 outline-none cursor-not-allowed"
                  />
                </div>

                <div class="space-y-1.5">
                  <label class="text-xs font-bold text-slate-500 uppercase"
                    >Tanggal Pembayaran
                    <span class="text-red-500">*</span></label
                  >
                  <input
                    type="date"
                    required
                    v-model="form.paymentDate"
                    class="w-full border border-slate-200 p-4 rounded-xl focus:outline-none focus:border-amber-500 text-sm bg-slate-50/50 font-semibold"
                  />
                </div>

                <div class="space-y-1.5">
                  <label class="text-xs font-bold text-slate-500 uppercase"
                    >Transfer ke Bank / E-Wallet
                    <span class="text-red-500">*</span></label
                  >
                  <div class="relative">
                    <select
                      required
                      v-model="form.targetBank"
                      class="w-full border border-slate-200 p-4 rounded-xl focus:outline-none focus:border-amber-500 text-sm bg-slate-50/50 appearance-none font-semibold text-slate-700"
                    >
                      <option value="">Pilih Tujuan Pembayaran</option>
                      <option
                        v-for="acc in shopAccounts"
                        :key="acc.id"
                        :value="acc.id"
                      >
                        {{ acc.name }} - {{ acc.account_name }}
                      </option>
                    </select>
                    <div
                      class="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-500"
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
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>

                  <div
                    v-if="activeShopAccount"
                    class="mt-4 p-5 bg-blue-50/50 rounded-2xl border border-blue-100 flex flex-col items-center animate-in fade-in zoom-in duration-300"
                  >
                    <p
                      class="text-xs font-bold text-slate-600 mb-4 text-center"
                    >
                      Silahkan transfer ke rekening berikut:
                    </p>

                    <div
                      class="relative relative group max-w-[200px] mb-2 cursor-zoom-in"
                      @click="isShopAccountImagePreviewOpen = true"
                    >
                      <img
                        v-if="activeShopAccount.image"
                        :src="`${BACKEND_URL}/uploads/shop_accounts/${activeShopAccount.image}`"
                        alt="Logo/QR Bank"
                        class="w-full rounded-xl shadow-sm border border-slate-200 bg-white transition-all duration-300 group-hover:shadow-lg group-hover:scale-[1.02]"
                      />

                      <div
                        class="absolute top-2 right-2 bg-slate-900/70 text-white p-1.5 rounded-full shadow-md transition-all duration-300 opacity-0 group-hover:opacity-100 flex items-center justify-center"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-3.5 w-3.5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>

                    <p
                      class="text-[9px] text-amber-600 font-bold uppercase tracking-widest flex items-center gap-1.5 animate-pulse mb-3 mt-1 cursor-pointer"
                      @click="isShopAccountImagePreviewOpen = true"
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
                          stroke-width="2.5"
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                        />
                      </svg>
                      Klik untuk memperbesar gambar
                    </p>

                    <div class="mt-2 space-y-1.5 text-center">
                      <p class="text-sm font-black text-blue-900 uppercase">
                        {{ activeShopAccount.name }}
                      </p>
                      <p
                        class="text-xl font-black tracking-widest text-slate-800"
                      >
                        {{ activeShopAccount.account_number }}
                      </p>
                      <p
                        class="text-[11px] font-bold text-slate-500 uppercase tracking-wider"
                      >
                        A/N: {{ activeShopAccount.account_name }}
                      </p>
                    </div>
                  </div>
                </div>

                <div class="space-y-1.5">
                  <label class="text-xs font-bold text-slate-500 uppercase"
                    >Nomor Rekening Asal
                    <span class="text-red-500">*</span></label
                  >
                  <input
                    type="text"
                    required
                    v-model="form.accountNumber"
                    placeholder="Nomor rekening pengirim"
                    @input="sanitizeNumberOnly($event, 'accountNumber', true)"
                    class="w-full border border-slate-200 p-4 rounded-xl focus:outline-none focus:border-amber-500 text-sm bg-slate-50/50"
                  />
                </div>

                <div class="space-y-1.5">
                  <label class="text-xs font-bold text-slate-500 uppercase"
                    >Nama Pemilik Rekening
                    <span class="text-red-500">*</span></label
                  >
                  <input
                    type="text"
                    required
                    v-model="form.accountName"
                    placeholder="Nama lengkap pemilik rekening"
                    class="w-full border border-slate-200 p-4 rounded-xl focus:outline-none focus:border-amber-500 text-sm bg-slate-50/50"
                  />
                </div>

                <div class="space-y-1.5">
                  <label class="text-xs font-bold text-slate-500 uppercase"
                    >Bukti Pembayaran <span class="text-red-500">*</span></label
                  >
                  <div class="flex flex-col items-start gap-2">
                    <label
                      class="border border-blue-500 hover:bg-blue-50/50 text-blue-600 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all active:scale-95"
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
                          stroke-width="2"
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span>{{
                        buktiPreviewUrl ? "Ganti Bukti Gambar" : "Upload Gambar"
                      }}</span>
                      <input
                        type="file"
                        class="hidden"
                        accept="image/jpeg, image/png, image/webp"
                        @change="handleBuktiChange"
                      />
                    </label>
                    <span class="text-[10px] text-slate-400 font-bold"
                      >Format: JPG, PNG, WebP (maks. 3MB)</span
                    >

                    <div
                      v-if="buktiPreviewUrl"
                      class="mt-2 border rounded-xl p-2 bg-slate-50 flex items-center gap-3 relative"
                    >
                      <div class="relative">
                        <img
                          :src="buktiPreviewUrl"
                          class="w-16 h-16 object-cover rounded-lg border bg-white"
                          alt="Preview Bukti"
                        />
                        <button
                          type="button"
                          @click="clearBuktiPreview"
                          class="absolute -top-1.5 -right-1.5 bg-rose-600 hover:bg-rose-700 text-white w-4 h-4 rounded-full flex items-center justify-center shadow transition-all active:scale-95 z-20"
                          title="Batalkan Gambar"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-2.5 w-2.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            stroke-width="3.5"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                      <span
                        class="text-[10px] text-blue-900 font-medium uppercase tracking-wider flex items-center gap-1"
                      >
                        Bukti Terpilih
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div
                class="flex flex-col sm:flex-row gap-4 pt-4 border-slate-100"
              >
                <button
                  type="button"
                  class="w-full sm:w-auto bg-white border border-blue-800 text-blue-800 hover:bg-blue-50 font-black py-4 px-8 rounded-2xl text-xs uppercase tracking-wider transition-all active:scale-95 shadow-sm"
                  @click="currentStep = 3"
                >
                  Kembali
                </button>
                <button
                  type="submit"
                  :disabled="isSubmitting"
                  class="flex-1 text-white font-black py-4 px-6 rounded-2xl text-xs uppercase tracking-wider transition-all shadow-lg active:scale-95 flex justify-center items-center gap-2"
                  :class="
                    isSubmitting
                      ? 'bg-slate-400 cursor-not-allowed shadow-none'
                      : 'bg-blue-800 hover:bg-blue-900 shadow-blue-200'
                  "
                >
                  <svg
                    v-if="isSubmitting"
                    class="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    ></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>{{
                    isSubmitting
                      ? "Memproses Pesanan..."
                      : "Konfirmasi Pembayaran"
                  }}</span>
                </button>
              </div>
            </form>
          </section>
        </div>

        <div class="w-full lg:w-[380px]">
          <div class="space-y-4 sticky top-24">
            <div
              class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
            >
              <div class="bg-[#1a237e] p-4">
                <h2
                  class="text-white font-bold text-xs uppercase tracking-widest text-center"
                >
                  Ringkasan Pesanan
                </h2>
              </div>

              <div class="p-5 space-y-6">
                <div
                  class="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar"
                >
                  <div
                    v-for="item in cart"
                    :key="item.id"
                    class="flex gap-4 items-start pb-4 border-b border-slate-50 last:border-0"
                  >
                    <div
                      class="w-16 h-16 bg-slate-50 rounded-xl flex-shrink-0 overflow-hidden border border-slate-100"
                    >
                      <img
                        :src="getImageUrl(item.image)"
                        :alt="item.name"
                        class="w-full h-full object-contain p-2"
                      />
                    </div>
                    <div class="flex-1 min-w-0">
                      <h3
                        class="text-[13px] font-bold text-slate-800 truncate uppercase"
                      >
                        {{ item.name }}
                      </h3>
                      <p class="text-[11px] text-slate-400 mt-0.5">
                        {{ getQty(item) }}x @ Rp
                        {{ formatPrice(parsePrice(item.price)) }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100"
            >
              <div class="flex items-center gap-2 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 text-slate-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                <h3
                  class="text-xs font-black text-slate-700 uppercase tracking-tight"
                >
                  Catatan Untuk Penjual
                </h3>
              </div>
              <textarea
                v-model="form.note"
                placeholder="Tulis instruksi khusus (misal: packing kayu, kirim sebelum jam 3 sore)..."
                rows="3"
                class="w-full border border-slate-100 p-4 rounded-2xl focus:outline-none focus:border-amber-500 text-xs bg-slate-50/50 resize-none"
              ></textarea>
            </div>

            <div
              class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 relative overflow-hidden"
            >
              <div class="flex items-center gap-2 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 text-slate-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                  />
                </svg>
                <h3
                  class="text-xs font-black text-slate-700 uppercase tracking-tight"
                >
                  Hemat Lebih Banyak
                </h3>
              </div>

              <div class="flex gap-2 mb-3">
                <input
                  type="text"
                  v-model="promoInput"
                  :disabled="selectedVoucher"
                  placeholder="Masukkan Kode Kupon"
                  class="flex-1 bg-slate-50 border border-slate-100 p-3 rounded-xl text-xs outline-none text-slate-700 font-bold uppercase focus:border-blue-500 focus:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  @click="cekKodePromoManual"
                  :disabled="isCheckingPromo || !promoInput || selectedVoucher"
                  class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 disabled:bg-slate-200 disabled:text-slate-400"
                >
                  {{ isCheckingPromo ? "Mengecek..." : "Gunakan" }}
                </button>
              </div>

              <button
                v-if="!selectedVoucher"
                type="button"
                @click="showVoucherModal = true"
                class="w-full bg-amber-50 hover:bg-amber-100 border border-amber-200 py-3 rounded-xl flex items-center justify-center gap-2 transition-all group"
              >
                <span
                  class="text-amber-600 text-xs font-black uppercase tracking-tighter transition-transform group-hover:scale-125"
                  >%</span
                >
                <span
                  class="text-amber-600 text-[10px] font-black uppercase tracking-widest"
                >
                  Lihat Voucher Tersedia
                </span>
              </button>

              <div
                v-else
                class="w-full bg-emerald-50 border border-emerald-100 py-3 px-4 rounded-xl flex items-center justify-between animate-in fade-in zoom-in-95 duration-200"
              >
                <div class="flex items-center gap-2">
                  <span
                    class="text-emerald-600 text-xs font-black animate-bounce"
                    >%</span
                  >
                  <p
                    class="text-emerald-800 text-[10px] font-black uppercase tracking-wider"
                  >
                    Kupon
                    <span class="underline">{{ selectedVoucher.code }}</span>
                    Aktif
                  </p>
                </div>
                <button
                  type="button"
                  @click="batalkanVoucher"
                  class="text-rose-500 hover:text-rose-600 text-[10px] font-black uppercase tracking-widest hover:underline transition-all"
                >
                  Batalkan
                </button>
              </div>
            </div>

            <div class="bg-[#1a237e] rounded-[2rem] p-8 shadow-xl">
              <h3
                class="text-slate-400 text-[11px] font-black uppercase tracking-[0.2em] mb-8"
              >
                Total Rincian
              </h3>

              <div class="space-y-5 mb-8">
                <div class="flex justify-between items-center">
                  <span class="text-white/80 text-sm font-medium"
                    >Subtotal</span
                  >
                  <span class="text-white text-sm font-black"
                    >Rp {{ formatPrice(totalPrice) }}</span
                  >
                </div>
                <div
                  v-if="selectedVoucher"
                  class="flex justify-between items-center"
                >
                  <span class="text-emerald-400 text-sm font-medium"
                    >Diskon</span
                  >
                  <span class="text-emerald-400 text-sm font-black"
                    >-Rp
                    {{
                      formatPrice(parsePrice(selectedVoucher.discount))
                    }}</span
                  >
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-white/80 text-sm font-medium"
                    >Pengiriman</span
                  >
                  <span class="text-white text-sm font-black"
                    >Rp {{ formatPrice(deliveryFee) }}</span
                  >
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-white/80 text-sm font-medium"
                    >PPN (11%)</span
                  >
                  <span class="text-white text-sm font-black"
                    >Rp {{ formatPrice(taxFee) }}</span
                  >
                </div>
              </div>

              <div
                class="pt-6 border-t border-white/10 flex justify-between items-center"
              >
                <span
                  class="text-white text-sm font-black uppercase tracking-widest"
                  >Total Akhir</span
                >
                <span
                  class="text-[#f3af1e] text-2xl font-black tracking-tighter"
                >
                  Rp {{ formatPrice(finalTotalPrice) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-else-if="currentStep === 5 && successData"
      class="max-w-[450px] mx-auto bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500"
    >
      <div
        class="bg-slate-900 p-6 flex flex-col items-center justify-center text-center"
      >
        <h1
          class="text-amber-500 font-black text-2xl tracking-widest uppercase"
        >
          LOGAM MULIA
        </h1>
        <p class="text-slate-400 text-[10px] uppercase tracking-[0.2em] mt-1">
          Purity is reliable
        </p>
      </div>

      <div class="p-8 text-center space-y-6">
        <div>
          <h2 class="text-xl font-bold text-blue-900 mb-2">
            Pembayaran Sedang di Proses
          </h2>
          <p class="text-xs text-slate-500 leading-relaxed px-4">
            Terima kasih! Pembayaran Anda telah diterima dan sedang diproses
            oleh tim kami.
          </p>
        </div>

        <div
          class="bg-slate-50/50 rounded-2xl border border-slate-100 p-5 space-y-4"
        >
          <div class="flex justify-between items-center text-xs">
            <span class="text-slate-500 font-medium">Kode Pesanan</span>
            <span class="text-slate-800 font-black">{{
              successData.invoice
            }}</span>
          </div>
          <div class="flex justify-between items-center text-xs">
            <span class="text-slate-500 font-medium">Kode Transaksi</span>
            <span class="text-slate-800 font-black">{{
              successData.transactionCode
            }}</span>
          </div>
          <div class="flex justify-between items-center text-xs">
            <span class="text-slate-500 font-medium">Metode Pembayaran</span>
            <span class="text-blue-700 font-black">{{
              successData.paymentMethod
            }}</span>
          </div>
          <div class="flex justify-between items-center text-xs">
            <span class="text-slate-500 font-medium"
              >Tagihan (Subtotal+Ongkir+PPN)</span
            >
            <span class="text-slate-800 font-black">
              Rp {{ formatPrice(successData.originalTotal) }}
            </span>
          </div>

          <div
            v-if="successData.discount > 0"
            class="flex justify-between items-center text-xs"
          >
            <span class="text-slate-500 font-medium">Diskon Voucher</span>
            <span class="text-emerald-500 font-black"
              >- Rp {{ formatPrice(successData.discount) }}</span
            >
          </div>

          <div
            class="flex justify-between items-center text-xs pt-2 border-t border-slate-100 mt-2"
          >
            <span class="text-slate-800 font-bold uppercase tracking-wider"
              >Total Pembayaran</span
            >
            <span class="text-[#00a279] font-black text-sm"
              >Rp {{ formatPrice(successData.total) }}</span
            >
          </div>
          <div class="flex justify-between items-center text-xs">
            <span class="text-slate-500 font-medium">Bank Tujuan</span>
            <span class="text-slate-800 font-black uppercase">{{
              successData.targetBank
            }}</span>
          </div>
          <div class="flex justify-between items-center text-xs">
            <span class="text-slate-500 font-medium">Tanggal Transfer</span>
            <span class="text-slate-800 font-black">{{
              formatDateIndo(successData.date)
            }}</span>
          </div>

          <hr class="border-slate-200 border-dashed my-2" />

          <p class="text-[10px] text-slate-500 leading-relaxed text-left">
            Untuk info lebih lanjut silahkan hubungi
            <a href="#" class="text-blue-600 font-bold hover:underline"
              >admin Logam Mulia via WhatsApp</a
            >.
          </p>
          <p class="text-[10px] text-slate-500 leading-relaxed text-left">
            Silahkan salin
            <span class="font-bold text-slate-700">kode pesanan</span> Anda
            untuk konfirmasi ke admin.
          </p>
        </div>

        <div class="space-y-3 pt-2">
          <button
            @click="showTrackingModal = true"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl text-xs uppercase tracking-wider transition-all shadow-lg active:scale-95"
          >
            Cek Resi
          </button>
          <button
            @click="goToHome"
            class="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-black py-4 rounded-2xl text-xs uppercase tracking-wider transition-all active:scale-95"
          >
            Kembali Ke Halaman Utama
          </button>
        </div>
      </div>
    </div>

    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showVoucherModal"
        class="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      >
        <div
          class="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300"
        >
          <div
            class="p-8 flex justify-between items-center border-b border-slate-50"
          >
            <div class="flex items-center gap-4">
              <div
                class="w-10 h-10 bg-amber-50 rounded-2xl flex items-center justify-center"
              >
                <span class="text-amber-500 text-lg">🎫</span>
              </div>
              <div>
                <h3
                  class="text-[15px] font-black text-slate-800 uppercase tracking-tight"
                >
                  Voucher Tersedia
                </h3>
                <p
                  class="text-[10px] text-slate-400 font-bold uppercase tracking-widest"
                >
                  Pilih promo terbaik untuk Anda
                </p>
              </div>
            </div>
            <button
              class="w-10 h-10 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all"
              @click="showVoucherModal = false"
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
                  stroke-width="2.5"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div
            class="p-8 space-y-4 max-h-[450px] overflow-y-auto custom-scrollbar"
          >
            <div v-for="v in vouchers" :key="v.id" class="relative group">
              <div
                class="border-2 border-slate-100 rounded-3xl p-6 transition-all group-hover:border-amber-200 bg-white"
                :class="
                  isVoucherEligible(v)
                    ? 'cursor-pointer'
                    : 'opacity-60 cursor-not-allowed'
                "
                @click="isVoucherEligible(v) && applyVoucher(v)"
              >
                <div class="flex justify-between items-start mb-4">
                  <span
                    class="bg-slate-100 text-slate-600 text-[9px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest"
                    >{{ v.code }}</span
                  >
                  <span
                    class="text-[9px] font-black uppercase italic"
                    :class="
                      isVoucherEligible(v)
                        ? 'text-emerald-500'
                        : 'text-rose-500'
                    "
                  >
                    {{ isVoucherEligible(v) ? "SIAP PAKAI" : v.status }}
                  </span>
                </div>
                <h4
                  class="text-xl font-black text-slate-800 mb-4 tracking-tighter"
                >
                  Potongan {{ v.discount_display }}
                </h4>
                <div class="space-y-1.5">
                  <div
                    class="flex items-center gap-2 text-[10px] font-bold text-slate-400"
                  >
                    <div class="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Minimal belanja Rp {{ v.minSpend }}
                  </div>
                  <div
                    class="flex items-center gap-2 text-[10px] font-bold text-slate-400"
                  >
                    <div class="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    Hingga {{ v.expiry }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="p-6 bg-slate-50 text-center">
            <p
              class="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]"
            >
              Pilih voucher untuk mendapatkan harga investasi emas terbaik
            </p>
          </div>
        </div>
      </div>
    </transition>
  </main>

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
        v-if="showTrackingModal"
        class="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
        @click.self="showTrackingModal = false"
      >
        <div
          class="bg-white rounded-[2rem] w-full max-w-[400px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col"
        >
          <div
            class="bg-slate-900 p-5 flex flex-col items-center justify-center text-center relative"
          >
            <button
              @click="showTrackingModal = false"
              class="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
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
            <h1
              class="text-amber-500 font-black text-xl tracking-widest uppercase"
            >
              LOGAM MULIA
            </h1>
            <p
              class="text-slate-400 text-[9px] uppercase tracking-[0.2em] mt-0.5"
            >
              Purity is reliable
            </p>
          </div>

          <div class="p-8 space-y-6 flex-1">
            <div class="text-center">
              <h2 class="text-xl font-bold text-blue-900 mb-2">Cek Resi</h2>
              <p class="text-[11px] text-slate-500">
                Masukkan nomor order untuk melihat detail pengiriman Anda
              </p>
            </div>

            <div class="space-y-4">
              <input
                type="text"
                :value="successData?.invoice"
                disabled
                class="w-full border border-slate-200 p-4 rounded-xl focus:outline-none bg-slate-50 font-bold text-slate-700 text-center text-sm"
              />
              <button
                class="w-full bg-[#0ea5e9] hover:bg-blue-500 text-white font-black py-4 rounded-xl text-xs uppercase tracking-wider transition-all flex justify-center items-center gap-2 active:scale-95 shadow-md shadow-sky-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="3"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                CEK RESI
              </button>
            </div>

            <div
              class="border border-slate-100 rounded-2xl p-5 mt-6 relative overflow-hidden bg-white shadow-sm"
            >
              <div class="flex justify-between items-start mb-6">
                <div>
                  <p
                    class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1"
                  >
                    Status Pengiriman
                  </p>
                  <p
                    class="text-lg font-black text-rose-500 uppercase tracking-tight"
                  >
                    UNPAID
                  </p>
                </div>
                <div class="text-right">
                  <p
                    class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1"
                  >
                    Update Terakhir
                  </p>
                  <p class="text-xs font-bold text-slate-700">
                    {{ successData?.timeFormatted || "-" }}
                  </p>
                </div>
              </div>

              <div class="relative flex items-center justify-between mb-8 px-2">
                <div
                  class="absolute left-4 right-4 top-1/2 h-0.5 bg-slate-100 -z-10 -translate-y-1/2"
                ></div>
                <div
                  class="absolute left-4 w-1/3 top-1/2 h-0.5 bg-[#0ea5e9] -z-10 -translate-y-1/2"
                ></div>

                <div class="flex flex-col items-center gap-2">
                  <div
                    class="w-6 h-6 rounded-full bg-[#0ea5e9] text-white flex items-center justify-center shadow-sm"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-3 w-3"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                  <span
                    class="text-[9px] font-black text-slate-800 uppercase tracking-widest"
                    >Pending</span
                  >
                </div>

                <div class="flex flex-col items-center gap-2">
                  <div
                    class="w-6 h-6 rounded-full bg-[#0ea5e9] text-white flex items-center justify-center shadow-sm"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-3 w-3"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                  <span
                    class="text-[9px] font-black text-slate-800 uppercase tracking-widest"
                    >Unpaid</span
                  >
                </div>

                <div class="flex flex-col items-center gap-2">
                  <div
                    class="w-6 h-6 rounded-full bg-slate-100 text-slate-300 flex items-center justify-center border border-white"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-3 w-3"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                  <span
                    class="text-[9px] font-black text-slate-300 uppercase tracking-widest"
                    >Paid</span
                  >
                </div>

                <div class="flex flex-col items-center gap-2">
                  <div
                    class="w-6 h-6 rounded-full bg-slate-100 text-slate-300 flex items-center justify-center border border-white"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-3 w-3"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                      <path
                        fill-rule="evenodd"
                        d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                  <span
                    class="text-[9px] font-black text-slate-300 uppercase tracking-widest"
                    >Success</span
                  >
                </div>
              </div>

              <div
                class="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4"
              >
                <div>
                  <p
                    class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1"
                  >
                    Kurir
                  </p>
                  <p class="text-xs font-bold text-slate-800 leading-tight">
                    {{ successData?.courier }}
                  </p>
                </div>
                <div>
                  <p
                    class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1"
                  >
                    Nomor Resi
                  </p>
                  <p class="text-xs font-bold text-slate-800">-</p>
                </div>
              </div>
            </div>
          </div>

          <div class="p-4 bg-slate-50 text-center border-t border-slate-100">
            <p
              class="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em] flex items-center justify-center gap-1.5"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-3 w-3"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                  clip-rule="evenodd"
                />
              </svg>
              Logam Mulia Tracking System
            </p>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>

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
        v-if="
          isShopAccountImagePreviewOpen &&
          activeShopAccount &&
          activeShopAccount.image
        "
        class="fixed inset-0 z-[100] bg-slate-950/95 flex flex-col p-4 md:p-10 cursor-zoom-out"
        @click.self="isShopAccountImagePreviewOpen = false"
      >
        <button
          type="button"
          @click="isShopAccountImagePreviewOpen = false"
          class="absolute top-4 right-4 md:top-8 md:right-8 bg-black/50 text-white p-3 rounded-full shadow-lg hover:bg-black/80 transition-colors z-10"
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
              stroke-width="2.5"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div
          class="flex-1 flex items-center justify-center overflow-hidden h-full"
        >
          <img
            :src="`${BACKEND_URL}/uploads/shop_accounts/${activeShopAccount.image}`"
            class="max-h-full max-w-full object-contain rounded-2xl shadow-xl border border-slate-700 bg-white animate-scale-in"
            alt="QR Besar"
          />
        </div>

        <div class="text-center text-slate-300 py-6 md:py-8 font-jakarta">
          <p class="font-bold text-white text-base">
            {{ activeShopAccount.name }}
          </p>
          <p
            class="text-xs uppercase font-medium tracking-widest mt-0.5 text-amber-400 Denyut"
          >
            {{ activeShopAccount.account_number }}
          </p>
          <p class="text-[11px] text-slate-400 mt-1">
            Silahkan scan atau simpan gambar untuk membayar.
          </p>
        </div>
      </div>
    </transition>
  </Teleport>

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
        class="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
        @click.self="executeCancel"
      >
        <div
          class="bg-white rounded-3xl w-full max-w-[360px] shadow-2xl overflow-hidden p-8 text-center animate-in fade-in zoom-in-95 duration-300"
        >
          <div
            class="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-6"
            :class="{
              'bg-emerald-100 text-emerald-500': modalType === 'success',
              'bg-amber-100 text-amber-500': modalType === 'warning',
              'bg-rose-100 text-rose-500': modalType === 'error',
            }"
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
              v-else-if="modalType === 'warning'"
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
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
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

          <div v-if="modalType === 'warning'" class="flex gap-3">
            <button
              @click="executeCancel"
              class="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-black py-3.5 rounded-2xl uppercase text-xs tracking-widest transition-all"
            >
              Batal
            </button>
            <button
              @click="executeAction"
              class="flex-1 bg-rose-500 hover:bg-rose-600 text-white shadow-rose-200 shadow-lg font-black py-3.5 rounded-2xl uppercase text-xs tracking-widest transition-all active:scale-95"
            >
              {{ modalConfirmText }}
            </button>
          </div>

          <button
            v-else
            @click="executeAction"
            class="w-full text-white font-black py-4 rounded-2xl uppercase text-xs tracking-widest transition-all active:scale-95 shadow-lg"
            :class="{
              'bg-blue-600 hover:bg-blue-700 shadow-blue-200':
                modalType === 'success',
              'bg-rose-500 hover:bg-rose-600 shadow-rose-200':
                modalType === 'error',
            }"
          >
            {{ modalConfirmText }}
          </button>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter, onBeforeRouteLeave } from "vue-router";
import { useCartStore } from "../stores/cart";
import axios from "axios";

// ==========================================
// 1. KONFIGURASI & SETUP STORE
// ==========================================
const BACKEND_URL = "http://localhost/toko-emas-main";
const API_BASE_URL = `${BACKEND_URL}/index.php/api/v1`;

const cartStore = useCartStore();
const cart = computed(() => cartStore.items || []);

// ==========================================
// 2. STATE (VARIABEL REAKTIF)
// ==========================================
// State UI Checkout
const currentStep = ref(1);
const showVoucherModal = ref(false);
const selectedVoucher = ref(null);
const selectedCourier = ref(null);
const selectedBank = ref(null);
const ktpPreviewUrl = ref(null);
const buktiPreviewUrl = ref(null);
const promoInput = ref("");
const isShopAccountImagePreviewOpen = ref(false);
const isSubmitting = ref(false);
const router = useRouter();
const successData = ref(null);
const showTrackingModal = ref(false);

const showModal = ref(false);
const modalType = ref("error"); // 'error', 'warning', 'success'
const modalTitle = ref("");
const modalMessage = ref("");
const modalConfirmAction = ref(null);
const modalCancelAction = ref(null);
const modalConfirmText = ref("Oke");

const openModal = (
  type,
  title,
  message,
  confirmAction = null,
  confirmText = "Oke",
  cancelAction = null,
) => {
  modalType.value = type;
  modalTitle.value = title;
  modalMessage.value = message;
  modalConfirmAction.value = confirmAction;
  modalConfirmText.value = confirmText;
  modalCancelAction.value = cancelAction;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  modalConfirmAction.value = null;
  modalCancelAction.value = null;
};

const executeCancel = () => {
  if (modalCancelAction.value) modalCancelAction.value();
  closeModal();
};

const executeAction = () => {
  if (modalConfirmAction.value) modalConfirmAction.value();
  else closeModal();
};

// ==========================================
// 🔥 LOGIKA UTAMA EKSEKUSI VOUCHER / KUPON
// ==========================================
const vouchers = ref([]); // Menampung list voucher dari database
const isCheckingPromo = ref(false);

// Ambil daftar voucher aktif dari database untuk diisi ke modal pop-up
const fetchAvailableVouchers = async () => {
  const token = localStorage.getItem("token");
  if (!token) return;
  try {
    const response = await axios.get(`${API_BASE_URL}/vouchers`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.data.status) {
      vouchers.value = response.data.data.map((v) => ({
        id: v.id,
        code: v.code,
        title: v.title,

        // 🔥 PERBAIKAN: Format tampilan dinamis (Persen vs Rupiah)
        discount_display:
          v.discount_type === "percent"
            ? `${parseFloat(v.discount_value)}%`
            : `Rp ${formatPrice(parseFloat(v.discount_value))}`,

        discount_raw: parseFloat(v.discount_value),
        discount_type: v.discount_type,
        minSpend: formatPrice(parseFloat(v.min_purchase)),
        minSpend_raw: parseFloat(v.min_purchase),
        expiry: formatDateIndo(v.end_date),
        status: "SIAP PAKAI",
      }));
    }
  } catch (err) {
    console.error("Gagal mengambil voucher:", err);
  }
};

// Eksekusi untuk Kode Promo yang diketik MANUAL
const cekKodePromoManual = async () => {
  if (!promoInput.value) return;
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    isCheckingPromo.value = true;
    const response = await axios.post(
      `${API_BASE_URL}/vouchers/validate`,
      {
        code: promoInput.value,
        cart_total: totalPrice.value,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    if (response.data.status) {
      selectedVoucher.value = response.data.data;

      // 🔥 PERBAIKAN: Ubah "error" menjadi "success" Bos!
      openModal(
        "success", // 👈 Tipe Sukses
        "Promo Berhasil!", // Judul
        `Kode promo ${response.data.data.code} aktif. Anda mendapat potongan harga Rp ${formatPrice(response.data.data.discount)}`, // Pesan
        null, // No Action
        "Oke", // Teks Tombol
      );
    }
  } catch (error) {
    selectedVoucher.value = null;
    const msg = error.response?.data?.message || "Kode promo tidak valid bos.";
    openModal("error", "Gagal Terapkan Promo", msg); // Tetap error untuk catch
  } finally {
    isCheckingPromo.value = false;
  }
};

// Eksekusi ketika memilih voucher dari KLIK DAFTAR MODAL POP-UP
const applyVoucher = async (v) => {
  // Amankan validasi lokal sebelum tembak server
  if (totalPrice.value < v.minSpend_raw) {
    openModal(
      "error",
      "Syarat Belum Cukup",
      "Total belanja Anda belum memenuhi syarat minimal belanja kupon ini Bos.",
    );
    return;
  }

  promoInput.value = v.code;
  await cekKodePromoManual(); // Lempar ke validator server untuk kalkulasi final
  showVoucherModal.value = false; // Tutup modal voucher
};

const batalkanVoucher = () => {
  selectedVoucher.value = null;
  promoInput.value = "";
};

// 🔥 Modifikasi fungsi pembantu isVoucherEligible reaktif
const isVoucherEligible = (v) => {
  return totalPrice.value >= v.minSpend_raw;
};

const formatTimeIndo = () => {
  const d = new Date();
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  })
    .format(d)
    .replace(/\./g, ":");
};
const formatDateIndo = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d);
};

const goToHome = () => {
  router.push("/");
};

// State Data dari API
const rawTaxValue = ref(0);
const couriers = ref([]);
const paymentBanks = ref([]);
const shopAccounts = ref([]); // Data rekening tujuan toko

// State Form Data (Payload utama yang akan dikirim ke backend)
const form = ref({
  invoiceNumber: "", // Terisi otomatis
  email: "",
  firstName: "",
  lastName: "",
  location: "Indonesia",
  province: "",
  regency: "",
  district: "",
  village: "",
  fullAddress: "",
  postalCode: "",
  phone: "",
  note: "", // Catatan untuk penjual
  paymentDate: "",
  targetBank: "",
  accountNumber: "",
  accountName: "",
  ktpBlobFile: null,
  buktiBlobFile: null,
});

// ==========================================
// 3. COMPUTED PROPERTIES (KALKULASI OTOMATIS)
// ==========================================
const activeShopAccount = computed(() => {
  return shopAccounts.value.find((acc) => acc.id === form.value.targetBank);
});

const totalPrice = computed(() => cartStore.totalPrice);
const taxFee = computed(() => rawTaxValue.value);

const deliveryFee = computed(() => {
  const activeCourier = couriers.value.find(
    (c) => c.id === selectedCourier.value,
  );
  return activeCourier ? activeCourier.rawPrice : 0;
});

const finalTotalPrice = computed(() => {
  const discountAmount = selectedVoucher.value
    ? parsePrice(selectedVoucher.value.discount)
    : 0;
  const subTotalCalculated =
    totalPrice.value - discountAmount + deliveryFee.value + taxFee.value;
  return subTotalCalculated < 0 ? 0 : subTotalCalculated;
});

// ==========================================
// 4. HELPER FUNCTIONS (FUNGSI BANTUAN UTILITY)
// ==========================================
const getQty = (item) => parseInt(item.qty) || parseInt(item.quantity) || 1;

const getImageUrl = (img) => {
  if (!img) return "";
  if (img.startsWith("http://") || img.startsWith("https://")) return img;
  return `${BACKEND_URL}/uploads/products/${img}`;
};

const parsePrice = (priceStr) => {
  if (!priceStr) return 0;
  if (typeof priceStr === "number") return Math.floor(priceStr);
  if (String(priceStr).toLowerCase() === "gratis") return 0;

  const withoutDecimal = String(priceStr).split(".")[0];
  return parseInt(withoutDecimal.replace(/[^0-9]/g, "")) || 0;
};

const formatPrice = (val) => new Intl.NumberFormat("id-ID").format(val);

const generateInvoiceNumber = () => {
  const date = new Date();
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const random = Math.floor(1000 + Math.random() * 9000);
  form.value.invoiceNumber = `ORD-${yyyy}${mm}${dd}-${random}`;
};

// ==========================================
// 5. API FETCHING (PENARIKAN DATA BACKEND)
// ==========================================
const fetchSettings = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/settings`);
    const taxSetting = response.data.data.find(
      (s) => s.key === "tax_percentage",
    );
    if (taxSetting) rawTaxValue.value = parseInt(taxSetting.value) || 0;
  } catch (err) {
    console.warn("Menggunakan nilai PPN default 2500", err);
    rawTaxValue.value = 2500;
  }
};

const fetchUserProfile = async () => {
  const token = localStorage.getItem("token");
  if (!token) return;
  try {
    const response = await axios.get(`${API_BASE_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = response.data.data;
    const fullName = data.name || "";
    const nameParts = fullName.trim().split(" ");
    form.value.firstName = nameParts[0] || "";
    form.value.lastName =
      nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";
    form.value.email = data.email || "";
    form.value.phone = data.phone || "";
    form.value.fullAddress = data.address || "";
  } catch (err) {
    console.error("Gagal ambil data user", err);
  }
};

const fetchShippingMethods = async () => {
  const token = localStorage.getItem("token");
  if (!token) return;
  try {
    const response = await axios.get(`${API_BASE_URL}/shipping`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const rawData = response.data.data || [];
    couriers.value = rawData.map((item) => {
      const costValue = parseInt(item.cost) || 0;
      return {
        id: item.id,
        name: item.name,
        desc: item.description || "Estimasi pengiriman standar",
        rawPrice: costValue,
        price: costValue === 0 ? "Gratis" : `Rp ${formatPrice(costValue)}`,
        image: item.image
          ? `${BACKEND_URL}/uploads/couriers/${item.image}`
          : null,
      };
    });
  } catch (err) {
    console.error("Gagal mengambil data kurir", err);
  }
};

const fetchPaymentMethods = async () => {
  const token = localStorage.getItem("token");
  if (!token) return;
  try {
    const response = await axios.get(`${API_BASE_URL}/payments`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const rawData = response.data.data || [];
    paymentBanks.value = rawData.map((item) => ({
      id: item.id,
      code: item.code,
      name:
        item.name +
        (item.category === "bank_transfer" ? " Virtual Account" : ""),
      image: item.image
        ? `${BACKEND_URL}/uploads/payment_methods/${item.image}`
        : null,
    }));
  } catch (err) {
    console.error("Gagal memuat metode pembayaran dari database", err);
  }
};

const fetchShopAccounts = async () => {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const response = await axios.get(`${API_BASE_URL}/shop-accounts`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    shopAccounts.value = response.data.data || [];
  } catch (err) {
    console.error("Gagal mengambil data rekening toko", err);
  }
};

// ==========================================
// 6. EVENT HANDLERS (STEPPER & UPLOADS)
// ==========================================
const nextStep = () => {
  currentStep.value = 2;
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const handleNextToPayment = () => {
  if (!selectedCourier.value) {
    openModal(
      "error",
      "Kurir Belum Dipilih",
      "Silakan pilih metode pengiriman (kurir) terlebih dahulu ya!",
    );
    return;
  }
  currentStep.value = 3;
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const handleFinishOrder = () => {
  if (!selectedBank.value) {
    openModal(
      "error",
      "Bank Belum Dipilih",
      "Silakan pilih metode pembayaran bank terlebih dahulu ya!",
    );
    return;
  }
  currentStep.value = 4;
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const sanitizeNumberOnly = (event, fieldName, isFormObj = true) => {
  const value = event.target.value;
  const cleanedValue = value.replace(/[^0-9]/g, "");
  if (isFormObj) form.value[fieldName] = cleanedValue;
  event.target.value = cleanedValue;
};

const validateImageUpload = (event, maxMb = 2) => {
  const file = event.target.files[0];
  if (!file) return null;
  const allowedExtensions = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedExtensions.includes(file.type)) {
    openModal(
      "error",
      "Format Tidak Didukung",
      "Mohon unggah gambar berformat JPG, PNG, atau WebP.",
    );
    event.target.value = "";
    return null;
  }
  if (file.size > maxMb * 1024 * 1024) {
    openModal(
      "error",
      "Ukuran Terlalu Besar",
      `Maksimal ukuran gambar untuk form ini adalah ${maxMb}MB.`,
    );
    event.target.value = "";
    return null;
  }
  return file;
};

const handleKtpChange = (event) => {
  const file = validateImageUpload(event, 2);
  if (file) {
    if (ktpPreviewUrl.value) URL.revokeObjectURL(ktpPreviewUrl.value);
    form.value.ktpBlobFile = file;
    ktpPreviewUrl.value = URL.createObjectURL(file);
  }
};

const handleBuktiChange = (event) => {
  const file = validateImageUpload(event, 3);
  if (file) {
    if (buktiPreviewUrl.value) URL.revokeObjectURL(buktiPreviewUrl.value);
    form.value.buktiBlobFile = file;
    buktiPreviewUrl.value = URL.createObjectURL(file);
  }
};

const clearKtpPreview = (event) => {
  event.stopPropagation();
  event.preventDefault();
  if (ktpPreviewUrl.value) URL.revokeObjectURL(ktpPreviewUrl.value);
  ktpPreviewUrl.value = null;
  form.value.ktpBlobFile = null;
  const input = document.querySelector('input[accept*="image/"]');
  if (input) input.value = "";
};

const clearBuktiPreview = (event) => {
  event.stopPropagation();
  event.preventDefault();
  if (buktiPreviewUrl.value) URL.revokeObjectURL(buktiPreviewUrl.value);
  buktiPreviewUrl.value = null;
  form.value.buktiBlobFile = null;
  const input = document.querySelector('input[class="hidden"]');
  if (input) input.value = "";
};

// ==========================================
// 7. FINAL SUBMISSION HANDLER (ENTERPRISE LEVEL)
// ==========================================
const handleConfirmPayment = (event) => {
  const formElement = event?.target?.closest("form");
  if (formElement && !formElement.checkValidity()) {
    formElement.reportValidity();
    return;
  }

  // Cek apakah gambar bukti sudah dimasukkan
  if (!form.value.buktiBlobFile) {
    openModal(
      "error",
      "Bukti Wajib Diunggah",
      "Tunggu! Gambar bukti pembayaran wajib diunggah Bos.",
    );
    return;
  }

  // MUNCULKAN POP-UP KONFIRMASI PEMBAYARAN MINIMALIS
  openModal(
    "warning",
    "Konfirmasi Pembayaran?",
    "Pastikan nominal transfer dan data yang Anda masukkan sudah sesuai. Kirim bukti transaksi Anda sekarang, Bos?",
    () => {
      executeFinalCheckout(); // Jika klik 'Ya, Kirim', jalankan fungsi di bawah
    },
    "Ya, Kirim", // Teks tombol kanan kustom
  );
};

// 🔥 LANGKAH 2: Eksekutor Asli Kirim Data ke API (Dijalankan dari dalam Modal)
const executeFinalCheckout = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    openModal(
      "error",
      "Sesi Habis",
      "Sesi Anda telah habis. Silakan login kembali!",
      () => {
        closeModal();
        router.push("/login");
      },
    );
    return;
  }

  // Tutup modal konfirmasi dulu, lalu nyalakan loading full screen/tombol
  closeModal();
  isSubmitting.value = true;

  try {
    const formData = new FormData();

    // Data Pembeli & Alamat
    formData.append("firstName", form.value.firstName);
    formData.append("lastName", form.value.lastName);
    formData.append("email", form.value.email);
    formData.append("phone", form.value.phone);
    formData.append("location", form.value.location);
    formData.append("province", form.value.province);
    formData.append("regency", form.value.regency);
    formData.append("district", form.value.district);
    formData.append("village", form.value.village);
    formData.append("fullAddress", form.value.fullAddress);
    formData.append("postalCode", form.value.postalCode);

    // Data Transaksi
    formData.append("invoiceNumber", form.value.invoiceNumber);
    formData.append("paymentDate", form.value.paymentDate);
    formData.append("targetBank", form.value.targetBank);
    formData.append("accountNumber", form.value.accountNumber);
    formData.append("accountName", form.value.accountName);
    formData.append("note", form.value.note);
    formData.append("selectedCourier", selectedCourier.value);
    formData.append("selectedBank", selectedBank.value);

    formData.append(
      "voucher_id",
      selectedVoucher.value ? selectedVoucher.value.id : "",
    );

    // Lampiran File Gambar
    formData.append("buktiBlobFile", form.value.buktiBlobFile);
    if (form.value.ktpBlobFile) {
      formData.append("ktpBlobFile", form.value.ktpBlobFile);
    }

    // Tembak API Backend
    const response = await axios.post(
      `${API_BASE_URL}/orders/checkout`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      },
    );

    if (response.data.status) {
      const activeCourierData = couriers.value.find(
        (c) => c.id === selectedCourier.value,
      );
      const activeBankData = paymentBanks.value.find(
        (b) => b.id === selectedBank.value,
      );

      const resData = response.data.data;

      successData.value = {
        invoice: resData.invoice_no || form.value.invoiceNumber,
        transactionCode: "#TRX" + Math.floor(1000000 + Math.random() * 9000000),
        paymentMethod: activeBankData ? activeBankData.name : "Bank Transfer",

        total: parseFloat(resData.grand_total),
        discount: parseFloat(resData.discount_amount),
        originalTotal:
          parseFloat(resData.subtotal) +
          parseFloat(resData.shipping_cost) +
          parseFloat(resData.admin_fee),

        targetBank: activeShopAccount.value
          ? activeShopAccount.value.name
          : "Transfer Bank",
        date: form.value.paymentDate,
        courier: activeCourierData
          ? activeCourierData.name
          : "Layanan Pengiriman",
        timeFormatted: formatTimeIndo(),
      };

      // CLEANUP KERANJANG & FORM STATE
      cartStore.clearCart();
      if (ktpPreviewUrl.value) URL.revokeObjectURL(ktpPreviewUrl.value);
      if (buktiPreviewUrl.value) URL.revokeObjectURL(buktiPreviewUrl.value);

      form.value = {
        invoiceNumber: "",
        email: "",
        firstName: "",
        lastName: "",
        location: "Indonesia",
        province: "",
        regency: "",
        district: "",
        village: "",
        fullAddress: "",
        postalCode: "",
        phone: "",
        note: "",
        paymentDate: "",
        targetBank: "",
        accountNumber: "",
        accountName: "",
        ktpBlobFile: null,
        buktiBlobFile: null,
      };

      selectedCourier.value = null;
      selectedBank.value = null;
      selectedVoucher.value = null;
      ktpPreviewUrl.value = null;
      buktiPreviewUrl.value = null;
      promoInput.value = "";

      const fileInputs = document.querySelectorAll('input[type="file"]');
      fileInputs.forEach((input) => (input.value = ""));

      // Pindah ke Step 5 (Card Bukti Bayar & Resi)
      generateInvoiceNumber();
      currentStep.value = 5;
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  } catch (error) {
    console.error("Error saat Checkout:", error);
    const errorMsg =
      error.response?.data?.message ||
      "Terjadi kesalahan fatal pada server saat memproses pesanan.";
    openModal("error", "Proses Gagal", errorMsg);
  } finally {
    isSubmitting.value = false;
  }
};

// ==========================================
// 8. LIFECYCLE & ROUTE GUARDS
// ==========================================
onMounted(() => {
  window.scrollTo(0, 0);
  generateInvoiceNumber(); // Otomatis buat invoice saat halaman dimuat
  fetchUserProfile();
  fetchSettings();
  fetchShippingMethods();
  fetchPaymentMethods();
  fetchShopAccounts();
  fetchAvailableVouchers();
});

onBeforeRouteLeave((to, from, next) => {
  // Jika form masih kosong atau pesanan sudah sukses (step 5), izinkan pindah langsung
  if (
    (currentStep.value === 1 && !form.value.email) ||
    currentStep.value === 5
  ) {
    next();
    return;
  }

  // Panggil Modal Penahan Route
  openModal(
    "warning",
    "Batalkan Checkout?",
    "Apakah Anda yakin ingin keluar dari halaman checkout? Semua data informasi yang Anda isi akan tereset!",
    () => {
      // 🔥 JIKA KLIK "YA, KELUAR"
      if (ktpPreviewUrl.value) URL.revokeObjectURL(ktpPreviewUrl.value);
      if (buktiPreviewUrl.value) URL.revokeObjectURL(buktiPreviewUrl.value);
      closeModal();
      next(); // Izinkan Vue Router berpindah halaman
    },
    "Ya, Keluar",
    () => {
      // 🔥 JIKA KLIK "BATAL"
      next(false); // Beri tahu Vue Router untuk membatalkan niat pindah halaman
    },
  );
});
</script>
