<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{ description?: string; hasResources?: boolean }>()

const active = ref<'descripcion' | 'recursos' | 'qa'>('descripcion')

function setTab(t: 'descripcion' | 'recursos' | 'qa') { active.value = t }
</script>

<template>
  <div class="tabs">
    <div class="tabbar">
      <button type="button" class="tab" :class="{ active: active === 'descripcion' }" @click="setTab('descripcion')">
        <i class="fa-regular fa-file-lines" /> Descripción
      </button>
      <button v-if="hasResources" type="button" class="tab" :class="{ active: active === 'recursos' }" @click="setTab('recursos')">
        <i class="fa-solid fa-paperclip" /> Recursos
      </button>
      <button type="button" class="tab" :class="{ active: active === 'qa' }" @click="setTab('qa')">
        <i class="fa-regular fa-comment-dots" /> Q&A
      </button>
    </div>

    <div class="panel" v-if="active === 'descripcion'">
      <p class="desc">{{ props.description || 'Sin descripción disponible.' }}</p>
    </div>
    <div class="panel" v-else-if="active === 'recursos'">
      <slot name="resources" />
    </div>
    <div class="panel" v-else>
      <slot name="qa" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tabs { background: var(--bg); border: 1px solid var(--border); border-radius: 12px; padding: 12px; display: grid; gap: 12px; color: var(--text); }
.tabbar { display: flex; align-items: center; gap: 8px; }
.tab { background: none; border: 1px solid var(--border); color: var(--text); border-radius: 999px; padding: 8px 12px; font-size: 13px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; }
.tab.active { background: color-mix(in oklab, var(--accent), transparent 92%); border-color: var(--border); }
.panel { padding: 6px 2px; }
.desc { color: color-mix(in oklab, var(--text), transparent 40%); line-height: 1.6; }
</style>
