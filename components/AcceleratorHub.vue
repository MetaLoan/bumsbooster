<template>
  <div class="mb-20 overflow-hidden">
    <div class="px-4 flex items-center gap-2 mb-4">
      <span class="material-symbols-outlined text-primary">bolt</span>
      <h2 class="text-lg font-bold tracking-tight text-white uppercase">Accelerator Hub</h2>
    </div>
    
    <div class="flex flex-col gap-4 px-4 pb-4">
      <div v-for="(acc, index) in accelerators" :key="index" class="w-full">
        <AcceleratorCard 
          v-bind="acc" 
          :current-weight="weight"
          @weight-increase="handleWeightIncrease" 
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AcceleratorCard, { type AcceleratorProps } from './AcceleratorCard.vue';
import { computed } from 'vue';

const props = defineProps<{
  weight: number;
}>();

const emit = defineEmits<{
  weightIncrease: [boost: number]
}>();

const handleWeightIncrease = (boost: number) => {
  emit('weightIncrease', boost);
};

// Calculate current milestone (10% multiples)
const currentMilestone = computed(() => {
  return Math.floor(props.weight / 10) * 10;
});

// Check if Crystal Accelerator can be claimed at current milestone
// Crystal can be claimed at each 10% milestone
const crystalStatus = computed(() => {
  return props.weight >= 10 ? 'available' : 'locked';
});

const crystalButtonText = computed(() => {
  if (props.weight < 10) {
    return '10% WEIGHT BOOST TO UNLOCK';
  }
  // Check if already claimed at current milestone
  const claimedMilestones = JSON.parse(localStorage.getItem('crystal_claimed_milestones') || '[]');
  const alreadyClaimed = claimedMilestones.includes(currentMilestone.value);
  return alreadyClaimed ? 'CLAIMED' : 'FREE CLAIM';
});

const accelerators = computed<AcceleratorProps[]>(() => [
  {
    type: 'crystal',
    icon: 'diamond',
    title: 'Crystal Accelerator',
    description: 'Free claim. Unlock to qualify for first airdrop batch.',
    boost: '+5.00%',
    status: crystalStatus.value,
    buttonText: crystalButtonText.value,
    buttonIcon: props.weight < 10 ? 'lock' : undefined,
    currentWeight: props.weight
  },
  {
    type: 'stone',
    icon: 'landscape',
    title: 'Stone Accelerator',
    description: 'Basic daily boost for consistent players.',
    boost: '+0.05%',
    status: 'available',
    buttonText: 'FREE CLAIM'
  },
  {
    type: 'metal',
    icon: 'hardware',
    title: 'Metal Accelerator',
    description: 'Heavyweight boost.',
    boost: '+1.00%',
    status: 'available',
    buttonText: 'CLAIM 100'
  }
]);
</script>
