<script setup lang="ts">
type Attachment = { id: string | number; name: string; kind: string; url?: string }

const props = defineProps<{ attachments: Attachment[] }>()

function sanitizeUrl(url?: string) {
  return (url || '').toString().replace(/`/g, '').trim()
}
</script>

<template>
  <div class="attachments">
    <h3 class="attachments-title"><i class="fa-solid fa-paperclip" /> Recursos</h3>
    <ul class="list">
      <li v-for="a in props.attachments" :key="a.id" class="item">
        <span class="name">{{ a.name }}</span>
        <span class="kind">{{ a.kind }}</span>
        <a v-if="a.url" :href="sanitizeUrl(a.url)" target="_blank" rel="noopener" class="link"><i class="fa-solid fa-link" /> Abrir</a>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.attachments { display: grid; gap: 8px; }
.attachments-title { color: $FUDMASTER-DARK; font-size: 18px; margin: 0; display: inline-flex; align-items: center; gap: 8px; }
.list { list-style: none; padding: 0; margin: 0; display: grid; gap: 8px; }
.item { display: grid; grid-template-columns: 1fr auto auto; align-items: center; gap: 8px; background: $FUDMASTER-LIGHT; border: 1px solid rgba($FUDMASTER-DARK, 0.08); border-radius: 10px; padding: 10px; }
.name { color: $FUDMASTER-DARK; font-weight: 600; }
.kind { color: rgba($FUDMASTER-DARK, 0.6); font-size: 12px; }
.link { color: $FUDMASTER-GREEN; text-decoration: none; }
</style>
