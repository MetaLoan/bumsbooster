<template>
  <div class="px-4 mb-10">
    <div class="flex justify-between items-end mb-2">
      <h3 class="text-sm font-bold text-gray-300 uppercase tracking-wide">TGE Weight Progress</h3>
      <span class="text-2xl font-black text-primary drop-shadow-[0_0_5px_rgba(249,249,31,0.4)]">{{ weight.toFixed(2) }}%</span>
    </div>
    
    <!-- Progress Bar -->
    <div class="relative h-8 bg-surface-dark rounded-full overflow-hidden border border-surface-border mb-4">
      <div class="absolute top-0 left-0 h-full bg-primary shadow-[0_0_10px_rgba(249,249,31,0.5)] transition-all duration-500" :style="{ width: `${Math.min(100, weight)}%` }"></div>
      <!-- Markers -->
      <div class="absolute top-0 bottom-0 left-[10%] w-0.5 bg-black/20 z-10"></div>
      <div class="absolute top-0 bottom-0 left-[50%] w-0.5 bg-black/20 z-10"></div>
    </div>

    <!-- Next Milestone -->
    <div class="bg-gradient-to-r from-surface-dark to-background-dark border border-surface-border rounded-lg p-3 flex items-center gap-4">
      <div class="h-12 w-12 bg-surface-border rounded-md flex items-center justify-center shrink-0 border border-white/5 relative overflow-visible">
        <img src="/crystalavatar.png" alt="" class="absolute inset-0 w-full h-full object-cover" />
        <span v-if="weight >= 10" class="material-symbols-outlined relative z-10 text-primary">
          check_circle
        </span>
        <span v-else class="material-symbols-outlined absolute top-0 right-0 text-primary opacity-50 z-10 text-[16px] -mt-1 -mr-1">
          lock
        </span>
      </div>
      <div class="flex-1">
        <p class="text-xs text-primary font-bold uppercase mb-0.5">
          {{ weight >= 10 ? 'Milestone Reached: 10%' : 'Next Milestone: 10%' }}
        </p>
        <p class="text-sm text-white font-medium">Unlock Crystal Accelerator & Skin</p>
      </div>
      <button 
        :disabled="weight < 10 || skinClaimed"
        :class="[
          'text-xs font-bold px-3 py-1 rounded uppercase tracking-wide transition-all',
          (weight >= 10 && !skinClaimed)
            ? 'bg-primary hover:bg-primary-dim text-black shadow-neon cursor-pointer'
            : 'bg-black/30 text-gray-500 cursor-not-allowed'
        ]"
        @click="handleClaimSkin"
      >
        {{ skinClaimed ? 'CLAIMED' : 'CLAIM SKIN' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

defineProps<{
  weight: number;
}>();

const skinClaimed = ref(false);

onMounted(() => {
  const saved = localStorage.getItem('skin_claimed');
  skinClaimed.value = saved === 'true';
});

const handleClaimSkin = () => {
  skinClaimed.value = true;
  localStorage.setItem('skin_claimed', 'true');
};
</script>
