<script setup lang="ts">

// const { t } = useI18n()

const pageTitle = useVueroContext<string>('page-title')
onMounted(() => {
//   pageTitle.value = t('pages.dashboard-personnal-1.page-title')
  pageTitle.value = 'Poliklinik'
})

useHead(() => ({
  // title: `${t('pages.dashboard-personnal-1.page-title')} - Sidebar - Vuero`,
  title: 'Master Poliklinik - Konfigurasi - Migrate',
}))
</script>

<template>
  <ViewPoli />
</template>
