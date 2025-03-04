<script setup lang="ts">
import { format } from 'date-fns'
import Swal from 'sweetalert2'

const userSession = useUserSession()
const router = useRouter()
const route = useRoute()
const $fetch = useApiFetch()
const notyf = useNotyf()
const isLoading = ref(false)
const data = ref<any[]>([])
const totalItems = ref(0)
const filter = ref('')
const page = ref(1)
const perPage = ref(10)

const redirect = route.query.redirect as string
const canView = userSession.checkPermission('Role', 'GetListRole')
const canAdd = userSession.checkPermission('Role', 'PostRole')
const canEdit = userSession.checkPermission('Role', 'PutRole')
const canDelete = userSession.checkPermission('Role', 'DeleteRole')
// console.log(canEdit)

if (!canView) {
  router.push(redirect || '/error/page-1')
}

async function fetchData() {
  try {
    isLoading.value = true
    const resData = await $fetch(`Role/GetListRole`, {
      params: {
        filter: filter.value,
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
watch([filter, page], () => {
  setTimeout(fetchData, 500) // Debounce 500ms untuk pencarian
})

// Fetch pertama kali saat komponen dipasang
fetchData()

const goToEdit = (id: string) => {
  if (!id) {
    console.error('NoRm tidak ditemukan')
    return
  }
  router.push(`/konfigurasi/akun/form-group-akses-edit/${id}`)
}

function getAvatar() {
  const randomNumber = Math.floor(Math.random() * 5) + 1
  return `/images/avatars/role_${randomNumber}.png`
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
      const response = await $fetch(`Role/${id}`, {
        method: 'DELETE',
      })
      console.log(response)
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
}

</script>

<template>
  <div>
    <div class="tile-grid-toolbar">
      <VControl icon="lucide:search">
        <input
          v-model="filter"
          class="input custom-text-filter"
          placeholder="Search..."
        >
      </VControl>

      <div class="buttons">
        <VButton
          v-if="canAdd"
          color="primary"
          raised
          to="/konfigurasi/akun/form-group-akses-add"
        >
          <span class="icon">
            <i
              aria-hidden="true"
              class="fas fa-plus"
            />
          </span>
          <span>Tambah</span>
        </VButton>
      </div>
    </div>

    <div class="tile-grid tile-grid-v2">
      <div class="columns is-multiline">
        <div
          v-for="(key, index) in 15"
          :key="`skeleton-${index}`"
          class="column is-4"
          :class="{'is-hidden': !isLoading}"
        >
          <div class="tile-grid-item">
            <div class="tile-grid-item-inner placeload-wrap is-flex">
              <VPlaceloadAvatar size="medium" />
              <VPlaceloadText
                width="80%"
                last-line-width="60%"
                class="mx-2"
              />
            </div>
          </div>
        </div>
      </div>

      <!--Tile Grid v1-->
      <TransitionGroup
        name="list"
        tag="div"
        class="columns is-multiline"
      >
        <!--Grid item-->
        <div
          v-for="item in data"
          :key="item.Id"
          class="column is-4"
        >
          <div class="tile-grid-item">
            <div class="tile-grid-item-inner">
              <img
                :src="item.Photo ?? getAvatar()"
                alt=""
              >
              <div class="meta">
                <span class="dark-inverted">{{ item.Name }}</span>
                <span>
                  <span>{{ item.Keterangan }}</span>
                </span>
              </div>
              <VDropdown
                icon="lucide:more-vertical"
                spaced
                right
              >
                <template #content>
                  <a
                    v-if="canEdit"
                    role="menuitem"
                    href="#"
                    class="dropdown-item is-media"
                    @click.prevent="goToEdit(item.Id)"
                  >
                    <div class="icon">
                      <i
                        aria-hidden="true"
                        class="lnil  lnil-pencil-alt"
                      />
                    </div>
                    <div class="meta">
                      <span>Edit</span>
                      <span>Edit Group Akses</span>
                    </div>
                  </a>
                  <hr class="dropdown-divider">
                  <a
                    v-if="canDelete"
                    role="menuitem"
                    href="#"
                    class="dropdown-item is-media"
                    @click.prevent="deleteData(item.Id)"
                  >
                    <div class="icon">
                      <i
                        aria-hidden="true"
                        class="lnil lnil-trash-can-alt"
                      />
                    </div>
                    <div class="meta">
                      <span>Hapus</span>
                      <span>Hapus Group Akses</span>
                    </div>
                  </a>
                </template>
              </VDropdown>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<style lang="scss">
@import '/@src/scss/abstracts/all';

.tile-grid {
  .columns {
    margin-inline-start: -0.5rem !important;
    margin-inline-end: -0.5rem !important;
    margin-top: -0.5rem !important;
  }

  .column {
    padding: 0.5rem !important;
  }
}

.tile-grid-v2 {
  .tile-grid-item {
    @include vuero-s-card;

    border-radius: 14px;
    padding: 16px;
    cursor: pointer;

    &:hover,
    &:focus {
      border-color: var(--primary);
      box-shadow: var(--light-box-shadow);
    }

    .tile-grid-item-inner {
      display: flex;
      align-items: center;

      > img {
        display: block;
        width: 50px;
        height: 50px;
        min-width: 50px;
      }

      .meta {
        margin-inline-start: 10px;
        line-height: 1.4;

        span {
          display: block;
          font-family: var(--font);

          &:first-child {
            color: var(--dark-text);
            font-family: var(--font-alt);
            font-weight: 600;
            font-size: 1rem;
          }

          &:nth-child(2) {
            display: flex;
            align-items: center;

            span {
              display: inline-block;
              color: var(--light-text);
              font-size: 0.8rem;
              font-weight: 400;
            }

            .icon-separator {
              position: relative;
              font-size: 4px;
              color: var(--light-text);
              padding: 0 6px;
            }
          }
        }
      }

      .dropdown {
        margin-inline-start: auto;
      }
    }
  }
}

.is-dark {
  .tile-grid {
    .tile-grid-item {
      @include vuero-card--dark;
    }
  }

  .tile-grid-v2 {
    .tile-grid-item {
      @include vuero-card--dark;

      &:hover,
      &:focus {
        border-color: var(--primary) !important;
      }
    }
  }
}
</style>
