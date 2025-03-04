<script setup lang="ts">
import Swal from 'sweetalert2'

const pageTitle = useVueroContext<string>('page-title')
onMounted(() => {
  pageTitle.value = 'Tambah Pengguna'
})

useHead(() => ({
  title: 'Tambah Pengguna - Konfigurasi - TAG',
}))

const { y } = useWindowScroll()

const $fetch = useApiFetch()
const notyf = useNotyf()
const { onceError } = useImageError()
const isUploading = ref(false)
const isLoading = ref(false)

const FullName = ref('')
const UserName = ref('')
const Email = ref('')
const PhoneNumber = ref('')
const Active = ref('')
const Photo = ref('')
const Groups = ref<string[]>([])
const Cabang = ref('')
const selectStatusIconOptions = [
  { label: 'Active', value: 'Active' },
  { label: 'Non Active', value: 'Non Active' },
]
const tagsCabang = ref([])
const tagsOptions = ref([])
async function fetchCombo() {
  try {
    const resData = await $fetch(`Combo/ComboFormUser`)
    // console.log(resData)
    // Pastikan resData tidak null sebelum assign
    if (resData) {
      tagsCabang.value = resData.cabang
      tagsOptions.value = resData.role
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

const isStuck = computed(() => {
  return y.value > 30
})

const onSubmit = async () => {
  // console.log('Form submitted!')
  if (isLoading.value) return

  if (!FullName.value) {
    notyf.error('Nama Lengkap wajib diisi')
    return
  }
  if (!UserName.value) {
    notyf.error('Username wajib diisi')
    return
  }
  if (!Email.value) {
    notyf.error('Email wajib diisi')
    return
  }

  isLoading.value = true
  try {
    const payload = {
      FullName: FullName.value,
      UserName: UserName.value.trim(),
      Email: Email.value.trim(),
      PhoneNumber: PhoneNumber.value,
      Active: Active.value == 'Active' ? true : false,
      Group: Groups.value,
      Photo: Photo.value,
      IdCabang: Cabang.value,
    }

    const response = await $fetch('Akun', {
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

fetchCombo()
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
          :class="[isStuck && 'is-stuck']"
          class="form-header stuck-header"
        >
          <div class="form-header-inner">
            <div class="left">
              <h3>Form Pengguna Baru</h3>
            </div>
            <div class="right">
              <div class="buttons">
                <VButton
                  icon="lnir lnir-arrow-left rem-100"
                  to="/konfigurasi/akun/pengguna"
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
              <h4>Pengguna Aplikasi</h4>
              <p>Menambah dan menghapus daftar pengguna aplikasi</p>
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
                    src="/images/avatars/role_4.png"
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
                  <VLabel>Nama Pengguna</VLabel>
                  <VControl icon="lucide:credit-card">
                    <VInput
                      v-model="FullName"
                      type="text"
                      placeholder=""
                      autocomplete="given-name"
                    />
                  </VControl>
                </VField>
              </div>
              <div class="column is-12">
                <VField>
                  <VLabel>Username</VLabel>
                  <VControl icon="lucide:user">
                    <VInput
                      v-model="UserName"
                      type="text"
                      placeholder=""
                      autocomplete="family-name"
                    />
                  </VControl>
                </VField>
              </div>
              <div class="column is-12">
                <VField>
                  <VLabel>Email</VLabel>
                  <VControl icon="lucide:mail">
                    <VInput
                      v-model="Email"
                      type="text"
                      placeholder=""
                      autocomplete="family-name"
                    />
                  </VControl>
                </VField>
              </div>
              <div class="column is-6">
                <VField>
                  <VLabel>Hp</VLabel>
                  <VControl icon="lucide:phone-call">
                    <VInput
                      v-model="PhoneNumber"
                      type="text"
                      placeholder=""
                      autocomplete="family-name"
                    />
                  </VControl>
                </VField>
              </div>
              <div class="column is-6">
                <VField v-slot="{ id }" class="is-autocomplete-select">
                  <VLabel>Status</VLabel>
                  <VControl icon="lucide:search">
                    <Multiselect
                      v-model="Active"
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
                <VField v-slot="{ id }" class="is-autocomplete-select">
                  <VLabel>Cabang</VLabel>
                  <VControl icon="fas fa-map-marker-alt">
                    <Multiselect
                      v-model="Cabang"
                      :attrs="{ id }"
                      :options="tagsCabang"
                      label="label"
                      track-by="label"
                      placeholder="Pilih Cabang..."
                      :searchable="true"
                    />
                  </VControl>
                </VField>
              </div>
              <div class="column is-12">
                <VField v-slot="{ id }" class="is-autocomplete-select">
                  <VLabel>Group Akses</VLabel>
                  <VControl icon="lucide:search">
                    <Multiselect
                      v-model="Groups"
                      :attrs="{ id }"
                      mode="tags"
                      :searchable="true"
                      :create-tag="true"
                      :options="tagsOptions"
                      placeholder="Group Akses"
                    />
                  </VControl>
                </VField>
              </div>
            </div>
          </div>
          <!--Fieldset-->
        </div>
      </div>
    </VLoader>
  </form>
</template>

<style scoped lang="scss">
@import '/@src/scss/abstracts/all';
@import '/@src/scss/components/forms-outer';

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
  max-width: 740px;
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
