<script setup lang="ts">
const pageTitle = useVueroContext<string>('page-title')
onMounted(() => {
  pageTitle.value = 'Master Mobil'
})

useHead({
  title: 'Master Mobil - Konfigurasi - TAG',
})
</script>

<template>
  <ViewMobil />
</template>
