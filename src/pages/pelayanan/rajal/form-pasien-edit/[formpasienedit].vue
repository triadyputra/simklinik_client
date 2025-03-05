<script setup lang="ts">
import Swal from 'sweetalert2'
import { format } from 'date-fns'

const pageTitle = useVueroContext<string>('page-title')
onMounted(() => {
  pageTitle.value = 'Edit Master Pasien'
})

useHead(() => ({
  title: 'Edit Master Pasien - Pelayanan - Simklinik',
}))

const { y } = useWindowScroll()

const isStuck = computed(() => {
  return y.value > 30
})

const router = useRouter()
const route = useRoute()
const paramId = route.params.formpasienedit

const isLoading = ref(false)
const $fetch = useApiFetch()
const notyf = useNotyf()
const { onceError } = useImageError()
const isUploading = ref(false)
const showPenjaminFields = ref(false)

const NoRm = ref('')
const Status = ref('Active')
const NamaLengkap = ref('')
const Tlp = ref('')
const Hp = ref('')
const Email = ref('')
const Kelamin = ref('')
const TmpLahir = ref('')
const TglLahir = ref(new Date())
const JenisIdentitas = ref('')
const NomorIdentitas = ref('')
const NamaIbuKandung = ref('')
const DesaKelurahan = ref('')
const AlamatLengkap = ref('')
const Rt = ref('')
const Rw = ref('')
const KodePos = ref('')
// const Domisi = ref('')
// const DesaKelurahanDomisili = ref('')
// const AlamatLengkapDomisili = ref('')
// const RtDomisili = ref('')
// const RwDomisili = ref('')
// const KodePosDomisili = ref('')
const GolDarah = ref('')
const StatusPerokok = ref('')
const JenisPenyakit = ref('')
const Pembiayaan = ref('')
const Penjamin = ref('')
const NomorPenjamin = ref('')
const Agama = ref('')
const StatusPernikahan = ref('')
const Pendidikan = ref('')
const Pekerjaan = ref('')
const BahasaDikuasai = ref('')
const Suku = ref('')
const Photo = ref('')

const selectStatusIconOptions = [
  { id: 'Active', value: 'Active' },
  { id: 'Non Active', value: 'Non Active' },
]
const selectKelaminIconOptions = ref([])
const selectGolDarahIconOptions = ref([])
const selectPerokoIconOptions = ref([])
const selectJenisIdentitasIconOptions = ref([])
const selectPembiayaanIconOptions = ref([])
const selectPenjaminIconOptions = ref([])
const selectAgamaIconOptions = ref([])
const selectStatusPernikahanIconOptions = ref([])
const selectPendidikanIconOptions = ref([])
const selectPekerjaanIconOptions = ref([])
const formatDate = (date: Date | null) => {
  return date ? format(date, 'dd-MM-yyyy') : ''
}

async function fetchCombo() {
  try {
    const resData = await $fetch(`Combo/ComboFormPasien`)
    // Pastikan resData tidak null sebelum assign
    if (resData) {
      selectKelaminIconOptions.value = resData.Sex || []
      selectGolDarahIconOptions.value = resData.GolDarah || []
      selectPerokoIconOptions.value = resData.Peroko || []
      selectJenisIdentitasIconOptions.value = resData.Identitas || []
      selectPembiayaanIconOptions.value = resData.Pembiayaan || []
      selectPenjaminIconOptions.value = resData.Penjamin || []

      selectAgamaIconOptions.value = resData.Agama || []
      selectStatusPernikahanIconOptions.value = resData.Pernikahan || []
      selectPendidikanIconOptions.value = resData.Pendidikan || []
      selectPekerjaanIconOptions.value = resData.Pekerjaan || []
    }
  }
  catch (error) {
    console.error('Failed to fetch data', error)
  }
}

