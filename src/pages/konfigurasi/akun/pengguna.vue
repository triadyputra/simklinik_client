<script setup lang="ts">

// const { t } = useI18n()

const pageTitle = useVueroContext<string>('page-title')
onMounted(() => {
//   pageTitle.value = t('pages.dashboard-personnal-1.page-title')
  pageTitle.value = 'Pengguna'
})

useHead(() => ({
  // title: `${t('pages.dashboard-personnal-1.page-title')} - Sidebar - Vuero`,
  title: 'Pengguna - Konfigurasi - Migrate',
}))
</script>

<template>
  <ViewPengguna />
</template>
