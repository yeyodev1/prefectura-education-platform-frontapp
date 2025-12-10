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
.tabs { background: $white; border-radius: 12px; padding: 12px; display: grid; gap: 12px; }
.tabbar { display: flex; align-items: center; gap: 8px; }
.tab { background: none; border: 1px solid rgba($FUDMASTER-DARK, 0.08); color: $FUDMASTER-DARK; border-radius: 999px; padding: 8px 12px; font-size: 13px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; }
.tab.active { background: $overlay-purple; border-color: rgba($FUDMASTER-DARK, 0.12); }
.panel { padding: 6px 2px; }
.desc { color: rgba($FUDMASTER-DARK, 0.7); line-height: 1.6; }
</style>
