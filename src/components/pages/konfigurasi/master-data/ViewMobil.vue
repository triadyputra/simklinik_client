<script setup lang="ts">
import { format } from 'date-fns'
import Swal from 'sweetalert2'

const userSession = useUserSession()
const router = useRouter()
const route = useRoute()
const notyf = useNotyf()
const isLoading = ref(false)
const $fetch = useApiFetch()
const data = ref<any[]>([])
const totalItems = ref(0)
const filter = ref('')
const page = ref(1)
const perPage = ref(10)

const redirect = route.query.redirect as string
const canView = userSession.checkPermission('MasterMobil', 'GetListMobil')
const canAdd = userSession.checkPermission('MasterMobil', 'PostMobil')
const canEdit = userSession.checkPermission('MasterMobil', 'PutMobil')
const canDelete = userSession.checkPermission('MasterMobil', 'DeleteMobil')

const lokasi = ref('')
const cabangOptions = ref([])

if (!canView) {
  router.push(redirect || '/error/page-1')
}

// Fungsi untuk kapitalisasi setiap kata
// const capitalizeWords = (str: string) => str.replace(/\b\w/g, char => char.toUpperCase())
const capitalizeWords = (str: string): string =>
  str.toLowerCase().replace(/\b\w/g, char => char.toUpperCase())

