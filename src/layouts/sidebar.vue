<script setup lang="ts">
import type { SidebarItem } from '/@src/components/layouts/sidebar/sidebar.types'

// import LayoutSwitcher from '/@src/components/partials/layout/LayoutSwitcher.vue'
import ToolbarUserProfile from '/@src/components/partials/layout/toolbar/ToolbarUserProfile.vue'

// const panels = usePanels()

const links = ref<SidebarItem[]>([
  {
    id: 'operasional',
    label: 'OPS',
    icon: 'lucide:monitor',

    type: 'subsidebar',
    subsidebar: {
      label: 'OPS',
      items: [
        {
          type: 'collapse',
          id: 'guard',
          label: 'Guard',
          children: [
            {
              label: 'Cheklis RPL',
              to: '/guard/cheklis-kendaraan/rpl',
              icon: 'lnil lnil-round-box-check',
            },
            {
              label: 'Cheklis CIT',
              to: '/guard/cheklis-kendaraan/cit',
              icon: 'lnil lnil-checkmark-circle',
            },
          ],
        },
      ],
    },
  },
  {
    id: 'konfigurasi',
    label: 'Konfigurasi',
    icon: 'lucide:settings',

    type: 'subsidebar',
    subsidebar: {
      label: 'Konfigurasi',
      items: [
        {
          type: 'collapse',
          id: 'masterdata',
          label: 'Master Data',
          children: [
            {
              label: 'Master Cabang',
              to: '/konfigurasi/master-data/master-cabang',
              icon: 'lnil lnil-apartment',
            },
            {
              label: 'Master Mobil',
              to: '/konfigurasi/master-data/master-mobil',
              icon: 'lnil lnil-car',
            },
          ],
        },
        {
          type: 'collapse',
          id: 'akun',
          label: 'Akun',
          children: [
            {
              label: 'Pengguna',
              to: '/konfigurasi/akun/pengguna',
              icon: 'lnil lnil-users-alt',
            },
            {
              label: 'Gorup Akses',
              to: '/konfigurasi/akun/group-akses',
              icon: 'lnil lnil-lock-alt',
            },
          ],
        },
      ],
    },
  },
  {
    id: 'laporan',
    label: 'Laporan',
    icon: 'lucide:file-stack',

    type: 'subsidebar',
    subsidebar: {
      label: 'Laporan',
      items: [
        {
          type: 'collapse',
          id: 'icons',
          label: 'Guard',
          children: [
            {
              to: '/laporan/laporan-guard/form-laporan-cheklis-rpl',
              label: 'Cheklis Kendaraan RPL',
              icon: 'lucide:circle',
            },
            {
              to: '/laporan/laporan-guard/form-laporan-cheklis-cit',
              label: 'Cheklis Kendaraan CIT',
              icon: 'lucide:circle',
            },
          ],
        },
      ],
    },
  },
])

const linksBottom = ref<SidebarItem[]>([
  {
    id: 'user-profile-dropdown',
    type: 'component',
    hideMobile: true,
    component: () => h(ToolbarUserProfile, { end: true }),
  },
])
</script>

<template>
  <SidebarLayout
    size="wide"
    :links
    :links-bottom="linksBottom"
    default-sidebar="pelayanan"
  >
    <!-- Propagating the context to the default slot -->
    <template #default="context">
      <slot v-bind="context" />
    </template>

    <!-- Expose the page-heading slot -->
    <template #page-heading="context">
      <slot name="page-heading" v-bind="context" />
    </template>

    <template #logo>
      <RouterLink to="/">
        <AnimatedLogo width="36px" />
      </RouterLink>
    </template>

    <template #subsidebar-title="{ activeSubsidebar }">
      <ProjectsQuickDropdown v-if="activeSubsidebar?.id === 'pelayanan'" />

      <h3>{{ activeSubsidebar?.subsidebar.label }}</h3>
    </template>

    <template #toolbar>
      <ToolbarThemeToggle />
      <!-- <ToolbarLanguage />
      <ToolbarNotification />
      <ToolbarActivity /> -->
    </template>

    <template #toolbar-mobile>
      <!-- <ToolbarNotificationMobile /> -->
      <ToolbarUserProfile right />
    </template>

    <template #extra>
      <!-- <CircularMenu /> -->

      <PanelLanguages />
      <PanelActivity />
      <!-- <PanelSearch /> -->
      <PanelTask />

      <ClientOnly>
        <VReloadPrompt app-name="Vuero" />
      </ClientOnly>
    </template>
  </SidebarLayout>
</template>
