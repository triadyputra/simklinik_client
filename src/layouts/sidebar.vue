<script setup lang="ts">
import type { SidebarItem } from '/@src/components/layouts/sidebar/sidebar.types'

// import LayoutSwitcher from '/@src/components/partials/layout/LayoutSwitcher.vue'
import ToolbarUserProfile from '/@src/components/partials/layout/toolbar/ToolbarUserProfile.vue'

// const panels = usePanels()

const links = ref<SidebarItem[]>([
  {
    id: 'pelayanan',
    label: 'Pelayanan',
    icon: 'lucide:hospital',

    type: 'subsidebar',
    subsidebar: {
      label: 'Pelayanan',
      items: [
        {
          type: 'link',
          label: 'Master Pasien',
          to: '/pelayanan/rajal',
        },
        {
          type: 'divider',
        },
        {
          type: 'collapse',
          id: 'rawatjalan',
          label: 'Rawat Jalan',
          children: [
            {
              label: 'Reservasi',
              to: '/pelayanan/rajal/reservasi',
              icon: 'lnil lnil-phone-set',
            },
            {
              label: 'Antrean',
              to: '/pelayanan/rajal/antrian',
              icon: 'lnil lnil-trees',
            },
            {
              label: 'Registrasi',
              to: '/pelayanan/rajal/registrasi',
              icon: 'lnil lnil-revenue',
            },
          ],
        },
        {
          type: 'collapse',
          id: 'rekammedis',
          label: 'Rekam Medis',
          children: [
            {
              label: 'Resume Rawat Jalan',
              to: '/sidebar/dashboards/analytics',
              icon: 'lnil lnil-wheelchair',
            },
            {
              label: 'Resume Rawat Inap',
              to: '/sidebar/dashboards/stocks',
              icon: 'lnil lnil-hospital-bed-alt-2',
            },
          ],
        },
        {
          type: 'collapse',
          id: 'farmasi',
          label: 'Farmasi',
          children: [
            {
              label: 'Penanggung Jawab',
              to: '/sidebar/dashboards/banking-1',
              icon: 'lnil lnil-user-alt',
            },
            {
              label: 'Daftar Signa',
              to: '/sidebar/dashboards/banking-2',
              icon: 'lnil lnil-diagnosis-alt',
            },
            {
              label: 'Resep Dokter',
              to: '/sidebar/dashboards/banking-3',
              icon: 'lnil lnil-capsule',
            },
          ],
        },
        {
          type: 'collapse',
          id: 'labor',
          label: 'Laboratorium',
          children: [
            {
              label: 'Order Laboratorium',
              to: '/sidebar/dashboards/flights',
              icon: 'lnil lnil-thermometer',
            },
            {
              label: 'Penanggung Jawab',
              to: '/sidebar/dashboards/company',
              icon: 'lnil lnil-user-alt',
            },
          ],
        },
        {
          type: 'collapse',
          id: 'radio',
          label: 'Radiologi',
          children: [
            {
              label: 'Order Radiologi',
              to: '/sidebar/dashboards/influencer',
              icon: 'lnil lnil-heartrate-monitor',
            },
            {
              label: 'Penanggung Jawab',
              to: '/sidebar/dashboards/hobbies',
              icon: 'lnil lnil-user-alt',
            },
          ],
        },
        {
          type: 'collapse',
          id: 'kasir',
          label: 'Kasir',
          children: [
            {
              label: 'Kasir Rawat Jalan',
              to: '/sidebar/dashboards/ecommerce-1',
              icon: 'lnil lnil-calculator-alt',
            },
            {
              label: 'Kasir Rawat Inap',
              to: '/sidebar/dashboards/ecommerce-1',
              icon: 'lnil lnil-calculator',
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
              label: 'Poliklinik',
              to: '/konfigurasi/master-data/poli',
              icon: 'lnil lnil-hospital',
            },
            {
              label: 'Penjamin',
              to: '/sidebar/layouts/list-view-2',
              icon: 'lnil lnil-ticket-alt-3',
            },
            {
              label: 'Spesialis',
              to: '/sidebar/layouts/list-view-3',
              icon: 'lnil lnil-graduate',
            },
            {
              label: 'Diagnosa',
              to: '/sidebar/layouts/list-view-4',
              icon: 'lnil lnil-diagnosis',
            },
          ],
        },
        {
          type: 'collapse',
          id: 'nakes',
          label: 'Tenaga Kesehatan',
          children: [
            {
              label: 'Group',
              to: '/sidebar/layouts/list-datatable-1',
              icon: 'lnil lnil-thumbnail',
            },
            {
              label: 'Tenaga Kesehatan',
              to: '/sidebar/layouts/list-datatable-2',
              icon: 'lnil lnil-sthethoscope',
            },
          ],
        },
        {
          type: 'collapse',
          id: 'layanan',
          label: 'Layanan',
          children: [
            {
              label: 'Rawat Jalan & Rawat Inap',
              to: '/sidebar/layouts/list-flex-1',
              icon: 'lnil lnil-first-aid',
            },
            {
              label: 'Laboratorium',
              to: '/sidebar/layouts/list-flex-2',
              icon: 'lnil lnil-thermometer-alt',
            },
            {
              label: 'Radiologi',
              to: '/sidebar/layouts/list-flex-3',
              icon: 'lnil lnil-heartrate-monitor',
            },
          ],
        },
        {
          type: 'collapse',
          id: 'inventory',
          label: 'Inventory',
          children: [
            {
              label: 'Golongan Obat',
              to: '/sidebar/layouts/form-layouts-1',
              icon: 'lnil lnil-unlink',
            },
            {
              label: 'Jenis Inventory',
              to: '/sidebar/layouts/form-layouts-2',
              icon: 'lnil lnil-delivery',
            },
            {
              label: 'Kategori Obat',
              to: '/sidebar/layouts/form-layouts-3',
              icon: 'lnil lnil-passport',
            },
            {
              label: 'Satuan',
              to: '/sidebar/layouts/form-layouts-4',
              icon: 'lnil lnil-triangle-ruler-1',
            },
            {
              label: 'BHP & Obat',
              to: '/sidebar/layouts/form-layouts-5',
              icon: 'lnil lnil-medicine',
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
      label: 'Components',
      items: [
        {
          type: 'link',
          to: '/components/',
          label: 'Components Hub',
        },
        {
          type: 'link',
          to: '/components/colors',
          label: 'Colors',
        },
        {
          type: 'link',
          to: '/components/helpers',
          label: 'Helpers',
        },
        {
          type: 'link',
          to: '/components/content',
          label: 'Content',
        },
        {
          type: 'link',
          to: '/components/table',
          label: 'Table',
        },
        {
          type: 'collapse',
          id: 'icons',
          label: 'Icons',
          children: [
            {
              to: '/components/icons/iconify',
              label: 'Iconify',
              icon: 'lucide:circle',
            },
            {
              to: '/components/icons/line-icons-light',
              label: 'Line Icons Light',
              icon: 'lucide:circle',
            },
            {
              to: '/components/icons/line-icons-regular',
              label: 'Line Icons Regular',
              icon: 'lucide:circle',
            },
            {
              to: '/components/icons/font-awesome',
              label: 'Font Awesome 5',
              icon: 'lucide:circle',
            },
          ],
        },
        {
          type: 'divider',
          label: 'Interaction',
        },
        {
          type: 'link',
          to: '/components/dropdown',
          label: 'VDropdown',
        },
        {
          type: 'link',
          to: '/components/loader',
          label: 'VLoader',
        },
        {
          type: 'link',
          to: '/components/placeload/',
          label: 'VPlaceload',
        },
        {
          type: 'link',
          to: '/components/placeload/text',
          label: 'VPlaceloadText',
        },
        {
          type: 'link',
          to: '/components/placeload/avatar',
          label: 'VPlaceloadAvatar',
        },
        {
          type: 'link',
          to: '/components/message',
          label: 'VMessage',
        },
        {
          type: 'link',
          to: '/components/modal',
          label: 'VModal',
        },
        {
          type: 'link',
          to: '/components/progress',
          label: 'VProgress',
        },
        {
          type: 'link',
          to: '/components/tooltip',
          label: 'VTootlip',
        },
        {
          type: 'collapse',
          id: 'buttons',
          label: 'Buttons',
          children: [
            {
              to: '/components/button',
              label: 'VButton',
            },
            {
              to: '/components/action',
              label: 'VAction',
            },
            {
              to: '/components/icon-button',
              label: 'VIconButton',
            },
          ],
        },
        {
          type: 'collapse',
          id: 'forms',
          label: 'Forms',
          children: [
            {
              to: '/components/forms/field',
              label: 'VField',
            },
            {
              to: '/components/forms/control',
              label: 'VControl',
            },
            {
              to: '/components/forms/inputs',
              label: 'VInput',
            },
            {
              to: '/components/forms/textarea',
              label: 'VTextarea',
            },
            {
              to: '/components/forms/selects',
              label: 'VSelect',
            },
            {
              to: '/components/checkbox',
              label: 'VCheckbox',
            },
            {
              to: '/components/radio',
              label: 'VRadio',
            },
            {
              to: '/components/forms/range-rating',
              label: 'VRangeRating',
            },
            {
              to: '/components/forms/file',
              label: 'File Input',
            },
          ],
        },
        {
          type: 'collapse',
          id: 'switches',
          label: 'Switches',
          children: [
            {
              to: '/components/animated-checkbox',
              label: 'VAnimatedCheckbox',
            },
            {
              to: '/components/switch-block',
              label: 'VSwitchBlock',
            },
            {
              to: '/components/switch-segment',
              label: 'VSwitchSegment',
            },
          ],
        },
        {
          type: 'divider',
          label: 'Display',
        },
        {
          type: 'link',
          to: '/components/avatar/',
          label: 'VAvatar',
        },
        {
          type: 'link',
          to: '/components/avatar/stack',
          label: 'VAvatarStack',
        },
        {
          type: 'link',
          to: '/components/block',
          label: 'VBlock',
        },
        {
          type: 'link',
          to: '/components/icon-box',
          label: 'VIconBox',
        },
        {
          type: 'link',
          to: '/components/icon-wrap',
          label: 'VIconWrap',
        },
        {
          type: 'link',
          to: '/components/snack',
          label: 'VSnack',
        },
        {
          type: 'link',
          to: '/components/tag',
          label: 'VTag',
        },
        {
          type: 'link',
          to: '/components/flex',
          label: 'VFlex',
        },
        {
          type: 'link',
          to: '/components/grid',
          label: 'VGrid',
        },
        {
          type: 'link',
          to: '/components/breadcrumb',
          label: 'VBreadcrumb',
        },
        {
          type: 'link',
          to: '/components/tabs',
          label: 'VTabs',
        },
        {
          type: 'link',
          to: '/components/pagination',
          label: 'VFlexPagination',
        },
        {
          type: 'collapse',
          label: 'VFlexTable',
          id: 'flextable',
          children: [
            {
              to: '/components/flextable/',
              label: 'Basic usage',
            },
            {
              to: '/components/flextable/columns',
              label: 'Customize columns',
            },
            {
              to: '/components/flextable/slots',
              label: 'Slots usage',
            },
            {
              to: '/components/flextable/render',
              label: 'Render functions (advanced)',
            },
            {
              to: '/components/flextable/wrapper/',
              label: 'VFlexTableWrapper',
            },
            {
              to: '/components/flextable/wrapper/async',
              label: 'Async data (advanced)',
            },
          ],
        },
        {
          type: 'collapse',
          label: 'Accordions',
          id: 'accordions',
          children: [
            {
              to: '/components/accordion/',
              label: 'VAccordion',
            },
            {
              to: '/components/collapse',
              label: 'VCollapse',
            },
            {
              to: '/components/accordion/image',
              label: 'VAccordionImage',
            },
          ],
        },
        {
          type: 'collapse',
          label: 'Cards',
          id: 'cards',
          children: [
            {
              to: '/components/card/',
              label: 'VCard',
            },
            {
              to: '/components/card/action',
              label: 'VCardAction',
            },
            {
              to: '/components/card/advanced',
              label: 'VCardAdvanced',
            },
            {
              to: '/components/card/media',
              label: 'VCardMedia',
            },
            {
              to: '/components/card/social',
              label: 'VCardSocial',
            },
          ],
        },
        {
          type: 'collapse',
          label: 'Placeholders',
          id: 'placeholders',
          children: [
            {
              to: '/components/placeholder-page',
              label: 'VPlaceholderPage',
            },
            {
              to: '/components/placeholder-section',
              label: 'VPlaceholderSection',
            },
          ],
        },
        {
          type: 'divider',
        },
        {
          type: 'collapse',
          id: 'addons',
          label: 'Addons',
          children: [
            {
              to: '/components/plugins/notif',
              label: 'Notyf',
            },
            {
              to: '/components/plugins/tippy',
              label: 'Tippy',
            },
            {
              to: '/components/plugins/billboard-js',
              label: 'VBillboardJS',
            },
            {
              to: '/components/plugins/photos-swipe',
              label: 'VPhotosSwipe',
            },
            {
              to: '/components/plugins/plyr',
              label: 'VPlyr',
            },
            {
              to: '/components/markdown-preview',
              label: 'VMarkdownPreview',
            },
            {
              to: '/components/markdown-editor',
              label: 'VMarkdownEditor',
            },
            {
              to: '/components/addons/calendar',
              label: 'VCalendar & VDatePicker',
            },
            {
              to: '/components/addons/imask-input',
              label: 'VIMaskInput',
            },
            {
              to: '/components/addons/filepond',
              label: 'VFilePond',
            },
            {
              to: '/components/addons/credit-card',
              label: 'VCreditCard',
            },
            {
              to: '/components/addons/vueform-multiselect',
              label: '@vueform/multiselect',
            },
            {
              to: '/components/addons/vueform-slider',
              label: '@vueform/slider',
            },
            {
              to: '/components/addons/ckeditor',
              label: 'CKEditor 5',
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
