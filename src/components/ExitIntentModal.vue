<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  open: { type: Boolean, required: true },
  title: { type: String, required: false },
  message: { type: String, required: true }
})

const emit = defineEmits(['close', 'stay', 'leave'])

const resolvedTitle = computed(() => props.title || '¡Espera! 🛑')

function close() { emit('close') }
function stay() { emit('stay') }
function leave() { emit('leave') }
</script>

<template>
  <Transition name="exit-fade">
    <div v-if="props.open" class="exit-modal-overlay" @click.self="close">
      <div class="exit-modal" role="dialog" aria-modal="true" aria-labelledby="exit-title">
        <div class="exit-icon"><i class="fa-solid fa-triangle-exclamation" /></div>
        <h3 id="exit-title" class="exit-title">{{ resolvedTitle }}</h3>
        <p class="exit-message">{{ props.message }}</p>
        <div class="exit-actions">
          <button type="button" class="exit-primary" @click="stay">Mantener mi descuento y Continuar</button>
          <button type="button" class="exit-secondary" @click="leave">Entiendo, prefiero arriesgarme a pagar $349 más tarde</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
.exit-modal-overlay { position: fixed; inset: 0; z-index: 2000; background: rgba($FUDMASTER-DARK, 0.5); display: grid; place-items: center; padding: 16px; }
.exit-modal { background: $white; border: 1px solid rgba($FUDMASTER-DARK, 0.12); border-radius: 12px; width: min(520px, 92vw); padding: 16px; display: grid; gap: 12px; color: $FUDMASTER-DARK; box-shadow: 0 12px 40px rgba(0,0,0,0.25); }
.exit-icon { color: $FUDMASTER-GREEN; font-size: 20px; }
.exit-title { margin: 0; font-size: 18px; color: $FUDMASTER-DARK; }
.exit-message { margin: 0; font-size: 14px; color: rgba($FUDMASTER-DARK, 0.8); }
.exit-actions { display: grid; gap: 8px; }
.exit-primary { background: $FUDMASTER-GREEN; color: $white; border: none; border-radius: 10px; padding: 10px 14px; font-weight: 700; cursor: pointer; }
.exit-secondary { background: transparent; color: rgba($FUDMASTER-DARK, 0.6); border: none; padding: 0; text-decoration: underline; font-size: 12px; cursor: pointer; justify-self: start; }
.exit-fade-enter-active, .exit-fade-leave-active { transition: opacity 0.2s ease; }
.exit-fade-enter-from, .exit-fade-leave-to { opacity: 0; }
</style>

