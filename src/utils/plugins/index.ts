import type { App } from 'vue'
import type { VueHeadClient, MergeHead } from '@unhead/vue'
import type { Router } from 'vue-router/auto'
import type { Pinia } from 'pinia'
import type { H3Event } from 'h3'

export interface VueroAppContext {
  app: App
  router: Router
  head: VueHeadClient<MergeHead>
  pinia: Pinia
  event?: H3Event
}
export type VueroPlugin = (vuero: VueroAppContext) => void | Promise<void>

// this is a helper function to define plugins with autocompletion
export function definePlugin(plugin: VueroPlugin) {
  return plugin
}