async function fetchEditData() {
  if (!paramId) return // Jika paramId kosong, hentikan
  try {
    isLoading.value = true
    const response = await $fetch(`MasterPasien/${paramId}`) // Ambil data berdasarkan ID
    if (response) {
      let code = response.metadata.code
      let message = response.metadata.message
      let dataRes = response.response

      if (code == '200') {
        NoRm.value = dataRes.NoRm
        Status.value = dataRes.Status
        NamaLengkap.value = dataRes.NamaLengkap
        Tlp.value = dataRes.Tlp
        Hp.value = dataRes.Hp
        Email.value = dataRes.Email
        Kelamin.value = dataRes.Kelamin
        TmpLahir.value = dataRes.TmpLahir
        TglLahir.value = new Date(dataRes.TglLahir) // Konversi ke Date object
        JenisIdentitas.value = dataRes.JenisIdentitas
        NomorIdentitas.value = dataRes.NomorIdentitas
        NamaIbuKandung.value = dataRes.NamaIbuKandung
        DesaKelurahan.value = dataRes.DesaKelurahan
        AlamatLengkap.value = dataRes.AlamatLengkap
        Rt.value = dataRes.Rt
        Rw.value = dataRes.Rw
        KodePos.value = dataRes.KodePos
        GolDarah.value = dataRes.GolDarah
        StatusPerokok.value = dataRes.StatusPerokok
        JenisPenyakit.value = dataRes.JenisPenyakit
        Pembiayaan.value = dataRes.Pembiayaan
        Penjamin.value = dataRes.Penjamin
        NomorPenjamin.value = dataRes.NomorPenjamin
        Agama.value = dataRes.Agama
        StatusPernikahan.value = dataRes.StatusPernikahan
        Pendidikan.value = dataRes.Pendidikan
        Pekerjaan.value = dataRes.Pekerjaan
        BahasaDikuasai.value = dataRes.BahasaDikuasai
        Suku.value = dataRes.Suku
        Photo.value = dataRes.Photo
      }
      else {
        Swal.fire({
          title: 'Pesan!',
          text: message,
          icon: 'error',
          confirmButtonText: 'OK',
        })
        router.push('/pelayanan/rajal')
        return
      }
    }
  }
  catch (error) {
    console.error('Failed to fetch data', error)
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

  const reader = new FileReader()
  reader.readAsDataURL(file.file) // Konversi file ke base64
  reader.onload = () => {
    Photo.value = reader.result as string // Simpan base64 ke variabel
  }
  reader.onerror = (err) => {
    console.error('Error reading file:', err)
  }
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
  fetchCombo() // Muat opsi dropdown terlebih dahulu
  fetchEditData() // Ambil data edit berdasarkan ID
})

watch(Pembiayaan, (newValue: String) => {
  showPenjaminFields.value = newValue == 'Penjamin'
})

