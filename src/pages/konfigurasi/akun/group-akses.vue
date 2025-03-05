<script setup lang="ts">
const pageTitle = useVueroContext<string>('page-title')
onMounted(() => {
  pageTitle.value = 'Group Akses'
})

useHead({
  title: 'Group Akses - Konfigurasi - Migrate',
})
</script>

<template>
  <ViewGroupAkses />
</template>
