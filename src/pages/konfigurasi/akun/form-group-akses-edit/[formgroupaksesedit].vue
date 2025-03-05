<script setup lang="ts">
import Swal from 'sweetalert2'

interface HakAkses {
  IdController: string
  IdAction: string
}

interface DataAksiType {
  IdAction: string
  IdController: string
  NamaAction: string
  enabled: boolean
}
const pageTitle = useVueroContext<string>('page-title')
onMounted(() => {
  pageTitle.value = 'Edit Group Akses'
})

useHead(() => ({
  title: 'Edit Group Akses - Konfigurasi - Migrate',
}))

// const router = useRouter()
const route = useRoute()
const paramId = route.params.formgroupaksesedit

const $fetch = useApiFetch()
const notyf = useNotyf()
const { onceError } = useImageError()
const isUploading = ref(false)
const isLoading = ref(false)

const dataMenu = ref<any[]>([])
const dataSubMenu = ref<any[]>([])
const dataAksi = ref<DataAksiType[]>([])
// const hakAkses: Array<{ IdController: string, IdAction: string }> = []
const hakAkses = reactive<HakAkses[]>([])

const selectedMenu = ref(null)
const selectedSubMenu = ref('')
const titleSubMenu = ref('')

const Name = ref('')
const Keterangan = ref('')
const Photo = ref('')

// const isStuck = computed(() => {
//   return y.value > 30
// })