async function fetchCombo() {
  try {
    const resData = await $fetch(`Combo/ComboFormMobil`)
    // console.log(resData)
    // Pastikan resData tidak null sebelum assign
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
async function fetchData() {
  try {
    isLoading.value = true
    const resData = await $fetch(`MasterMobil/GetListMobil`, {
      params: {
        filter: filter.value,
        cabang: lokasi.value,
        page: page.value,
        pageSize: perPage.value,
      },
    })

    // Pastikan resData tidak null sebelum assign
    if (resData) {
      data.value = resData.listData || []
      totalItems.value = resData.count || 0
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

// Fetch otomatis saat `page` atau `filter` berubah (dengan debounce untuk pencarian)
watch([filter, lokasi, page], () => {
  setTimeout(fetchData, 500) // Debounce 500ms untuk pencarian
})

// Fetch pertama kali saat komponen dipasang

onMounted(() => {
  fetchCombo()
  fetchData()
})

const goToEdit = (noRm: string) => {
  if (!noRm) {
    console.error('Pengguna tidak ditemukan')
    return
  }
  router.push(`/konfigurasi/master-data/form-mobil-edit/${noRm}`)
}

const deleteData = async (id: string) => {
  const result = await Swal.fire({
    title: 'Yakin ingin menghapus?',
    text: 'Data yang dihapus tidak bisa dikembalikan!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#f82a5e',
    cancelButtonColor: '#0398e2',
    confirmButtonText: 'Ya, Hapus!',
    cancelButtonText: 'Batal',
  })

  if (result.isConfirmed) {
    try {
      const response = await $fetch(`MasterMobil/${id}`, {
        method: 'DELETE',
      })
      // console.log(response)
      if (response) {
        let code = response.metadata.code
        let message = response.metadata.message
        if (code == '200') {
        // notyf.dismissAll()
        // notyf.primary(message)
          Swal.fire({
            title: 'Terhapus!',
            text: message,
            icon: 'success',
            confirmButtonText: 'OK',
          })
          fetchData()
        }
        else {
        // notyf.error(message)
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
          notyf.error('Fetch error:', error.message)
        }
      }
      else {
        console.error('Error lainnya:', error)
        notyf.error('Error lainnya:', error)
      }
    }
    finally {
      isLoading.value = false
    }
  }
}
</script>

<template>
  <div>
    <div class="datatable-toolbar">
      <div class="column is-2">
        <VField>
          <VControl icon="lucide:search">
            <input
              v-model="filter"
              class="input custom-text-filter"
              placeholder="Cari Nopolisi..."
            >
          </VControl>
        </VField>
      </div>
      <div class="column is-2">
        <VField v-slot="{ id }" class="is-autocomplete-select">
          <VControl icon="fas fa-map-marker-alt">
            <Multiselect
              v-model="lokasi"
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

      <VButtons>
        <VButton
          v-if="canAdd"
          color="primary"
          icon="fas fa-plus"
          elevated
          to="/konfigurasi/master-data/form-mobil-add"
        >
          Tambah
        </VButton>
      </VButtons>
    </div>
    <div class="datatable-wrapper">
      <div class="table-container">
        <table class="table datatable-table is-fullwidth">
          <thead>
            <th>Mobil</th>
            <th>Tgl Pajak/STNK</th>
            <th>Body</th>
            <th>Type</th>
            <th>User</th>
            <th>Rental</th>
            <th>Vendor</th>
            <th>Masa Sewa</th>
            <th>Harga</th>
            <th>Ppn</th>
            <th>Total</th>
            <th class="sticky-column">
              Actions
            </th>
          </thead>
          <tbody v-if="isLoading">
            <tr v-for="n in 10" :key="n">
              <td>
                <VPlaceload />
              </td>
              <td>
                <VPlaceload />
              </td>
              <td>
                <VPlaceload />
              </td>
              <td>
                <VPlaceload />
              </td>
              <td>
                <VPlaceload />
              </td>
              <td>
                <VPlaceload />
              </td>
              <td>
                <VPlaceload />
              </td>
              <td>
                <VPlaceload />
              </td>
              <td>
                <VPlaceload />
              </td>
              <td>
                <VPlaceload />
              </td>
              <td>
                <VPlaceload />
              </td>
            </tr>
          </tbody>
          <tbody>
            <tr
              v-for="user in data"
              :key="user.NoRm"
            >
              <td>
                <div class="flex-media">
                  <VAvatar
                    :picture="user.photo ?? '/images/avatars/box-truck.png' "
                    alt="Avatar"
                  />
                  <div class="meta">
                    <h3>{{ user.nopol }}</h3>
                    <h6 class="light-text">
                      {{ user.warna }} - {{ user.tahun }}
                    </h6>
                  </div>
                </div>
              </td>
              <td>
                <div class="flex-media">
                  <div class="light-text">
                    <h3>Pajak : {{ format(user.tglpajak, 'dd-MM-yyyy') }}</h3>
                    <h6 class="light-text">
                      STNK : {{ format(user.tglstnk, 'dd-MM-yyyy') }}
                    </h6>
                  </div>
                </div>
              </td>
              <td>{{ user.body }}</td>
              <td>{{ user.type }}</td>
              <td>
                <div class="flex-media">
                  <div class="light-text">
                    <h3>{{ user.user }}</h3>
                    <h6 class="light-text capitalize">
                      {{ capitalizeWords(user.lokasi) }}
                    </h6>
                  </div>
                </div>
              </td>
              <td>{{ user.rental }}</td>
              <td>{{ user.vendor }}</td>
              <td>
                <div class="flex-media">
                  <div class="light-text">
                    <h3>{{ user.tglawalsewa ? 'Awal : ' + format(user.tglawalsewa, 'dd-MM-yyyy') : '' }}</h3>
                    <h6 class="light-text">
                      {{ user.tglakhirsewa ? 'Akhir : ' + format(user.tglakhirsewa, 'dd-MM-yyyy') : '' }}
                    </h6>
                  </div>
                </div>
              </td>
              <td>{{ new Intl.NumberFormat('id-ID').format(user.harga) }}</td>
              <td>{{ new Intl.NumberFormat('id-ID').format(user.nilaippn) }}</td>
              <td>{{ new Intl.NumberFormat('id-ID').format(user.total) }}</td>
              <td class="sticky-column text-center">
                <VFlex
                  class="small-gap"
                >
                  <VIconWrap
                    v-if="canEdit"
                    v-tooltip.info.rounded="'Edit data'"
                    icon="lucide:edit"
                    color="info"
                    @click="goToEdit(user.nopol)"
                  />
                  <VIconWrap
                    v-if="canDelete"
                    v-tooltip.info.rounded="'Hapus data'"
                    icon="lucide:trash-2"
                    color="danger"
                    @click="deleteData(user.nopol)"
                  />
                </VFlex>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!--Table Pagination-->
    <VFlexPagination
      v-if="totalItems > perPage"
      v-model:current-page="page"
      :item-per-page="perPage"
      :total-items="totalItems"
      :max-links-displayed="7"
      no-router
      class="mt-4"
    />
  </div>
</template>

<style lang="scss" scoped>
.capitalize {
  text-transform: capitalize !important;
}

.sticky-column {
  position: sticky;
  right: 0;
  //background-color: var(--white); //white; /* Warna latar belakang agar tidak transparan */
  z-index: 2;
  box-shadow: -3px 0px 5px rgba(0, 0, 0, 0.1); /* Efek bayangan agar lebih jelas */
}

.text-center {
  text-align: center !important;
  vertical-align: middle !important;
}

.text-center .v-flex {
  justify-content: center;
}

.small-gap {
  gap: 2px !important; /* Sesuaikan ukuran */
  margin: 0 !important;
  padding: 0 !important;
}

.is-navbar {
  .datatable-toolbar {
    padding-top: 30px;
  }
}

.datatable-toolbar {
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  &.is-reversed {
    flex-direction: row-reverse;
  }

  .field {
    margin-bottom: 0;

    .control {
      .button {
        color: var(--light-text);

        &:hover,
        &:focus {
          background: var(--primary);
          border-color: var(--primary);
          color: var(--primary--color-invert);
        }
      }
    }
  }

  .buttons {
    margin-left: auto;
    margin-bottom: 0;

    .v-button {
      margin-bottom: 0;
    }
  }
  .column {
    padding: 0 0.75rem 0 0;
  }
}

.is-dark {
  .datatable-toolbar {
    .field {
      .control {
        .button {
          background: var(--dark-sidebar) !important;
          color: var(--light-text);

          &:hover,
          &:focus {
            background: var(--primary) !important;
            border-color: var(--primary) !important;
            color: var(--smoke-white) !important;
          }
        }
      }
    }
  }
}

.datatable-wrapper {
  width: 100%;

  .datatable-container {
    background: var(--white);
    border: none !important;
    overflow-x: auto;

    .table,
    table {
      width: 100%;
    }

    &::-webkit-scrollbar {
      height: 8px !important;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 10px !important;
      background: rgb(0 0 0 / 20%) !important;
    }
  }
}

.datatable-table {
  border: 1px solid var(--fade-grey);
  border-collapse: collapse;
  border-radius: 0.75rem;

  th {
    padding: 16px 20px;
    font-family: var(--font-alt);
    font-size: 0.8rem;
    color: var(--dark-text);
    text-transform: uppercase;
    border: 1px solid var(--fade-grey);
    font-weight: 600;

    &:last-child {
      text-align: right;
    }
  }

  td {
    font-family: var(--font);
    vertical-align: middle;
    padding: 12px 20px;
    border-bottom: 1px solid var(--fade-grey);

    &:last-child {
      text-align: right;
    }

    &.datatables-empty {
      opacity: 0;
    }
  }

  .light-text {
    color: var(--light-text);
  }

  .flex-media {
    display: flex;
    align-items: center;

    .meta {
      margin-left: 10px;
      line-height: 1.3;

      span {
        display: block;
        font-size: 0.8rem;
        color: var(--light-text);
        font-family: var(--font);

        &:first-child {
          font-family: var(--font-alt);
          color: var(--dark-text);
        }
      }
    }
  }

  .row-action {
    display: flex;
    justify-content: flex-end;
  }

  .checkbox {
    padding: 0;
  }

  .product-photo {
    width: 80px;
    height: 80px;
    object-fit: contain;
  }

  .file-icon {
    width: 46px;
    height: 46px;
    object-fit: contain;
  }

  .drinks-icon {
    display: block;
    max-width: 48px;
    border-radius: var(--radius-rounded);
    border: 1px solid var(--fade-grey);
  }

  .negative-icon,
  .positive-icon {
    .iconify {
      height: 16px;
      width: 16px;
    }
  }

  .positive-icon {
    .iconify {
      color: var(--success);

      * {
        stroke-width: 4px;
      }
    }
  }

  .negative-icon {
    &.is-danger {
      .iconify {
        color: var(--danger) !important;
      }
    }

    .iconify {
      color: var(--light-text);

      * {
        stroke-width: 4px;
      }
    }
  }

  .price {
    color: var(--dark-text);
    font-weight: 500;

    &::before {
      content: '$';
    }

    &.price-free {
      color: var(--light-text);
    }
  }

  .status {
    display: flex;
    align-items: center;

    &.is-available {
      .iconify {
        color: var(--success);
      }
    }

    &.is-busy {
      .iconify {
        color: var(--danger);
      }
    }

    &.is-offline {
      .iconify {
        color: var(--light-text);
      }
    }

    .iconify {
      margin-right: 8px;
      font-size: 8px;
    }

    span {
      font-family: var(--font);
      font-size: 0.9rem;
      color: var(--light-text);
    }
  }
}

.is-dark {
  .datatable-wrapper {
    .datatable-container {
      border-color: color-mix(in oklab, var(--dark-sidebar), white 12%);
      background: color-mix(in oklab, var(--dark-sidebar), white 6%);
    }
  }

  .datatable-table {
    border-color: color-mix(in oklab, var(--dark-sidebar), white 12%);

    th,
    td {
      border-color: color-mix(in oklab, var(--dark-sidebar), white 12%);
      color: var(--dark-dark-text);
    }

    .drinks-icon {
      border-color: color-mix(in oklab, var(--dark-sidebar), white 12%);
    }
  }
}
</style>
