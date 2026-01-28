<template>
  <div class="px-4 mb-10">
    <div class="flex justify-between items-end mb-2">
      <h3 class="text-sm font-bold text-gray-300 uppercase tracking-wide">TGE Weight Progress</h3>
      <span class="text-2xl font-black text-primary drop-shadow-[0_0_5px_rgba(249,249,31,0.4)]">{{ (isNaN(weight) ? 0 : weight).toFixed(2) }}%</span>
    </div>
    
    <!-- Progress Bar -->
    <div class="relative h-8 bg-surface-dark rounded-full overflow-hidden border border-surface-border mb-4">
      <div class="absolute top-0 left-0 h-full bg-primary shadow-[0_0_10px_rgba(249,249,31,0.5)] transition-all duration-500" :style="{ width: `${Math.min(100, isNaN(weight) ? 0 : weight)}%` }"></div>
      <!-- Markers: 10% intervals -->
      <div v-for="i in 9" :key="i" class="absolute top-0 bottom-0 w-0.5 bg-black/20 z-10" :style="{ left: `${i * 10}%` }"></div>
    </div>

    <!-- Next Milestone -->
    <div class="bg-gradient-to-r from-surface-dark to-background-dark border border-surface-border rounded-lg p-3 flex items-center gap-4">
      <div class="h-12 w-12 bg-surface-border rounded-md flex items-center justify-center shrink-0 border border-white/5 relative overflow-visible">
        <img src="/crystalavatar.png" alt="" class="absolute inset-0 w-full h-full object-cover" />
        <span v-if="isMilestoneReached" class="material-symbols-outlined relative z-10 text-primary">
          check_circle
        </span>
        <span v-else class="material-symbols-outlined absolute top-0 right-0 text-primary opacity-50 z-10 text-[16px] -mt-1 -mr-1">
          lock
        </span>
      </div>
      <div class="flex-1">
        <p class="text-xs text-primary font-bold uppercase mb-0.5">
          {{ isMilestoneReached ? `Milestone Reached: ${nextMilestone}%` : `Next Milestone: ${nextMilestone}%` }}
        </p>
        <p class="text-sm text-white font-medium">{{ milestoneDescription }}</p>
      </div>
      <button 
        v-if="isFirstMilestone"
        :disabled="!isMilestoneReached || skinClaimed"
        :class="[
          'text-xs font-bold px-3 py-1 rounded uppercase tracking-wide transition-all',
          (isMilestoneReached && !skinClaimed)
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
import { ref, computed, onMounted } from 'vue';

const props = defineProps<{
  weight: number;
}>();

const skinClaimed = ref(false);

// Calculate next milestone (next 10% multiple)
const nextMilestone = computed(() => {
  const weight = isNaN(props.weight) ? 0 : props.weight;
  const current = Math.floor(weight / 10);
  return (current + 1) * 10;
});

// Check if current milestone is reached
const isMilestoneReached = computed(() => {
  const weight = isNaN(props.weight) ? 0 : props.weight;
  return weight >= nextMilestone.value;
});

// Check if this is the first milestone (10%)
const isFirstMilestone = computed(() => {
  return nextMilestone.value === 10;
});

// Description text based on milestone
const milestoneDescription = computed(() => {
  if (isFirstMilestone.value) {
    return 'Unlock Crystal Accelerator & Skin';
  }
  return 'Unlock Crystal Accelerator';
});

onMounted(() => {
  const saved = localStorage.getItem('skin_claimed');
  skinClaimed.value = saved === 'true';
});

const handleClaimSkin = () => {
  skinClaimed.value = true;
  localStorage.setItem('skin_claimed', 'true');
};
</script>
