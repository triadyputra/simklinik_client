<script setup lang="ts">
const pageTitle = useVueroContext<string>('page-title')
onMounted(() => {
  pageTitle.value = 'Cheklis Kendaraan RPL'
})

useHead({
  title: 'Cheklis Kendaraan RPL - Guard - TAG',
})
</script>

<template>
  <ViewRpl />
</template>
