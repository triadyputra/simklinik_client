<script setup lang="ts">
const pageTitle = useVueroContext<string>('page-title')
onMounted(() => {
  pageTitle.value = 'Master Cabang'
})

useHead({
  title: 'Master Cabang - Konfigurasi - TAG',
})
</script>

<template>
  <ViewCabang />
</template>
