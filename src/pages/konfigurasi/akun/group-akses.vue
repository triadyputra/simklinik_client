<script setup lang="ts">
const pageTitle = useVueroContext<string>('page-title')
onMounted(() => {
  pageTitle.value = 'Group Akses'
})

useHead({
  title: 'Group Akses - Konfigurasi - TAG',
})
</script>

<template>
  <ViewGroupAkses />
</template>
