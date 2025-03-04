<script setup lang="ts">
import Swal from 'sweetalert2'
import { format } from 'date-fns'

const pageTitle = useVueroContext<string>('page-title')
onMounted(() => {
  pageTitle.value = 'Tambah Master Mobil'
})

useHead(() => ({
  title: 'Tambah Master Mobil - Konfigurasi - TAG',
}))

/* const notyf = new Notyf({
  position: {
    x: 'center', // Posisi horizontal (bisa 'left' atau 'right')
    y: 'top' // Posisi vertikal (ubah ke 'bottom' jika ingin di bawah)
  }
}) */
const { y } = useWindowScroll()

const router = useRouter()
const $fetch = useApiFetch()
const notyf = useNotyf()
const { onceError } = useImageError()
const isStuck = computed(() => {
  return y.value > 30
})
const isLoading = ref(false)
const isUploading = ref(false)

const Photo = ref('')
const nopol = ref('')
const body = ref('')
const warna = ref('')
const type = ref('')
const kduser = ref('')
const kdlokasi = ref('')
const rental = ref('')
const vendor = ref('')
const tahun = ref('')
const tglstnk = ref('')
const tglpajak = ref('')
const tglawalsewa = ref(null)
const tglakhirsewa = ref(null)
const harga = ref(0)
const ppn = ref(0)
const nilaippn = computed(() => {
  return harga.value && ppn.value
    ? (harga.value * ppn.value) / 100
    : 0
})
const total = computed(() => {
  return harga.value ? harga.value + nilaippn.value : 0
})
/* cheklis */
const foglamp = ref('Ada')
const foglampket = ref(null)
const gps = ref('Ada')
const gpsket = ref(null)
const stnk = ref('Ada')
const stnkket = ref(null)
const kir = ref('Ada')
const kirket = ref(null)
const kartubensi = ref('Ada')
const kartubensiket = ref(null)
const gembok = ref('Ada')
const gembokket = ref(null)
const dongkrak = ref('Ada')
const dongkrakket = ref(null)
const kunci = ref('Ada')
const kunciket = ref(null)
const ban = ref('Ada')
const banket = ref(null)
const apar = ref('Ada')
const aparket = ref(null)
const safety = ref('Ada')
const safetyket = ref(null)

const cabangOptions = ref([])
const bagianOptions = ref([])

async function fetchCombo() {
  try {
    const resData = await $fetch(`Combo/ComboFormMobil`)
    // console.log(resData)
    // Pastikan resData tidak null sebelum assign
    if (resData) {
      cabangOptions.value = resData.cabang
      bagianOptions.value = resData.bagian
    }
  }
  catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message)
      if (error.message.includes('Failed to fetch')) {
        console.error('Server tidak dapat dijangkau. Cek koneksi backend.')
        notyf.error('Server tidak dapat dijangkau. Cek koneksi backend.')
      }
      else {
        console.error('Fetch error:', error.message)
        notyf.error(`Fetch error: ${error?.message || 'Unknown error'}`)
      }
    }
    else {
      console.error('Error lainnya:', error)
      notyf.error(`Error lainnya: ${JSON.stringify(error)}`)
    }
  }
  finally {
    isLoading.value = false
  }
}