const onSubmit = async () => {
  if (isLoading.value) return

  if (!NamaLengkap.value) {
    notyf.error('Nama lengkap wajib diisi')
    return
  }
  isLoading.value = true
  try {
    const payload = {
      NoRm: NoRm.value,
      Status: Status.value,
      NamaLengkap: NamaLengkap.value,
      Tlp: Tlp.value,
      Hp: Hp.value,
      Email: Email.value,
      Kelamin: Kelamin.value,
      TmpLahir: TmpLahir.value,
      TglLahir: format(TglLahir.value, 'yyyy-MM-dd'),
      JenisIdentitas: JenisIdentitas.value,
      NomorIdentitas: NomorIdentitas.value,
      NamaIbuKandung: NamaIbuKandung.value,
      DesaKelurahan: DesaKelurahan.value,
      AlamatLengkap: AlamatLengkap.value,
      Rt: Rt.value,
      Rw: Rw.value,
      KodePos: KodePos.value,
      // Domisi: Domisi.value,
      // DesaKelurahanDomisili: DesaKelurahanDomisili.value,
      // AlamatLengkapDomisili: AlamatLengkapDomisili.value,
      // RtDomisili: RtDomisili.value,
      // RwDomisili: RwDomisili.value,
      // KodePosDomisili: KodePosDomisili.value,
      GolDarah: GolDarah.value,
      StatusPerokok: StatusPerokok.value,
      JenisPenyakit: JenisPenyakit.value,
      Pembiayaan: Pembiayaan.value,
      Penjamin: Penjamin.value,
      NomorPenjamin: NomorPenjamin.value,
      Agama: Agama.value,
      StatusPernikahan: StatusPernikahan.value,
      Pendidikan: Pendidikan.value,
      Pekerjaan: Pekerjaan.value,
      BahasaDikuasai: BahasaDikuasai.value,
      Suku: Suku.value,
      Photo: Photo.value,
    }

    const response = await $fetch(`MasterPasien/${paramId}`, {
      method: 'PUT',
      body: payload,
    })
    console.log(response)
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
            <h3>Form Pasien Baru</h3>
          </div>
          <div class="right">
            <div class="buttons">
              <VButton
                icon="lnir lnir-arrow-left rem-100"
                to="/pelayanan/rajal"
                light
                dark-outlined
              >
                Kembali
              </VButton>
              <VButton
                type="submit"
                color="primary"
                raised
                :loading="isLoading"
              >
                Update
              </VButton>
            </div>
          </div>
        </div>
      </div>
      <VLoader
        card="regular"
        size="small"
        :active="isLoading"
        translucent
      >
        <div class="form-body">
          <div class="form-section">
            <div class="left">
              <h3 class="has-text-centered">
                Informasi Personal
              </h3>

              <div class="fieldset">
                <VAvatar
                  size="xl"
                  class="profile-v-avatar"
                >
                  <template #avatar>
                    <img
                      v-if="!isUploading"
                      class="avatar"
                      :src="Photo ? Photo : '/images/avatars/svg/vuero-1.svg'"
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

              <div class="columns is-multiline">
                <div class="column is-6">
                  <VField>
                    <VLabel>NO RM</VLabel>
                    <VControl icon="lucide:user">
                      <VInput
                        v-model="NoRm"
                        type="text"
                        placeholder=""
                        autocomplete="norm"
                        readonly
                      />
                    </VControl>
                  </VField>
                </div>
                <div class="column is-6">
                  <VField v-slot="{ id }" class="is-autocomplete-select">
                    <VLabel>Status</VLabel>
                    <VControl icon="lucide:search">
                      <Multiselect
                        v-model="Status"
                        :attrs="{ id }"
                        :options="selectStatusIconOptions"
                        label="value"
                        track-by="id"
                        placeholder="Pilih Status..."
                        :searchable="true"
                      />
                    </VControl>
                  </VField>
                </div>
                <div class="column is-12">
                  <VField>
                    <VLabel>Nama Pasien</VLabel>
                    <VControl icon="lucide:users">
                      <VInput
                        v-model="NamaLengkap"
                        type="text"
                        placeholder=""
                        autocomplete="nama-pasien"
                      />
                    </VControl>
                  </VField>
                </div>

                <div class="column is-6">
                  <VField>
                    <VLabel>Tlp</VLabel>
                    <VControl icon="lucide:phone-call">
                      <VInput
                        v-model="Tlp"
                        type="text"
                        placeholder=""
                        autocomplete="address-level2"
                      />
                    </VControl>
                  </VField>
                </div>
                <div class="column is-6">
                  <VField>
                    <VLabel>Hp</VLabel>
                    <VControl icon="lucide:smartphone">
                      <VInput
                        v-model="Hp"
                        type="text"
                        placeholder=""
                        autocomplete="smartphone"
                      />
                    </VControl>
                  </VField>
                </div>
                <div class="column is-6">
                  <VField>
                    <VLabel>Email</VLabel>
                    <VControl icon="lucide:mail">
                      <VInput
                        v-model="Email"
                        type="email"
                        placeholder=""
                        autocomplete="email"
                        inputmode="email"
                      />
                    </VControl>
                  </VField>
                </div>
                <div class="column is-6">
                  <VField v-slot="{ id }" class="is-autocomplete-select">
                    <VLabel>Jenis Kelamin</VLabel>
                    <VControl icon="lucide:search">
                      <Multiselect
                        v-model="Kelamin"
                        :attrs="{ id }"
                        :options="selectKelaminIconOptions"
                        label="label"
                        track-by="label"
                        placeholder="Pilih Kelamin..."
                        :searchable="true"
                      />
                    </VControl>
                  </VField>
                </div>
                <div class="column is-6">
                  <VField>
                    <VLabel>Tempat Lahir</VLabel>
                    <VControl icon="lucide:map-pin">
                      <VInput
                        v-model="TmpLahir"
                        type="text"
                        placeholder=""
                        autocomplete="tempat-lahir"
                      />
                    </VControl>
                  </VField>
                </div>
                <div class="column is-6">
                  <ClientOnly>
                    <VDatePicker
                      v-model="TglLahir"
                      color="green"
                      trim-weeks
                    >
                      <template #default="{ inputValue, inputEvents }">
                        <VField>
                          <VLabel>Tanggal Lahir</VLabel>
                          <VControl icon="lucide:calendar">
                            <input
                              class="input v-input"
                              type="text"
                              placeholder="Select a date"
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
                  <VField v-slot="{ id }" class="is-autocomplete-select">
                    <VLabel>Jenis Identitas</VLabel>
                    <VControl icon="lucide:search">
                      <Multiselect
                        v-model="JenisIdentitas"
                        :attrs="{ id }"
                        :options="selectJenisIdentitasIconOptions"
                        label="label"
                        track-by="label"
                        placeholder="Pilih Jenis Identitas..."
                        :searchable="true"
                      />
                    </VControl>
                  </VField>
                </div>
                <div class="column is-6">
                  <VField>
                    <VLabel>Nomor Identitas</VLabel>
                    <VControl icon="lucide:crosshair">
                      <VInput
                        v-model="NomorIdentitas"
                        type="text"
                        placeholder=""
                        autocomplete="nomor-identitas"
                      />
                    </VControl>
                  </VField>
                </div>
                <div class="column is-12">
                  <VField>
                    <VLabel>Ibu Kandung</VLabel>
                    <VControl icon="lucide:user">
                      <VInput
                        v-model="NamaIbuKandung"
                        type="text"
                        placeholder=""
                        autocomplete="ibu-kandung"
                      />
                    </VControl>
                  </VField>
                </div>
              </div>

              <h3 class="has-text-centered" style="margin-top: 25px;">
                Informasi Alamat
              </h3>
              <div class="columns is-multiline">
                <div class="column is-12">
                  <VField>
                    <VLabel>Desa / Kelurahan</VLabel>
                    <VControl icon="lucide:file-text">
                      <VInput
                        v-model="DesaKelurahan"
                        type="text"
                        placeholder=""
                        autocomplete="desa"
                      />
                    </VControl>
                  </VField>
                </div>
                <div class="column is-12">
                  <VField>
                    <VLabel>Alamat</VLabel>
                    <VControl>
                      <VTextarea
                        v-model="AlamatLengkap"
                        class="textarea"
                        rows="4"
                        placeholder="Alamat lengkap pasien"
                        autocomplete="off"
                        autocapitalize="off"
                        spellcheck="true"
                      />
                    </VControl>
                  </VField>
                </div>

                <div class="column is-4">
                  <VField>
                    <VLabel>RT</VLabel>
                    <VControl icon="lucide:circle">
                      <VInput
                        v-model="Rt"
                        type="text"
                        placeholder=""
                        autocomplete="rt"
                      />
                    </VControl>
                  </VField>
                </div>
                <div class="column is-4">
                  <VField>
                    <VLabel>RW</VLabel>
                    <VControl icon="lucide:circle">
                      <VInput
                        v-model="Rw"
                        type="text"
                        placeholder=""
                        autocomplete="rw"
                      />
                    </VControl>
                  </VField>
                </div>
                <div class="column is-4">
                  <VField>
                    <VLabel>Kode POS</VLabel>
                    <VControl icon="lucide:circle">
                      <VInput
                        v-model="KodePos"
                        type="text"
                        placeholder=""
                        autocomplete="pos"
                      />
                    </VControl>
                  </VField>
                </div>
              </div>
            </div>

            <div class="right">
              <h3 class="has-text-centered">
                Informasi Kesehatan
              </h3>

              <div class="columns is-multiline">
                <div class="column is-6">
                  <VField v-slot="{ id }" class="is-autocomplete-select">
                    <VLabel>Golongan Darah</VLabel>
                    <VControl icon="lucide:search">
                      <Multiselect
                        v-model="GolDarah"
                        :attrs="{ id }"
                        :options="selectGolDarahIconOptions"
                        label="label"
                        track-by="label"
                        placeholder="Pilih Gol Darah..."
                        :searchable="true"
                      />
                    </VControl>
                  </VField>
                </div>
                <div class="column is-6">
                  <VField v-slot="{ id }" class="is-autocomplete-select">
                    <VLabel>Perokok</VLabel>
                    <VControl icon="lucide:search">
                      <Multiselect
                        v-model="StatusPerokok"
                        :attrs="{ id }"
                        :options="selectPerokoIconOptions"
                        label="label"
                        track-by="label"
                        placeholder="Pilih Gol Darah..."
                        :searchable="true"
                      />
                    </VControl>
                  </VField>
                </div>
                <div class="column is-12">
                  <VField>
                    <VLabel>Jenis Penyakit</VLabel>
                    <VControl icon="lucide:activity">
                      <VInput
                        v-model="JenisPenyakit"
                        type="text"
                        placeholder=""
                        autocomplete="norm"
                      />
                    </VControl>
                  </VField>
                </div>
              </div>
              <h3 class="has-text-centered" style="margin-top: 25px;">
                Informasi Pembiayaan
              </h3>
              <div class="columns is-multiline">
                <div class="column is-12">
                  <VField v-slot="{ id }" class="is-autocomplete-select">
                    <VLabel>Pembiayaan</VLabel>
                    <VControl icon="lucide:search">
                      <Multiselect
                        v-model="Pembiayaan"
                        :attrs="{ id }"
                        :options="selectPembiayaanIconOptions"
                        label="label"
                        track-by="label"
                        placeholder="Pilih Pembiayaan..."
                        :searchable="true"
                      />
                    </VControl>
                  </VField>
                </div>
                <template v-if="showPenjaminFields">
                  <div class="column is-6">
                    <VField v-slot="{ id }" class="is-autocomplete-select">
                      <VLabel>Nama Penjamin</VLabel>
                      <VControl icon="lucide:search">
                        <Multiselect
                          v-model="Penjamin"
                          :attrs="{ id }"
                          :options="selectPenjaminIconOptions"
                          label="label"
                          track-by="label"
                          placeholder="Pilih Penjamin..."
                          :searchable="true"
                        />
                      </VControl>
                    </VField>
                  </div>
                  <div class="column is-6">
                    <VField>
                      <VLabel>Nomor Penjamin</VLabel>
                      <VControl icon="fas fa-barcode">
                        <VInput
                          v-model="NomorPenjamin"
                          type="text"
                          placeholder=""
                          autocomplete="rt"
                        />
                      </VControl>
                    </VField>
                  </div>
                </template>
              </div>
              <h3 class="has-text-centered" style="margin-top: 25px;">
                Informasi Sosial
              </h3>
              <div class="columns is-multiline">
                <div class="column is-6">
                  <VField v-slot="{ id }" class="is-autocomplete-select">
                    <VLabel>Agama</VLabel>
                    <VControl icon="lucide:search">
                      <Multiselect
                        v-model="Agama"
                        :attrs="{ id }"
                        :options="selectAgamaIconOptions"
                        label="label"
                        track-by="label"
                        placeholder="Pilih Penjamin..."
                        :searchable="true"
                      />
                    </VControl>
                  </VField>
                </div>
                <div class="column is-6">
                  <VField v-slot="{ id }" class="is-autocomplete-select">
                    <VLabel>Satus Pernikahan</VLabel>
                    <VControl icon="lucide:search">
                      <Multiselect
                        v-model="StatusPernikahan"
                        :attrs="{ id }"
                        :options="selectStatusPernikahanIconOptions"
                        label="label"
                        track-by="label"
                        placeholder="Pilih Penjamin..."
                        :searchable="true"
                      />
                    </VControl>
                  </VField>
                </div>
                <div class="column is-6">
                  <VField v-slot="{ id }" class="is-autocomplete-select">
                    <VLabel>Pendidikan</VLabel>
                    <VControl icon="lucide:search">
                      <Multiselect
                        v-model="Pendidikan"
                        :attrs="{ id }"
                        :options="selectPendidikanIconOptions"
                        label="label"
                        track-by="label"
                        placeholder="Pilih Penjamin..."
                        :searchable="true"
                      />
                    </VControl>
                  </VField>
                </div>
                <div class="column is-6">
                  <VField v-slot="{ id }" class="is-autocomplete-select">
                    <VLabel>Pekerjaan</VLabel>
                    <VControl icon="lucide:search">
                      <Multiselect
                        v-model="Pekerjaan"
                        :attrs="{ id }"
                        :options="selectPekerjaanIconOptions"
                        label="label"
                        track-by="label"
                        placeholder="Pilih Penjamin..."
                        :searchable="true"
                      />
                    </VControl>
                  </VField>
                </div>
                <div class="column is-6">
                  <VField>
                    <VLabel>Bahasa</VLabel>
                    <VControl icon="fas fa-globe">
                      <VInput
                        v-model="BahasaDikuasai"
                        type="text"
                        placeholder=""
                        autocomplete="rt"
                      />
                    </VControl>
                  </VField>
                </div>
                <div class="column is-6">
                  <VField>
                    <VLabel>Suku</VLabel>
                    <VControl icon="lucide:circle">
                      <VInput
                        v-model="Suku"
                        type="text"
                        placeholder=""
                        autocomplete="rt"
                      />
                    </VControl>
                  </VField>
                </div>
              </div>
            </div>
          </div>
        </div>
      </VLoader>
    </div>
  </form>
</template>

<style lang="scss">
@import '/@src/scss/abstracts/all';
@import '/@src/scss/components/forms-outer';

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
            padding: 10px 20px;
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
