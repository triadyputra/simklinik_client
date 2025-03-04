<script setup lang="ts">
const pageTitle = useVueroContext<string>('page-title')
onMounted(() => {
  pageTitle.value = 'Cheklis Kendaraan CIT'
})

useHead({
  title: 'Cheklis Kendaraan CIT - Guard - TAG',
})
</script>

<template>
  <ViewCit />
</template>