const formatDate = (date: Date | null) => {
  return date ? format(date, 'dd-MM-yyyy') : ''
}
const onSubmit = async () => {
  console.log('Form submitted!')
  if (isLoading.value) return

  if (!nopol.value) {
    notyf.error('No polisi wajib diisi')
    return
  }
  if (!body.value) {
    notyf.error('Body mobil wajib diisi')
    return
  }
  if (!warna.value) {
    notyf.error('Warna mobil wajib diisi')
    return
  }
  if (!type.value) {
    notyf.error('Type mobil wajib diisi')
    return
  }
  if (!kduser.value) {
    notyf.error('User wajib diisi')
    return
  }
  if (!kdlokasi.value) {
    notyf.error('Lokasi mobil wajib diisi')
    return
  }
  if (!tahun.value) {
    notyf.error('Tahun mobil wajib diisi')
    return
  }
  if (!tglstnk.value) {
    notyf.error('Tanggal STNK mobil wajib diisi')
    return
  }
  if (!tglpajak.value) {
    notyf.error('Tanggal Pajak mobil wajib diisi')
    return
  }
  isLoading.value = true
  try {
    const payload = {
      Photo: Photo.value == '' ? null : Photo.value,
      nopol: nopol.value,
      body: body.value,
      warna: warna.value,
      type: type.value,
      kduser: kduser.value,
      kdlokasi: kdlokasi.value,
      rental: rental.value,
      vendor: vendor.value,
      tahun: tahun.value,
      tglstnk: tglstnk.value,
      tglpajak: tglpajak.value,
      tglawalsewa: tglawalsewa.value,
      tglakhirsewa: tglakhirsewa.value,
      harga: harga.value,
      ppn: ppn.value,
      nilaippn: nilaippn.value,
      total: total.value,
      foglamp: foglamp.value,
      foglampket: foglamp.value == 'Ada' ? null : foglampket.value,
      gps: gps.value,
      gpsket: gps.value == 'Ada' ? null : gpsket.value,
      stnk: stnk.value,
      stnkket: stnk.value == 'Ada' ? null : stnkket.value,
      kir: kir.value,
      kirket: kir.value == 'Ada' ? null : kirket.value,
      kartubensi: kartubensi.value,
      kartubensiket: kartubensi.value == 'Ada' ? null : kartubensiket.value,
      gembok: gembok.value,
      gembokket: gembok.value == 'Ada' ? null : gembokket.value,
      dongkrak: dongkrak.value,
      dongkrakket: dongkrak.value == 'Ada' ? null : dongkrakket.value,
      kunci: kunci.value,
      kunciket: kunci.value == 'Ada' ? null : kunciket.value,
      ban: ban.value,
      banket: ban.value == 'Ada' ? null : banket.value,
      apar: apar.value,
      aparket: apar.value == 'Ada' ? null : aparket.value,
      safety: safety.value,
      safetyket: safety.value == 'Ada' ? null : safetyket.value,
    }
    console.log(payload)
    const response = await $fetch('MasterMobil', {
      method: 'POST',
      body: payload,
    })

    if (response) {
      let code = response.metadata.code
      let message = response.metadata.message
      if (code == '200') {
        Swal.fire({
          title: 'Sukses!',
          text: message,
          icon: 'success',
          confirmButtonText: 'OK',
        })
        router.push('/konfigurasi/master-data/master-mobil')
      }
      else {
        Swal.fire({
          title: 'Pesan!',
          text: message,
          icon: 'error',
          confirmButtonText: 'OK',
        })
        return
      }
    }
  }
  catch (error) {
    // notyf.error(error)
    console.log(error)
  }
  finally {
    isLoading.value = false
  }
}

const onAddFile = (error: any, file: any) => {
  if (error) {
    console.error(error)
    return
  }

  console.log('file added', file.file)
  const reader = new FileReader()
  reader.readAsDataURL(file.file) // Konversi file ke base64
  reader.onload = () => {
    Photo.value = reader.result as string // Simpan base64 ke variabel
    console.log('File added (base64):', Photo.value)
  }
  reader.onerror = (err) => {
    console.error('Error reading file:', err)
  }
  console.log(Photo.value)
}
const onRemoveFile = (error: any, file: any) => {
  if (error) {
    console.error(error)
    return
  }

  console.log('file removed', file)
  Photo.value = ''
}

onMounted(() => {
  fetchCombo()
})
</script>

