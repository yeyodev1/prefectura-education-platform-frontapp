<script setup lang="ts">
import { useHead } from '@unhead/vue';
import Hero from './components/Hero.vue';
import Problem from './components/Problem.vue';
import SocialProof from './components/SocialProof.vue';
import Solution from './components/Solution.vue';
import TheGuarantee from './components/TheGuarantee.vue';
import UrgentBar from './components/UrgentBar.vue';
import FinalOffer from './components/FinalOffer.vue';
import TheRoadmap from './components/TheRoadmap.vue';
import TheOpportunity from './components/TheOpportunity.vue';
import GiantCountdown from './components/GiantCountdown.vue';

useHead({
  title: 'Cambia tu vida gastronómica con Nicole y su equipo',
  meta: [
    { name: 'description', content: 'Únete a Nicole y transforma tu pasión por la cocina en maestría técnica. Descubre el camino hacia la excelencia gastronómica.' },
    { property: 'og:title', content: 'Transforma tu cocina con Nicole | Fudmaster' },
    { property: 'og:description', content: 'Aprende las mejores técnicas y secretos culinarios con Nicole y su equipo de expertos.' }
  ]
})
</script>

<template>
  <div class="wrapper">
    <UrgentBar />
    <GiantCountdown />
    <Hero />
    <TheOpportunity />
    <Problem />
    <Solution />
    <TheRoadmap />
    <FinalOffer />
    <SocialProof />
    <TheGuarantee />
  </div>
</template>

<style lang="scss" scoped>
  .wrapper {
    width: 100%;
  }
</style>