async function fetchMenu() {
  try {
    const resData = await $fetch(`MasterRole/accesRole`)

    if (resData) {
      dataMenu.value = resData
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

async function fetchEditData() {
  if (!paramId) return

  isLoading.value = true
  try {
    const response = await $fetch(`MasterRole/${paramId}`)
    if (response) {
      Name.value = response.Name
      Keterangan.value = response.Keterangan
      Photo.value = response.Photo
      hakAkses.splice(0, hakAkses.length, ...JSON.parse(response.Access))
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
  // console.log('Form submitted!')
  if (isLoading.value) return

  if (!Name.value) {
    notyf.error('Nama group akses wajib diisi')
    return
  }
  isLoading.value = true
  try {
    const payload = {
      Name: Name.value,
      Access: JSON.stringify(hakAkses, null, 2),
      Keterangan: Keterangan.value,
      Photo: Photo.value,
    }

    const response = await $fetch(`MasterRole/${paramId}`, {
      method: 'PUT',
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
    // console.log('File added (base64):', Photo.value)
  }
  reader.onerror = (err) => {
    console.error('Error reading file:', err)
  }
  // console.log(Photo.value)
}
const onRemoveFile = (error: any, file: any) => {
  if (error) {
    console.error(error)
    return
  }

  console.log('file removed', file)
  Photo.value = ''
}

// **Fungsi untuk mencocokkan dataAkses dan dataAksi**
const updateAksiWithAccess = () => {
  dataAksi.value.forEach((aksi: DataAksiType) => {
    aksi.enabled = hakAkses.some((akses: HakAkses) => akses.IdAction === aksi.IdAction)
  })
}

// **Jalankan fungsi update setiap kali `dataAkses` berubah**
// watch(hakAkses, updateAksiWithAccess, { immediate: true })
onMounted(() => {
  fetchMenu() // Muat opsi dropdown terlebih dahulu
  fetchEditData() // Ambil data edit berdasarkan ID
})

// Fungsi untuk menangani perubahan switch
const handleSwitchMenu = (item: any) => {
  dataSubMenu.value = item.ControllerViewModel
}
const handleSwitchSubMenu = (item: any) => {
  // console.log(item)
  dataAksi.value = item.ActionViewModel
  selectedSubMenu.value = item.IdController
  titleSubMenu.value = item.Controller
  updateAksiWithAccess()
}
const handleSelctAksi = (item: DataAksiType) => {
  if (item.enabled) {
    // Tambah ke hakAkses jika belum ada
    if (!hakAkses.some((hak: HakAkses) => hak.IdAction === item.IdAction)) {
      hakAkses.push({ IdController: selectedSubMenu.value, IdAction: item.IdAction })
    }
  }
  else {
    // Hapus dari hakAkses jika dimatikan
    const index = hakAkses.findIndex((hak: HakAkses) => hak.IdAction === item.IdAction)
    if (index !== -1) {
      hakAkses.splice(index, 1)
    }
  }

  console.log('Hak Akses Sekarang:', JSON.stringify(hakAkses, null, 2)) // Debugging
}
</script>

<template>
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
        <div
          class="form-header stuck-header"
        >
          <div class="form-header-inner">
            <div class="left">
              <h3>Form Group Akses</h3>
            </div>
            <div class="right">
              <div class="buttons">
                <VButton
                  icon="lnir lnir-arrow-left rem-100"
                  to="/konfigurasi/akun/group-akses"
                  light
                  dark-outlined
                >
                  Kembali
                </VButton>
                <VButton
                  type="submit"
                  color="primary"
                  raised
                >
                  Save
                </VButton>
              </div>
            </div>
          </div>
        </div>
        <div class="form-body">
          <!--Fieldset-->
          <div class="form-fieldset">
            <div class="fieldset-heading">
              <h4>Group Akses</h4>
              <p>Mengatur hak akses terhadap fitur aplikasi</p>
            </div>

            <div class="fieldset">
              <VAvatar
                size="xl"
                class="profile-v-avatar"
              >
                <template #avatar>
                  <img
                    v-if="!isUploading"
                    class="avatar"
                    :src="Photo ? Photo : '/images/avatars/role_1.png'"
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
              <div class="column is-12">
                <VField>
                  <VLabel>Group Akses</VLabel>
                  <VControl icon="lucide:key">
                    <VInput
                      v-model="Name"
                      type="text"
                      placeholder=""
                      autocomplete="given-name"
                    />
                  </VControl>
                </VField>
              </div>
              <div class="column is-12">
                <VField>
                  <VLabel>Keterangan</VLabel>
                  <VControl icon="lucide:file-text">
                    <VInput
                      v-model="Keterangan"
                      type="text"
                      placeholder=""
                      autocomplete="family-name"
                    />
                  </VControl>
                </VField>
              </div>
            </div>
          </div>
          <!--Fieldset-->
        </div>
      </div>

      <div class="columns is-multiline" style="margin-top: 5px;">
        <!-- menu -->
        <div class="column is-3">
          <div class="option-block">
            <div class="block-header">
              <h3>Menu</h3>
            </div>
            <div class="block-body">
              <div
                v-for="(item) in dataMenu"
                :key="item.IdMenu"
                class="meta"
              >
                <!-- Tambahkan kelas 'active' jika menu dipilih -->
                <span
                  class="dark-inverted clickable"
                  :class="{ active: selectedMenu === item.IdMenu }"
                  tabindex="0"
                  role="button"
                  @click="handleSwitchMenu(item)"
                  @keyup.enter="handleSwitchMenu(item)"
                  @keyup.space="handleSwitchMenu(item)"
                >
                  {{ item.NamaMenu }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <!-- sub menu -->
        <div class="column is-3">
          <div class="option-block">
            <div class="block-header">
              <h3>Sub Menu</h3>
            </div>
            <div class="block-body">
              <div
                v-for="(item) in dataSubMenu"
                :key="item.IdController"
                class="meta"
              >
                <!-- Tambahkan kelas 'active' jika menu dipilih -->
                <span
                  class="dark-inverted clickable"
                  :class="{ active: selectedMenu === item.IdController }"
                  tabindex="0"
                  role="button"
                  @click="handleSwitchSubMenu(item)"
                  @keyup.enter="handleSwitchSubMenu(item)"
                  @keyup.space="handleSwitchSubMenu(item)"
                >
                  {{ item.Controller }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <!-- aksi -->
        <div class="column is-6">
          <VField class="option-block">
            <div class="block-header">
              <h3>{{ titleSubMenu }}</h3>
            </div>
            <div class="block-body">
              <VControl v-for="(item) in dataAksi" :key="item.IdAction">
                <VSwitchBlock
                  v-model="item.enabled"
                  :label="item.NamaAction"
                  color="primary"
                  @update:model-value="handleSelctAksi(item)"
                />
              </VControl>
            </div>
          </VField>
        </div>
      </div>
    </VLoader>
  </form>
</template>

<style scoped lang="scss">
@import '/@src/scss/abstracts/all';
@import '/@src/scss/components/forms-outer';

/* Buat teks bisa diklik */
.clickable {
  cursor: pointer;
  color: green;
  text-decoration: underline;
  outline: none;
  transition: color 0.2s ease-in-out;
}

/* Warna saat hover */
.clickable:hover {
  color: darkblue;
}

/* Warna saat dipilih */
.active {
  color: white;
  background-color: blue;
  padding: 4px 8px;
  border-radius: 5px;
}

/* Indikator fokus saat keyboard digunakan */
.clickable:focus {
  border: 1px dashed green;
  padding: 2px;
}

.switch-block {
    padding: 3px 0 !important;
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

.form-layout {
  max-width: 1240px;
  margin: 0 auto;
}

.option-block {
        @include vuero-s-card;

        margin-bottom: 20px;

        .block-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;

          h3 {
            font-family: var(--font-alt);
            font-size: 1rem;
            font-weight: 600;
            color: var(--dark-text);
          }

          span {
            font-family: var(--font);
            color: var(--light-text);
          }

          a {
            font-family: var(--font);
            color: var(--light-text);

            &:hover,
            &:focus {
              color: var(--primary);
            }
          }
        }

        .block-body {
          &.is-seats {
            display: flex;
            padding-bottom: 10px;

            .v-avatar {
              margin-inline-end: 8px;
            }

            .add-seat {
              display: flex;
              justify-content: center;
              align-items: center;
              height: 40px;
              width: 40px;
              min-width: 40px;
              border-radius: var(--radius-rounded);
              border: 1.6px dashed var(--light-text);
              color: var(--light-text);
              padding: 0;
              background: none;
              margin-inline-start: 4px;
              cursor: pointer;
              transition:
                color 0.3s,
                background-color 0.3s,
                border-color 0.3s,
                height 0.3s,
                width 0.3s;

              &:hover,
              &:focus {
                border: 1.6px solid var(--primary);
                color: var(--primary);
              }

              .iconify {
                font-size: 16px;
              }
            }
          }
        }
      }
</style>