<template>
  <form
    method="post"
    novalidate
    class="form-layout is-split"
    @submit.prevent="onSubmit"
  >
    <div class="form-outer">
      <div
        :class="[isStuck && 'is-stuck']"
        class="form-header stuck-header"
      >
        <div class="form-header-inner">
          <div class="left">
            <h3>Form Master Mobil</h3>
          </div>
          <div class="right">
            <div class="buttons">
              <VButton
                icon="lnir lnir-arrow-left rem-100"
                to="/konfigurasi/master-data/master-mobil"
                light
                dark-outlined
                :disabled="isLoading"
              >
                Kembali
              </VButton>
              <VButton
                type="submit"
                color="primary"
                raised
                :loading="isLoading"
                :disabled="isLoading"
              >
                Save
              </VButton>
            </div>
          </div>
        </div>
      </div>
      <div class="form-body">
        <VLoader
          card="regular"
          size="small"
          :active="isLoading"
          translucent
        >
          <div class="fieldset" style="margin-top: 15px;font-family: var(--font-alt);font-weight: 600;color: var(--dark-text);font-size: 0.95rem;">
            <VAvatar
              size="xl"
              class="profile-v-avatar"
            >
              <template #avatar>
                <img
                  v-if="!isUploading"
                  class="avatar"
                  src="/images/avatars/box-truck.png"
                  alt=""
                  @error.once="onceError($event, 150)"
                >
                <VFilePond
                  v-else
                  class="profile-filepond"
                  name="profile_filepond"
                  :chunk-retry-delays="[500, 1000, 3000]"
                  label-idle="<i class='lnil lnil-cloud-upload'></i>"
                  :accepted-file-types="['image/png', 'image/jpeg', 'image/gif']"
                  :image-preview-height="140"
                  :image-resize-target-width="140"
                  :image-resize-target-height="140"
                  image-crop-aspect-ratio="1:1"
                  style-panel-layout="compact circle"
                  style-load-indicator-position="center bottom"
                  style-progress-indicator-position="right bottom"
                  style-button-remove-item-position="left bottom"
                  style-button-process-item-position="right bottom"
                  @addfile="onAddFile"
                  @removefile="onRemoveFile"
                />
                <VIconButton
                  v-if="!isUploading"
                  icon="lucide:edit-2"
                  class="edit-button is-edit"
                  circle
                  tabindex="0"
                  @keydown.enter.prevent="isUploading = true"
                  @click="isUploading = true"
                />
                <VIconButton
                  v-else
                  icon="lucide:arrow-left"
                  class="edit-button is-back"
                  circle
                  tabindex="0"
                  @keydown.enter.prevent="isUploading = false"
                  @click="isUploading = false"
                />
              </template>
            </VAvatar>
          </div>
          <h3 class="has-text-centered" style="font-size:larger;">
            Unit Kendaraan Operasional
          </h3>
          <div class="form-section">
            <div class="left">
              <div class="columns is-multiline">
                <div class="column is-6">
                  <VField>
                    <VLabel>Nopol <span style="color: red;">*</span></VLabel>
                    <VControl icon="fas fa-barcode">
                      <VInput
                        v-model="nopol"
                        type="text"
                        placeholder=""
                        autocomplete="norm"
                      />
                    </VControl>
                  </VField>
                </div>
                <div class="column is-6">
                  <VField>
                    <VLabel>Body <span style="color: red;">*</span></VLabel>
                    <VControl icon="fas fa-car">
                      <VInput
                        v-model="body"
                        type="text"
                        placeholder=""
                        autocomplete="norm"
                      />
                    </VControl>
                  </VField>
                </div>
                <div class="column is-6">
                  <VField>
                    <VLabel>Warna <span style="color: red;">*</span></VLabel>
                    <VControl icon="fas fa-fill-drip">
                      <VInput
                        v-model="warna"
                        type="text"
                        placeholder=""
                        autocomplete="norm"
                      />
                    </VControl>
                  </VField>
                </div>
                <div class="column is-6">
                  <VField>
                    <VLabel>Type <span style="color: red;">*</span></VLabel>
                    <VControl icon="fas fa-adjust">
                      <VInput
                        v-model="type"
                        type="text"
                        placeholder=""
                        autocomplete="norm"
                      />
                    </VControl>
                  </VField>
                </div>
                <div class="column is-6">
                  <VField class="is-autocomplete-select">
                    <VLabel>User</VLabel>
                    <VControl icon="lucide:user">
                      <Multiselect
                        v-model="kduser"
                        :options="bagianOptions"
                        label="label"
                        track-by="label"
                        placeholder="Pilih User..."
                        :searchable="true"
                      />
                    </VControl>
                  </VField>
                </div>
                <div class="column is-6">
                  <VField v-slot="{ id }" class="is-autocomplete-select">
                    <VLabel>Lokasi</VLabel>
                    <VControl icon="fas fa-map-marker-alt">
                      <Multiselect
                        v-model="kdlokasi"
                        :attrs="{ id }"
                        :options="cabangOptions"
                        label="label"
                        track-by="label"
                        placeholder="Pilih Lokasi..."
                        :searchable="true"
                      />
                    </VControl>
                  </VField>
                </div>
                <div class="column is-6">
                  <VField>
                    <VLabel>Rental</VLabel>
                    <VControl icon="fas fa-people-carry">
                      <VInput
                        v-model="rental"
                        type="text"
                        placeholder=""
                        autocomplete="norm"
                      />
                    </VControl>
                  </VField>
                </div>
                <div class="column is-6">
                  <VField>
                    <VLabel>Vendor</VLabel>
                    <VControl icon="fas fa-handshake">
                      <VInput
                        v-model="vendor"
                        type="text"
                        placeholder=""
                        autocomplete="norm"
                      />
                    </VControl>
                  </VField>
                </div>
              </div>
            </div>

            <div class="right">
              <div class="columns is-multiline">
                <div class="column is-4">
                  <VField>
                    <VLabel>Tahun <span style="color: red;">*</span></VLabel>
                    <VControl icon="fas fa-calendar-alt">
                      <VInput
                        v-model="tahun"
                        type="number"
                        placeholder=""
                        autocomplete="norm"
                      />
                    </VControl>
                  </VField>
                </div>
                <div class="column is-4">
                  <ClientOnly>
                    <VDatePicker
                      v-model="tglpajak"
                      color="green"
                      trim-weeks
                    >
                      <template #default="{ inputValue, inputEvents }">
                        <VField>
                          <VLabel>Tanggal Pajak <span style="color: red;">*</span></VLabel>
                          <VControl icon="lucide:calendar">
                            <input
                              class="input v-input"
                              type="text"
                              placeholder="Pilih Tanggal"
                              :value="formatDate(inputValue)"
                              v-on="inputEvents"
                            >
                          </VControl>
                        </VField>
                      </template>
                    </VDatePicker>
                  </ClientOnly>
                </div>
                <div class="column is-4">
                  <ClientOnly>
                    <VDatePicker
                      v-model="tglstnk"
                      color="green"
                      trim-weeks
                    >
                      <template #default="{ inputValue, inputEvents }">
                        <VField>
                          <VLabel>Tanggal STNK <span style="color: red;">*</span></VLabel>
                          <VControl icon="lucide:calendar">
                            <input
                              class="input v-input"
                              type="text"
                              placeholder="Pilih Tanggal"
                              :value="formatDate(inputValue)"
                              v-on="inputEvents"
                            >
                          </VControl>
                        </VField>
                      </template>
                    </VDatePicker>
                  </ClientOnly>
                </div>
                <div class="column is-6">
                  <ClientOnly>
                    <VDatePicker
                      v-model="tglawalsewa"
                      color="green"
                      trim-weeks
                    >
                      <template #default="{ inputValue, inputEvents }">
                        <VField>
                          <VLabel>Tanggal Mulai Sewa</VLabel>
                          <VControl icon="lucide:calendar">
                            <input
                              class="input v-input"
                              type="text"
                              placeholder="Pilih Tanggal"
                              :value="formatDate(inputValue)"
                              v-on="inputEvents"
                            >
                          </VControl>
                        </VField>
                      </template>
                    </VDatePicker>
                  </ClientOnly>
                </div>
                <div class="column is-6">
                  <ClientOnly>
                    <VDatePicker
                      v-model="tglakhirsewa"
                      color="green"
                      trim-weeks
                    >
                      <template #default="{ inputValue, inputEvents }">
                        <VField>
                          <VLabel>Tanggal Akhir Sewa</VLabel>
                          <VControl icon="lucide:calendar">
                            <input
                              class="input v-input"
                              type="text"
                              placeholder="Pilih Tanggal"
                              :value="formatDate(inputValue)"
                              v-on="inputEvents"
                            >
                          </VControl>
                        </VField>
                      </template>
                    </VDatePicker>
                  </ClientOnly>
                </div>
                <div class="column is-6">
                  <VField>
                    <VLabel>Harga</VLabel>
                    <VControl icon="fas fa-money-bill-wave">
                      <VInput
                        v-model.number="harga"
                        type="number"
                        placeholder=""
                        autocomplete="norm"
                      />
                    </VControl>
                  </VField>
                </div>
                <div class="column is-6">
                  <VField>
                    <VLabel>PPN</VLabel>
                    <VControl icon="fas fa-money-bill-wave">
                      <VInput
                        v-model.number="ppn"
                        type="number"
                        placeholder=""
                        autocomplete="norm"
                      />
                    </VControl>
                  </VField>
                </div>
                <div class="column is-6">
                  <VField>
                    <VLabel>Nilai PPN</VLabel>
                    <VControl icon="fas fa-money-bill-wave">
                      <VInput
                        v-model.number="nilaippn"
                        type="number"
                        placeholder=""
                        autocomplete="norm"
                        readonly
                      />
                    </VControl>
                  </VField>
                </div>
                <div class="column is-6">
                  <VField>
                    <VLabel>Total</VLabel>
                    <VControl icon="fas fa-money-bill-wave">
                      <VInput
                        v-model.number="total"
                        type="number"
                        placeholder=""
                        autocomplete="norm"
                        readonly
                      />
                    </VControl>
                  </VField>
                </div>
              </div>
            </div>
          </div>

          <h3 class="has-text-centered title-cehklis" style="font-size:larger;padding-top: 15px;">
            Cheklist Kelengkapan Kendaraan
          </h3>
          <div class="form-section is-grey">
            <!-- bagian kiri -->
            <div class="left">
              <div class="column is-12">
                <VField>
                  <VLabel>Foglamp</VLabel>
                  <VControl>
                    <VRadio
                      v-model="foglamp"
                      name="foglamp"
                      color="primary"
                      value="Ada"
                    >
                      Ada
                    </VRadio>
                    <VRadio
                      v-model="foglamp"
                      name="foglamp"
                      value="Tidak Ada"
                    >
                      Tidak Ada
                    </VRadio>
                  </VControl>
                </VField>
              </div>
              <div v-if="foglamp === 'Tidak Ada'" class="column is-12">
                <VField>
                  <VLabel>Keterangan</VLabel>
                  <VControl icon="fas fa-handshake">
                    <VInput
                      v-model="foglampket"
                      type="text"
                      placeholder=""
                      autocomplete="norm"
                    />
                  </VControl>
                </VField>
              </div>
              <!--  -->
              <div class="column is-12">
                <VField>
                  <VLabel>GPS</VLabel>
                  <VControl>
                    <VRadio
                      v-model="gps"
                      name="gps"
                      color="primary"
                      value="Ada"
                    >
                      Ada
                    </VRadio>
                    <VRadio
                      v-model="gps"
                      name="gps"
                      value="Tidak Ada"
                    >
                      Tidak Ada
                    </VRadio>
                  </VControl>
                </VField>
              </div>
              <div v-if="gps === 'Tidak Ada'" class="column is-12">
                <VField>
                  <VLabel>Keterangan</VLabel>
                  <VControl icon="fas fa-handshake">
                    <VInput
                      v-model="gpsket"
                      type="text"
                      placeholder=""
                      autocomplete="norm"
                    />
                  </VControl>
                </VField>
              </div>
              <!--  -->
              <div class="column is-12">
                <VField>
                  <VLabel>STNK</VLabel>
                  <VControl>
                    <VRadio
                      v-model="stnk"
                      name="stnk"
                      color="primary"
                      value="Ada"
                    >
                      Ada
                    </VRadio>
                    <VRadio
                      v-model="stnk"
                      name="stnk"
                      value="Tidak Ada"
                    >
                      Tidak Ada
                    </VRadio>
                  </VControl>
                </VField>
              </div>
              <div v-if="stnk === 'Tidak Ada'" class="column is-12">
                <VField>
                  <VLabel>Keterangan</VLabel>
                  <VControl icon="fas fa-handshake">
                    <VInput
                      v-model="stnkket"
                      type="text"
                      placeholder=""
                      autocomplete="norm"
                    />
                  </VControl>
                </VField>
              </div>
              <!--  -->
              <div class="column is-12">
                <VField>
                  <VLabel>KIR</VLabel>
                  <VControl>
                    <VRadio
                      v-model="kir"
                      name="kir"
                      color="primary"
                      value="Ada"
                    >
                      Ada
                    </VRadio>
                    <VRadio
                      v-model="kir"
                      name="kir"
                      value="Tidak Ada"
                    >
                      Tidak Ada
                    </VRadio>
                  </VControl>
                </VField>
              </div>
              <div v-if="kir === 'Tidak Ada'" class="column is-12">
                <VField>
                  <VLabel>Keterangan</VLabel>
                  <VControl icon="fas fa-handshake">
                    <VInput
                      v-model="kirket"
                      type="text"
                      placeholder=""
                      autocomplete="norm"
                    />
                  </VControl>
                </VField>
              </div>
              <!--  -->
              <div class="column is-12">
                <VField>
                  <VLabel>Kartu Bensin</VLabel>
                  <VControl>
                    <VRadio
                      v-model="kartubensi"
                      name="kartubensi"
                      color="primary"
                      value="Ada"
                    >
                      Ada
                    </VRadio>
                    <VRadio
                      v-model="kartubensi"
                      name="kartubensi"
                      value="Tidak Ada"
                    >
                      Tidak Ada
                    </VRadio>
                  </VControl>
                </VField>
              </div>
              <div v-if="kartubensi === 'Tidak Ada'" class="column is-12">
                <VField>
                  <VLabel>Keterangan</VLabel>
                  <VControl icon="fas fa-handshake">
                    <VInput
                      v-model="kartubensiket"
                      type="text"
                      placeholder=""
                      autocomplete="norm"
                    />
                  </VControl>
                </VField>
              </div>
              <!--  -->
              <div class="column is-12">
                <VField>
                  <VLabel>Gembok</VLabel>
                  <VControl>
                    <VRadio
                      v-model="gembok"
                      name="gembok"
                      color="primary"
                      value="Ada"
                    >
                      Ada
                    </VRadio>
                    <VRadio
                      v-model="gembok"
                      name="gembok"
                      value="Tidak Ada"
                    >
                      Tidak Ada
                    </VRadio>
                  </VControl>
                </VField>
              </div>
              <div v-if="gembok === 'Tidak Ada'" class="column is-12">
                <VField>
                  <VLabel>Keterangan</VLabel>
                  <VControl icon="fas fa-handshake">
                    <VInput
                      v-model="gembokket"
                      type="text"
                      placeholder=""
                      autocomplete="norm"
                    />
                  </VControl>
                </VField>
              </div>
            <!--  -->
            </div>

            <!-- bagian kanan -->
            <div class="right">
              <div class="column is-12">
                <VField>
                  <VLabel>Dongkrak / Tuas</VLabel>
                  <VControl>
                    <VRadio
                      v-model="dongkrak"
                      name="dongkrak"
                      color="primary"
                      value="Ada"
                    >
                      Ada
                    </VRadio>
                    <VRadio
                      v-model="dongkrak"
                      name="dongkrak"
                      value="Tidak Ada"
                    >
                      Tidak Ada
                    </VRadio>
                  </VControl>
                </VField>
              </div>
              <div v-if="dongkrak === 'Tidak Ada'" class="column is-12">
                <VField>
                  <VLabel>Keterangan</VLabel>
                  <VControl icon="fas fa-handshake">
                    <VInput
                      v-model="dongkrakket"
                      type="text"
                      placeholder=""
                      autocomplete="norm"
                    />
                  </VControl>
                </VField>
              </div>
              <!--  -->
              <div class="column is-12">
                <VField>
                  <VLabel>Kunci</VLabel>
                  <VControl>
                    <VRadio
                      v-model="kunci"
                      name="kunci"
                      color="primary"
                      value="Ada"
                    >
                      Ada
                    </VRadio>
                    <VRadio
                      v-model="kunci"
                      name="kunci"
                      value="Tidak Ada"
                    >
                      Tidak Ada
                    </VRadio>
                  </VControl>
                </VField>
              </div>
              <div v-if="kunci === 'Tidak Ada'" class="column is-12">
                <VField>
                  <VLabel>Keterangan</VLabel>
                  <VControl icon="fas fa-handshake">
                    <VInput
                      v-model="kunciket"
                      type="text"
                      placeholder=""
                      autocomplete="norm"
                    />
                  </VControl>
                </VField>
              </div>
              <!--  -->
              <div class="column is-12">
                <VField>
                  <VLabel>Ban Cadangan</VLabel>
                  <VControl>
                    <VRadio
                      v-model="ban"
                      name="ban"
                      color="primary"
                      value="Ada"
                    >
                      Ada
                    </VRadio>
                    <VRadio
                      v-model="ban"
                      name="ban"
                      value="Tidak Ada"
                    >
                      Tidak Ada
                    </VRadio>
                  </VControl>
                </VField>
              </div>
              <div v-if="ban === 'Tidak Ada'" class="column is-12">
                <VField>
                  <VLabel>Keterangan</VLabel>
                  <VControl icon="fas fa-handshake">
                    <VInput
                      v-model="banket"
                      type="text"
                      placeholder=""
                      autocomplete="norm"
                    />
                  </VControl>
                </VField>
              </div>
              <!--  -->
              <div class="column is-12">
                <VField>
                  <VLabel>Apar</VLabel>
                  <VControl>
                    <VRadio
                      v-model="apar"
                      name="apar"
                      color="primary"
                      value="Ada"
                    >
                      Ada
                    </VRadio>
                    <VRadio
                      v-model="apar"
                      name="apar"
                      value="Tidak Ada"
                    >
                      Tidak Ada
                    </VRadio>
                  </VControl>
                </VField>
              </div>
              <div v-if="apar === 'Tidak Ada'" class="column is-12">
                <VField>
                  <VLabel>Keterangan</VLabel>
                  <VControl icon="fas fa-handshake">
                    <VInput
                      v-model="aparket"
                      type="text"
                      placeholder=""
                      autocomplete="norm"
                    />
                  </VControl>
                </VField>
              </div>
              <!--  -->
              <div class="column is-12">
                <VField>
                  <VLabel>Safety Belt</VLabel>
                  <VControl>
                    <VRadio
                      v-model="safety"
                      name="safety"
                      color="primary"
                      value="Ada"
                    >
                      Ada
                    </VRadio>
                    <VRadio
                      v-model="safety"
                      name="safety"
                      value="Tidak Ada"
                    >
                      Tidak Ada
                    </VRadio>
                  </VControl>
                </VField>
              </div>
              <div v-if="safety === 'Tidak Ada'" class="column is-12">
                <VField>
                  <VLabel>Keterangan</VLabel>
                  <VControl icon="fas fa-handshake">
                    <VInput
                      v-model="safetyket"
                      type="text"
                      placeholder=""
                      autocomplete="norm"
                    />
                  </VControl>
                </VField>
              </div>
            <!--  -->
            </div>
          </div>
        </VLoader>
      </div>
    </div>
  </form>
