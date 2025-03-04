<script setup lang="ts">
import Swal from 'sweetalert2'
// import { format } from 'date-fns'

const pageTitle = useVueroContext<string>('page-title')
onMounted(() => {
  pageTitle.value = 'View Cheklis Kendaraan CIT'
})

useHead(() => ({
  title: 'View Cheklis Kendaraan CIT - Guard - TAG',
}))

/* const notyf = new Notyf({
  position: {
    x: 'center', // Posisi horizontal (bisa 'left' atau 'right')
    y: 'top' // Posisi vertikal (ubah ke 'bottom' jika ingin di bawah)
  }
}) */
const { y } = useWindowScroll()

const userSession = useUserSession()
const canPrint = userSession.checkPermission('ChecklisCitGuard', 'PrintPdfCit')

const router = useRouter()
const route = useRoute()
const $fetch = useApiFetch()
const notyf = useNotyf()
const isStuck = computed(() => {
  return y.value > 30
})
const isLoading = ref(false)

const paramId = route.params.formchekliscit

const nowo = ref('')
const hari = ref('')
const tanggal = ref('')
const nopol = ref('')
const nobody = ref('')
const nikcustody1 = ref('')
const nmcustody1 = ref('')
const nikcustody2 = ref('')
const nmcustody2 = ref('')
const nikpengawal1 = ref('')
const pengawal1 = ref('')
const nikpengawal2 = ref('')
const pengawal2 = ref('')
const tujuan = ref('')
const divisi = ref('')
const jamberangkat = ref('')
const jampulang = ref('')
const kmawal = ref('')
const kmakhir = ref('')
const bbmawal = ref('')
const bbmakhir = ref('')
const stnk = ref('')
const stnkket = ref('')
const kir = ref('')
const kirket = ref('')
const kartubensi = ref('')
const kartubensiket = ref('')
const gembok = ref('')
const gembokket = ref('')
const dongkrak = ref('')
const dongkrakket = ref('')
const kunci = ref('')
const kunciket = ref('')
const ban = ref('')
const banket = ref('')
const apar = ref('')
const aparket = ref('')
const safety = ref('')
const safetyket = ref('')
const sim = ref('')
const simket = ref('')
const gambar = ref('')
const gambarket = ref('')

