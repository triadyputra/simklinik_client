<script setup lang="ts">
import Swal from 'sweetalert2'
import { format } from 'date-fns'

const pageTitle = useVueroContext<string>('page-title')
onMounted(() => {
  pageTitle.value = 'Laporan Cheklis kendaraan OPS CIT'
})

useHead(() => ({
  title: 'Laporan Cheklis kendaraan OPS CIT - Laporan - TAG',
}))

const userSession = useUserSession()
const $fetch = useApiFetch()
const notyf = useNotyf()

const canPrint = userSession.checkPermission('ChecklisCitGuard', 'PrintLaporanCit')

const isLoading = ref(false)

const tglAwal = ref(new Date())
const tglAkhir = ref(new Date())
const lokasi = ref('')
const cabangOptions = ref([])

const formatDate = (date: Date | null) => {
  return date ? format(date, 'dd-MM-yyyy') : ''
}

const pdfUrl = ref<string | null>(null) // Tambahkan untuk menyimpan URL PDF

async function fetchCombo() {
  try {
    const resData = await $fetch(`Combo/ComboFormMobil`)
    if (resData) {
      cabangOptions.value = resData.cabang
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

  if (!tglAwal.value) {
    notyf.error('Tanggal awal tidak boleh kosong')
    return
  }
  if (!tglAkhir.value) {
    notyf.error('Tanggal akhir tidak boleh kosong')
    return
  }

  isLoading.value = true
  try {
    let awal = format(tglAwal.value, 'yyyy-MM-dd')
    let akhir = format(tglAkhir.value, 'yyyy-MM-dd')
    // const response = await $fetch(`LaporanGuard/PrintLaporanCit?startDate=${awal}&endDate=${akhir}`, {
    //   method: 'GET',
    // })
    const response = await $fetch(`LaporanGuard/PrintLaporanCit`, {
      params: {
        startDate: awal,
        endDate: akhir,
        cabang: lokasi.value,
      },
    })
    if (response) {
      console.log(response)
      let code = response.metadata.code
      let message = response.metadata.message
      if (code == '200') {
        // Konversi Base64 ke Blob
        const byteCharacters = atob(response.response)
        const byteNumbers = new Array(byteCharacters.length)
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i)
        }
        const byteArray = new Uint8Array(byteNumbers)
        const blob = new Blob([byteArray], { type: 'application/pdf' })

        // Bersihkan URL lama sebelum membuat yang baru
        if (pdfUrl.value) {
          URL.revokeObjectURL(pdfUrl.value)
        }

        // Buat URL dari Blob dan simpan ke pdfUrl
        pdfUrl.value = URL.createObjectURL(blob)
      }
      else {
        Swal.fire({
          title: 'Pesan!',
          text: message,
          icon: 'error',
          confirmButtonText: 'OK',
        })
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

const handleDownload = async () => {
  if (isLoading.value) return

  if (!tglAwal.value) {
    notyf.error('Tanggal awal tidak boleh kosong')
    return
  }
  if (!tglAkhir.value) {
    notyf.error('Tanggal akhir tidak boleh kosong')
    return
  }

  isLoading.value = true
  try {
    let awal = format(tglAwal.value, 'yyyy-MM-dd')
    let akhir = format(tglAkhir.value, 'yyyy-MM-dd')
    // const response = await $fetch(`LaporanGuard/PrintLaporanRpl?startDate=${awal}&endDate=${akhir}`, {
    //   method: 'GET',
    // })
    const response = await $fetch(`LaporanGuard/PrintLaporanCit`, {
      params: {
        startDate: awal,
        endDate: akhir,
        cabang: lokasi.value,
      },
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

fetchCombo()
</script>

<template>
  <div>
    <!--Edit Profile-->
    <div class="account-wrapper">
      <div class="columns">
        <!--Navigation-->
        <div class="column is-3">
          <div class="account-box is-navigation">
            <form
              method="post"
              novalidate
              class="form-layout"
              @submit.prevent="onSubmit"
            >
              <VLoader
                card="regular"
                size="small"
                :active="isLoading"
                translucent
              >
                <div class="form-outer">
                  <div class="form-body">
                    <!--Fieldset-->
                    <div class="form-fieldset">
                      <div class="fieldset-heading">
                        <h4>CIT</h4>
                        <p>Laporan cheklis kendaraan CIT</p>
                      </div>
                      <div class="columns is-multiline">
                        <div class="column is-12">
                          <ClientOnly>
                            <VDatePicker
                              v-model="tglAwal"
                              color="green"
                              trim-weeks
                            >
                              <template #default="{ inputValue, inputEvents }">
                                <VField>
                                  <VLabel>Tanggal Awal <span style="color: red;">*</span></VLabel>
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
                        <div class="column is-12">
                          <ClientOnly>
                            <VDatePicker
                              v-model="tglAkhir"
                              color="green"
                              trim-weeks
                            >
                              <template #default="{ inputValue, inputEvents }">
                                <VField>
                                  <VLabel>Tanggal Akhir <span style="color: red;">*</span></VLabel>
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
                        <div class="column is-12">
                          <VField v-slot="{ id }" class="is-autocomplete-select">
                            <VLabel>Cabang</VLabel>
                            <VControl icon="fas fa-map-marker-alt">
                              <Multiselect
                                v-model="lokasi"
                                :attrs="{ id }"
                                :options="cabangOptions"
                                label="label"
                                track-by="label"
                                placeholder="Pilih Cabang..."
                                :searchable="true"
                              />
                            </VControl>
                          </VField>
                        </div>
                        <div class="column is-12 is-flex is-justify-content-end is-gap-1">
                          <VButton
                            type="submit"
                            color="primary"
                            raised
                          >
                            Privew
                          </VButton>
                          <VButton
                            color="primary"
                            raised
                            @click="handleDownload"
                          >
                            Download
                          </VButton>
                        </div>
                      </div>
                    </div>
                    <!--Fieldset-->
                  </div>
                </div>
              </VLoader>
            </form>
          </div>
        </div>

        <div class="column is-9">
          <div class="account-box is-navigation">
            <iframe
              v-if="pdfUrl"
              :src="pdfUrl"
              width="100%"
              style="min-height: 700px;"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

  <style lang="scss">
  @import '/@src/scss/abstracts/all';

  .is-navbar {
    .account-wrapper {
      margin-top: 30px;
    }
  }

  .account-wrapper {
    padding-bottom: 60px;

    .account-box {
      @include vuero-s-card;

      &.is-navigation {
        .media-flex-center {
          padding-bottom: 20px;

          .flex-meta {
            span {
              &:first-child {
                font-size: 1.3rem;
              }
            }
          }
        }

        .account-menu {
          .account-menu-item {
            display: flex;
            align-items: center;
            padding: 12px 16px;
            border: 1px solid transparent;
            border-radius: 8px;
            margin-bottom: 5px;
            transition: all 0.3s; // transition-all test

            &.router-link-exact-active {
              box-shadow: var(--light-box-shadow);
              border-color: color-mix(in oklab, var(--fade-grey), black 3%);

              span,
              .lnil {
                color: var(--primary);
              }

              .end {
                display: block;
              }
            }

            &:not(.router-link-exact-active) {
              &:hover {
                background: color-mix(in oklab, var(--fade-grey), white 3%);
              }
            }

            .lnil {
              margin-inline-end: 8px;
              font-size: 1.1rem;
              color: var(--light-text);

              &.fas,
              .fal,
              .far {
                font-size: 0.9rem;
              }
            }

            span {
              font-family: var(--font-alt);
              font-size: 0.95rem;
              color: var(--dark-text);
            }

            .end {
              margin-inline-start: auto;
              display: none;
            }
          }
        }
      }

      &.is-form {
        padding: 0;

        &.is-footerless {
          padding-bottom: 20px;
        }

        .form-head,
        .form-foot {
          padding: 12px 20px;

          .form-head-inner,
          .form-foot-inner {
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
        }

        .form-head {
          border-bottom: 1px solid color-mix(in oklab, var(--fade-grey), black 3%);
          transition: all 0.3s; // transition-all test

          &.is-stuck {
            background: var(--white);
            padding-inline-end: 80px;
            border-inline-start: 1px solid color-mix(in oklab, var(--fade-grey), black 3%);
          }

          .left {
            h3 {
              font-family: var(--font-alt);
              font-size: 1.2rem;
              line-height: 1.3;
            }

            p {
              font-size: 0.95rem;
            }
          }
        }

        .form-foot {
          border-top: 1px solid color-mix(in oklab, var(--fade-grey), black 3%);
        }

        .form-body {
          padding: 20px;

          .fieldset {
            padding: 20px 0;
            max-width: 480px;
            margin: 0 auto;

            .fieldset-heading {
              margin-bottom: 20px;

              h4 {
                font-family: var(--font-alt);
                font-weight: 600;
                font-size: 1rem;
              }

              p {
                font-size: 0.9rem;
              }
            }

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

            .setting-list {
              .setting-form {
                text-align: center;

                .filepond-profile-wrap {
                  margin: 0 auto 10px !important;
                }
              }

              .setting-item {
                display: flex;
                align-items: center;
                margin-bottom: 24px;

                .icon-wrap {
                  position: relative;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  width: 50px;
                  min-width: 50px;
                  height: 50px;
                  border-radius: var(--radius-rounded);
                  background: color-mix(in oklab, var(--fade-grey), white 2%);
                  border: 1px solid color-mix(in oklab, var(--fade-grey), black 3%);
                  color: var(--light-text);

                  &.has-img {
                    border-color: var(--primary);

                    img {
                      width: 36px;
                      min-width: 36px;
                      height: 36px;
                    }
                  }

                  .lnil {
                    font-size: 1.4rem;
                  }
                }

                img {
                  display: block;
                  width: 50px;
                  min-width: 50px;
                  height: 50px;
                  border-radius: var(--radius-rounded);
                  border: 1px solid transparent;
                }

                .meta {
                  margin-inline-start: 10px;

                  > span {
                    font-family: var(--font);
                    display: block;

                    &:first-child {
                      font-family: var(--font-alt);
                      font-weight: 600;
                      color: var(--dark-text);
                      font-size: 0.9rem;
                    }

                    &:nth-child(2),
                    &:nth-child(3) {
                      font-size: 0.85rem;
                      color: var(--light-text);

                      .fas {
                        position: relative;
                        top: -2px;
                        font-size: 4px;
                        margin: 0 6px;
                      }
                    }

                    &:nth-child(3) {
                      color: var(--primary);
                    }

                    span {
                      display: inline-block;
                    }
                  }
                }

                .end {
                  margin-inline-start: auto;
                }
              }
            }
          }
        }
      }
    }
  }

  .is-dark {
    .account-wrapper {
      .account-box {
        @include vuero-card--dark;

        &.is-navigation {
          .account-menu {
            .account-menu-item {
              &.router-link-exact-active {
                background: color-mix(in oklab, var(--dark-sidebar), white 8%);
                border-color: color-mix(in oklab, var(--dark-sidebar), white 12%);

                i,
                span {
                  color: var(--primary);
                }
              }

              &:not(.router-link-exact-active) {
                &:hover {
                  background: color-mix(in oklab, var(--dark-sidebar), white 10%);
                }
              }

              span {
                color: var(--dark-dark-text);
              }
            }
          }
        }

        &.is-form {
          .form-head,
          .form-foot {
            border-color: color-mix(in oklab, var(--dark-sidebar), white 12%);
          }

          .form-head {
            &.is-stuck {
              background: var(--dark-sidebar);
              border-color: color-mix(in oklab, var(--dark-sidebar), white 6%);
            }

            .left {
              h3 {
                color: var(--dark-dark-text);
              }
            }
          }

          .form-body {
            .fieldset {
              .fieldset-heading {
                h4 {
                  color: var(--dark-dark-text);
                }
              }

              .setting-list {
                .setting-item {
                  > img,
                  > .icon-wrap,
                  > .icon-wrap img {
                    border-color: color-mix(in oklab, var(--dark-sidebar), white 12%);
                  }

                  > .icon-wrap {
                    background: color-mix(in oklab, var(--dark-sidebar), white 2%);
                  }

                  .meta {
                    > span {
                      &:nth-child(3) {
                        color: var(--primary);
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
  }
  </style>