</template>

<style scoped lang="scss">
@import '/@src/scss/abstracts/all';
@import '/@src/scss/components/forms-outer';

.radio {
  padding: 0 1em 0 0;
}

.field:not(:last-child) {
    margin-bottom: 0.04rem;
}

.fieldset{
  margin-bottom: 20px;
  .v-avatar {
  position: relative;
  display: block;
  margin: 0 auto;

  .edit-button {
    position: absolute;
    bottom: 0;
    inset-inline-end: 0;
  }
}
}

.column {
    padding: 0.3rem;
}

.is-navbar {
  .form-layout {
    margin-top: 30px;
  }
}

.form-layout {
  max-width: 1140px;
  margin: 0 auto;

  .title-cehklis{
    background: #fafafa;
  }
  &.is-split {
    max-width: 1240px;

    .form-outer {
      .form-body {
        padding: 0;

        .form-section {
          display: flex;
          padding: 20px;

          &.is-grey {
            background: #fafafa;
          }

          .left,
          .right {
            padding: 20px 40px;
            width: 50%;

            h3 {
              font-family: var(--font-alt);
              font-weight: 600;
              font-size: 0.95rem;
              color: var(--dark-text);
              margin-bottom: 20px;
            }
          }

          .left {
            position: relative;
            border-inline-end: 1px solid color-mix(in oklab, var(--fade-grey), black 3%);

            .operator {
              position: absolute;
              top: 17px;
              inset-inline-end: -10px;
              text-transform: uppercase;
              font-family: var(--font);
              font-weight: 500;
              color: var(--dark-text);
              background: var(--white);
              padding: 4px 0;
            }
          }

          .radio-pills {
            display: flex;
            justify-content: space-between;

            .radio-pill {
              position: relative;

              input {
                position: absolute;
                top: 0;
                inset-inline-start: 0;
                height: 100%;
                width: 100%;
                opacity: 0;
                cursor: pointer;

                &:checked {
                  + .radio-pill-inner {
                    background: var(--primary);
                    border-color: var(--primary);
                    box-shadow: var(--primary-box-shadow);
                    color: var(--white);
                  }
                }
              }

              .radio-pill-inner {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 60px;
                height: 40px;
                background: var(--white);
                border: 1px solid color-mix(in oklab, var(--fade-grey), black 3%);
                border-radius: 8px;
                font-family: var(--font);
                font-weight: 600;
                font-size: 0.9rem;
                transition:
                  color 0.3s,
                  background-color 0.3s,
                  border-color 0.3s,
                  height 0.3s,
                  width 0.3s;
              }
            }
          }
        }
      }
    }
  }
}

