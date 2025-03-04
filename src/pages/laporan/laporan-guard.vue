<route lang="yaml">
    meta:
      requiresAuth: true
    </route>

<script setup lang="ts">
const layoutSwitcher = useLayoutSwitcher()
</script>

<template>
  <component
    :is="(layoutSwitcher.dynamicLayoutComponent as any)"
    v-bind="layoutSwitcher.dynamicLayoutProps"
    close-on-mounted
    default-sidebar="laporan"
  >
    <!-- Content Wrapper -->
    <RouterView v-slot="{ Component }">
      <Transition
        name="fade-fast"
        mode="out-in"
      >
        <component :is="Component" />
      </Transition>
    </RouterView>
  </component>
</template>

<!-- close-on-change -->
<!-- open-on-mounted -->