async function fetchEditData() {
  if (!paramId) return

  isLoading.value = true
  try {
    const response = await $fetch(`ChecklisCitGuard/GetDetailCheklisCit?order=${paramId}`)
    if (response) {
      let code = response.metadata.code
      let message = response.metadata.message
      let resData = response.response
      if (code != '200') {
        notyf.error(message)
        router.push('/guard/cheklis-kendaraan/cit')
        return
      }
      nowo.value = resData.nowo
      hari.value = resData.hari
      tanggal.value = resData.tanggal
      nopol.value = resData.nopol
      nobody.value = resData.nobody
      nikcustody1.value = resData.nikcustody1
      nmcustody1.value = resData.nmcustody1
      nikcustody2.value = resData.nikcustody2
      nmcustody2.value = resData.nmcustody2
      nikpengawal1.value = resData.nikpengawal1
      pengawal1.value = resData.pengawal1
      nikpengawal2.value = resData.nikpengawal2
      pengawal2.value = resData.pengawal2
      tujuan.value = resData.tujuan
      divisi.value = resData.divisi
      jamberangkat.value = resData.jamberangkat
      jampulang.value = resData.jampulang
      kmawal.value = resData.kmawal
      kmakhir.value = resData.kmakhir
      bbmawal.value = resData.bbmawal
      bbmakhir.value = resData.bbmakhir
      stnk.value = resData.stnk
      stnkket.value = resData.stnkket
      kir.value = resData.kir
      kirket.value = resData.kirket
      kartubensi.value = resData.kartubensi
      kartubensiket.value = resData.kartubensiket
      gembok.value = resData.gembok
      gembokket.value = resData.gembokket
      dongkrak.value = resData.dongkrak
      dongkrakket.value = resData.dongkrakket
      kunci.value = resData.kunci
      kunciket.value = resData.kunciket
      ban.value = resData.ban
      banket.value = resData.banket
      apar.value = resData.apar
      aparket.value = resData.aparket
      safety.value = resData.safety
      safetyket.value = resData.safetyket
      sim.value = resData.sim
      simket.value = resData.simket
      gambar.value = resData.gambar
      gambarket.value = resData.gambarket
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

const onSubmit = async () => {
  if (isLoading.value) return

  if (!nowo.value) {
    notyf.error('No Order Tidak ditemukan')
    return
  }

  isLoading.value = true
  try {
    const payload = {
      nowo: nowo.value,
      username: 'xxxxx',
    }

    const response = await $fetch(`ChecklisCitGuard/PrintPdfCit`, {
      method: 'POST',
      body: payload,
    })

    if (response) {
      console.log(response)
      let code = response.metadata.code
      let message = response.metadata.message
      if (code == '200') {
        const byteCharacters = atob(response.response)
        const byteNumbers = new Array(byteCharacters.length)
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i)
        }
        const byteArray = new Uint8Array(byteNumbers)
        const blob = new Blob([byteArray], { type: 'application/pdf' })

        // Buat URL dari Blob
        const blobUrl = URL.createObjectURL(blob)

        // Buka di tab baru
        window.open(blobUrl, '_blank')
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

onMounted(() => {
  fetchEditData()
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
            <h3>View Cheklis Kendaraan CIT</h3>
          </div>
          <div class="right">
            <div class="buttons">
              <VButton
                icon="lnir lnir-arrow-left rem-100"
                to="/guard/cheklis-kendaraan/rpl"
                light
                dark-outlined
                :disabled="isLoading"
              >
                Kembali
              </VButton>
              <VButton
                v-if="canPrint"
                type="submit"
                color="primary"
                raised
                :loading="isLoading"
                :disabled="isLoading"
              >
                Print
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
          <h3 class="has-text-centered" style="font-size:larger;padding-top: 15px;">
            Lembar Cheklis List Kendaraan OPS TAG
          </h3>
          <div class="form-section">
            <div class="left">
              <div class="columns is-multiline">
                <div class="column is-12">
                  <VField>
                    <VLabel>Nomor Order</VLabel>
                    <VControl icon="fas fa-barcode">
                      <VInput
                        v-model="nowo"
                        type="text"
                        placeholder=""
                        autocomplete="norm"
                        readonly
                      />
                    </VControl>
                  </VField>
                </div>
                <div class="column is-6">
                  <VField>
                    <VLabel>Hari</VLabel>
                    <VControl icon="fas fa-calendar-day">
                      <VInput
                        v-model="hari"
                        type="text"
                        placeholder=""
                        autocomplete="norm"
                        readonly
                      />
                    </VControl>
                  </VField>
                </div>
                <div class="column is-6">
                  <VField>
                    <VLabel>Tanggal</VLabel>
                    <VControl icon="fas fa-calendar-alt">
                      <VInput
                        v-model="tanggal"
                        type="text"
                        placeholder=""
                        autocomplete="norm"
                        readonly
                      />
                    </VControl>
                  </VField>
                </div>
                <div class="column is-6">
                  <VField>
                    <VLabel>No Polis</VLabel>
                    <VControl icon="fas fa-car">
                      <VInput
                        v-model="nopol"
                        type="text"
                        placeholder=""
                        autocomplete="norm"
                        readonly
                      />
                    </VControl>
                  </VField>
                </div>
                <div class="column is-6">
                  <VField>
                    <VLabel>No Body</VLabel>
                    <VControl icon="fas fa-caravan">
                      <VInput
                        v-model="nobody"
                        type="text"
                        placeholder=""
                        autocomplete="norm"
                        readonly
                      />
                    </VControl>
                  </VField>
                </div>
                <div class="column is-6">
                  <VField>
                    <VLabel>Custody 1</VLabel>
                    <VControl icon="fas fa-user-check">
                      <VInput
                        v-model="nmcustody1"
                        type="text"
                        placeholder=""
                        autocomplete="norm"
                        readonly
                      />
                    </VControl>
                  </VField>
                </div>
                <div class="column is-6">
                  <VField>
                    <VLabel>Custody 2</VLabel>
                    <VControl icon="fas fa-user-check">
                      <VInput
                        v-model="nmcustody2"
                        type="text"
                        placeholder=""
                        autocomplete="norm"
                        readonly
                      />
                    </VControl>
                  </VField>
                </div>
                <div class="column is-6">
                  <VField>
                    <VLabel>Pengawal 1</VLabel>
                    <VControl icon="fas fa-user-secret">
                      <VInput
                        v-model="pengawal1"
                        type="text"
                        placeholder=""
                        autocomplete="norm"
                        readonly
                      />
                    </VControl>
                  </VField>
                </div>
                <div class="column is-6">
                  <VField>
                    <VLabel>Pengawal 2</VLabel>
                    <VControl icon="fas fa-user-secret">
                      <VInput
                        v-model="pengawal2"
                        type="text"
                        placeholder=""
                        autocomplete="norm"
                        readonly
                      />
                    </VControl>
                  </VField>
                </div>
              </div>
            </div>

            <div class="right">
              <div class="columns is-multiline">
                <div class="column is-12">
                  <VField>
                    <VLabel>Tujuan</VLabel>
                    <VControl icon="fas fa-globe">
                      <VInput
                        v-model="tujuan"
                        type="text"
                        placeholder=""
                        autocomplete="norm"
                        readonly
                      />
                    </VControl>
                  </VField>
                </div>
                <div class="column is-4">
                  <VField>
                    <VLabel>Divisi</VLabel>
                    <VControl icon="fas fa-columns">
                      <VInput
                        v-model="divisi"
                        type="text"
                        placeholder=""
                        autocomplete="norm"
                        readonly
                      />
                    </VControl>
                  </VField>
                </div>
                <div class="column is-4">
                  <VField>
                    <VLabel>Jam Berangkat</VLabel>
                    <VControl icon="fas fa-clock">
                      <VInput
                        v-model="jamberangkat"
                        type="text"
                        placeholder=""
                        autocomplete="norm"
                        readonly
                      />
                    </VControl>
                  </VField>
                </div>
                <div class="column is-4">
                  <VField>
                    <VLabel>Jam Pulang</VLabel>
                    <VControl icon="fas fa-clock">
                      <VInput
                        v-model="jampulang"
                        type="text"
                        placeholder=""
                        autocomplete="norm"
                        readonly
                      />
                    </VControl>
                  </VField>
                </div>
                <div class="column is-6">
                  <VField>
                    <VLabel>Km Awal</VLabel>
                    <VControl icon="fas fa-tachometer-alt">
                      <VInput
                        v-model="kmawal"
                        type="text"
                        placeholder=""
                        autocomplete="norm"
                        readonly
                      />
                    </VControl>
                  </VField>
                </div>
                <div class="column is-6">
                  <VField>
                    <VLabel>Km Akhir</VLabel>
                    <VControl icon="fas fa-tachometer-alt">
                      <VInput
                        v-model="kmakhir"
                        type="text"
                        placeholder=""
                        autocomplete="norm"
                        readonly
                      />
                    </VControl>
                  </VField>
                </div>
                <div class="column is-6">
                  <VField>
                    <VLabel>BBM Awal</VLabel>
                    <VControl icon="fas fa-tachometer-alt">
                      <VInput
                        v-model="bbmawal"
                        type="text"
                        placeholder=""
                        autocomplete="norm"
                        readonly
                      />
                    </VControl>
                  </VField>
                </div>
                <div class="column is-6">
                  <VField>
                    <VLabel>BBM Akhir</VLabel>
                    <VControl icon="fas fa-tachometer-alt">
                      <VInput
                        v-model="bbmakhir"
                        type="text"
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
                      readonly
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
                      readonly
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
                      readonly
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
                      readonly
                    />
                  </VControl>
                </VField>
              </div>
              <!--  -->
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
                      readonly
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
                      readonly
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
                      readonly
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
                      readonly
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
                      readonly
                    />
                  </VControl>
                </VField>
              </div>
              <!--  -->
              <div class="column is-12">
                <VField>
                  <VLabel>SIM</VLabel>
                  <VControl>
                    <VRadio
                      v-model="sim"
                      name="sim"
                      color="primary"
                      value="Ada"
                    >
                      Ada
                    </VRadio>
                    <VRadio
                      v-model="sim"
                      name="sim"
                      value="Tidak Ada"
                    >
                      Tidak Ada
                    </VRadio>
                  </VControl>
                </VField>
              </div>
              <div v-if="sim === 'Tidak Ada'" class="column is-12">
                <VField>
                  <VLabel>Keterangan</VLabel>
                  <VControl icon="fas fa-handshake">
                    <VInput
                      v-model="simket"
                      type="text"
                      placeholder=""
                      autocomplete="norm"
                      readonly
                    />
                  </VControl>
                </VField>
              </div>
              <!--  -->
            </div>

            <!-- bagian kanan -->
            <div class="right">
              <div class="column  is-12">
                <img
                  class="centered-image"
                  :src="gambar"
                  alt=""
                >
              </div>
              <div class="column is-12">
                <VField>
                  <VLabel>Keterangan Gambar</VLabel>
                  <VControl>
                    <VTextarea
                      v-model="gambarket"
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

.centered-image {
  height: auto;
  object-fit: contain;
  width: 100%; /* Perbesar gambar */
}

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