.is-dark {
  .form-layout {
    .title-cehklis {
      background: color-mix(in oklab, var(--dark-sidebar), white 4%) !important;
    }
    &.is-split {
      .form-outer {
        .form-body {
          .form-section {
            &.is-grey {
              background: color-mix(in oklab, var(--dark-sidebar), white 4%) !important;
            }

            h3 {
              color: var(--dark-dark-text);
            }

            .left {
              border-color: color-mix(in oklab, var(--dark-sidebar), white 12%) !important;

              .operator {
                background: color-mix(in oklab, var(--dark-sidebar), white 6%) !important;
                color: var(--dark-dark-text);
              }

              .radio-pills {
                .radio-pill {
                  input {
                    &:checked + .radio-pill-inner {
                      border-color: var(--primary);
                      background: var(--primary);
                      box-shadow: var(--primary-box-shadow);
                      color: var(--smoke-white);
                    }
                  }

                  .radio-pill-inner {
                    background: color-mix(in oklab, var(--dark-sidebar), white 2%);
                    border-color: color-mix(in oklab, var(--dark-sidebar), white 12%);
                    color: var(--dark-dark-text);
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

@media only screen and (width <= 767px) {
  .form-layout {
    &.is-split {
      .form-outer {
        .form-body {
          .form-section {
            flex-direction: column;
            padding-inline-end: 0;
            padding-inline-start: 0;

            .left,
            .right {
              width: 100%;
              padding-inline-end: 30px;
              padding-inline-start: 30px;
            }

            .left {
              border-inline-end: none;
              border-bottom: 1px solid color-mix(in oklab, var(--fade-grey), black 3%);
              padding-bottom: 40px;

              .operator {
                top: unset;
                bottom: -14px;
                inset-inline-start: 0;
                inset-inline-end: 0;
                margin: 0 auto;
                text-align: center;
                max-width: 60px;
              }
            }

            .right {
              padding-top: 30px;
            }
          }
        }
      }
    }
  }
}

@media only screen and (width >= 768px) and (width <= 1024px) and (orientation: portrait) {
  .form-layout {
    &.is-split {
      .form-outer {
        .form-body {
          .form-section {
            padding-inline-end: 0;
            padding-inline-start: 0;
          }
        }
      }
    }
  }
}
</style>
