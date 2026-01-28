<template>
  <div :class="containerClasses">
    <!-- Decorative corner for crystal -->
    <div v-if="type === 'crystal'" class="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-primary/50 rounded-tr-sm m-2"></div>

    <div :class="['relative bg-background-dark rounded-lg p-4 h-full flex flex-col overflow-hidden', type === 'crystal' ? 'border border-primary/5' : '']">
      
      <!-- Crystal Background Image -->
      <div v-if="type === 'crystal'" class="absolute -right-[20%] -top-[10%] w-[90%] aspect-square pointer-events-none z-0">
        <img src="/crystal.png" alt="" class="w-full h-full object-contain" style="transform: rotate(15deg);" />
      </div>
      
      <!-- Metal Background Image -->
      <div v-if="type === 'metal'" class="absolute -right-[20%] -top-[10%] w-[90%] aspect-square pointer-events-none z-0">
        <img src="/silver.png" alt="" class="w-full h-full object-contain" style="transform: rotate(15deg);" />
      </div>
      
      <!-- Stone Background Image -->
      <div v-if="type === 'stone'" class="absolute -right-[20%] -top-[10%] w-[90%] aspect-square pointer-events-none z-0">
        <img src="/stone.png" alt="" class="w-full h-full object-contain" style="transform: rotate(15deg);" />
      </div>
      
      <!-- Header: Count & Status Badge -->
      <div class="flex justify-between items-start mb-4 relative z-10">
        <div :class="[isAvailable ? 'bg-surface-border/50' : 'bg-primary/10', 'p-2 rounded-lg border flex items-center justify-center min-w-[42px]', isAvailable ? 'border-white/5' : 'border-primary/20']">
          <span :class="['text-2xl font-bold', isAvailable ? (type === 'metal' ? 'text-gray-300' : 'text-gray-400') : 'text-primary']">
            {{ claimCount }}
          </span>
        </div>

        <!-- Badge -->
        <span v-if="isLocked" class="bg-surface-border text-gray-400 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider border border-white/10 flex items-center gap-1">
          <span class="material-symbols-outlined text-[12px]">lock</span> LOCKED
        </span>
        <span v-if="isAvailable && !localCooldown" class="bg-green-500 text-green-50 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider border border-green-400">
          Available
        </span>
        <span v-if="isCooldown || localCooldown" class="bg-surface-border text-gray-400 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider border border-white/10">
          Cooldown
        </span>
      </div>

      <!-- Content -->
      <div class="mb-6 relative z-10">
        <h3 class="text-lg font-bold text-white mb-1">{{ title }}</h3>
        <p :class="['text-xs px-2 py-1 rounded inline-block', type === 'crystal' ? 'rainbow-text-wrapper' : 'text-white bg-white/[0.03]']">
          <span :class="type === 'crystal' ? 'rainbow-text' : ''">{{ description }}</span>
        </p>
      </div>

      <!-- Footer: Boost & Action -->
      <div class="mt-auto flex items-center justify-between gap-3 relative z-10">
        <div class="text-primary font-mono text-sm font-bold bg-primary/10 px-2 py-1 rounded border border-primary/20">
          {{ boost }}
        </div>
        
        <button 
          :disabled="localCooldown || !isAvailable || isLocked || isClaimed"
          :class="[
            'text-sm font-bold py-2 px-4 rounded flex-1 flex items-center justify-center',
            (isAvailable && !localCooldown && !isLocked && !isClaimed)
              ? 'bg-white hover:bg-gray-200 text-black shadow-lg transition-colors clip-path-tech' 
              : 'bg-surface-border text-white cursor-not-allowed border border-white/5',
            (isCooldown || localCooldown) ? 'font-mono' : '',
            type === 'metal' && !localCooldown && isAvailable && !isClaimed ? 'gap-0' : 'gap-2'
          ]"
          @click="handleClaim"
        >
          <span v-if="localCooldown || (buttonIcon && (isLocked || !isAvailable))" class="material-symbols-outlined text-[16px]">{{ localCooldown ? 'timer' : buttonIcon }}</span>
          <span class="flex items-center gap-0">
            {{ isClaimed && type === 'crystal' ? 'CLAIMED' : (localCooldown ? countdownText : buttonText) }}
            <img v-if="type === 'metal' && !localCooldown && isAvailable && !isClaimed" src="/stars.png" alt="" class="h-4 w-auto object-contain ml-0" />
          </span>
        </button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';

export interface AcceleratorProps {
  type: 'crystal' | 'stone' | 'metal';
  icon: string;
  title: string;
  description: string;
  boost: string;
  status: 'locked' | 'available' | 'cooldown';
  buttonText: string;
  buttonIcon?: string;
}

const props = defineProps<AcceleratorProps>();
const emit = defineEmits<{
  weightIncrease: [boost: number]
}>();

const localCooldown = ref(false);
const countdownSeconds = ref(0);
let countdownInterval: number | null = null;

// Load claim count from localStorage
const loadClaimCount = () => {
  const storageKey = `accelerator_count_${props.type}`;
  const saved = localStorage.getItem(storageKey);
  return saved ? parseInt(saved) : 0;
};
const claimCount = ref(loadClaimCount());

// Load claimed status for Crystal Accelerator
const loadClaimedStatus = () => {
  if (props.type === 'crystal') {
    const storageKey = `accelerator_claimed_crystal`;
    return localStorage.getItem(storageKey) === 'true';
  }
  return false;
};
const isClaimed = ref(loadClaimedStatus());

// Get cooldown duration based on accelerator type
const getCooldownDuration = () => {
  switch (props.type) {
    case 'stone':
      return 5; // 5 seconds
    case 'metal':
      return 3; // 3 seconds
    case 'crystal':
      return 24 * 60 * 60; // 24 hours
    default:
      return 24 * 60 * 60;
  }
};

const isLocked = computed(() => props.status === 'locked');
const isCooldown = computed(() => props.status === 'cooldown' || localCooldown.value);
const isAvailable = computed(() => props.status === 'available' && !localCooldown.value && !isClaimed.value);

const countdownText = computed(() => {
  const duration = getCooldownDuration();
  // For short cooldowns (less than 1 hour), show MM:SS format
  if (duration < 3600) {
    const minutes = Math.floor(countdownSeconds.value / 60);
    const seconds = countdownSeconds.value % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
  // For long cooldowns, show HH:MM:SS format
  const hours = Math.floor(countdownSeconds.value / 3600);
  const minutes = Math.floor((countdownSeconds.value % 3600) / 60);
  const seconds = countdownSeconds.value % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
});

const handleClaim = () => {
  if (isAvailable.value) {
    // For Crystal Accelerator, mark as claimed
    if (props.type === 'crystal') {
      isClaimed.value = true;
      localStorage.setItem('accelerator_claimed_crystal', 'true');
    }
    
    // Increase claim count
    claimCount.value++;
    const storageKey = `accelerator_count_${props.type}`;
    localStorage.setItem(storageKey, String(claimCount.value));
    
    // Extract boost value from boost string (e.g., "+5.00%" -> 5.00)
    const boostValue = parseFloat(props.boost.replace(/[+%]/g, ''));
    emit('weightIncrease', boostValue);
    
    // Only start cooldown if not Crystal (Crystal doesn't have cooldown after claim)
    if (props.type !== 'crystal') {
      localCooldown.value = true;
      const duration = getCooldownDuration();
      countdownSeconds.value = duration;
      
      // Save to localStorage (only for long cooldowns)
      if (duration >= 60) {
        const storageKey = `accelerator_cooldown_${props.type}`;
        const endTime = Date.now() + countdownSeconds.value * 1000;
        localStorage.setItem(storageKey, String(endTime));
      }
      
      // Start countdown
      countdownInterval = setInterval(() => {
        if (countdownSeconds.value > 0) {
          countdownSeconds.value--;
          // Update localStorage for long cooldowns
          if (duration >= 60) {
            const storageKey = `accelerator_cooldown_${props.type}`;
            localStorage.setItem(storageKey, String(Date.now() + countdownSeconds.value * 1000));
          }
        } else {
          localCooldown.value = false;
          if (duration >= 60) {
            const storageKey = `accelerator_cooldown_${props.type}`;
            localStorage.removeItem(storageKey);
          }
          if (countdownInterval) {
            clearInterval(countdownInterval);
            countdownInterval = null;
          }
        }
      }, 1000);
    }
  }
};

onMounted(() => {
  // Check if there's a saved cooldown end time in localStorage (only for long cooldowns)
  const duration = getCooldownDuration();
  if (duration >= 60) {
    const storageKey = `accelerator_cooldown_${props.type}`;
    const savedEndTime = localStorage.getItem(storageKey);
    
    if (savedEndTime) {
      const endTime = parseInt(savedEndTime);
      const now = Date.now();
      const remaining = Math.floor((endTime - now) / 1000);
      
      if (remaining > 0) {
        localCooldown.value = true;
        countdownSeconds.value = remaining;
        
        countdownInterval = setInterval(() => {
          if (countdownSeconds.value > 0) {
            countdownSeconds.value--;
            localStorage.setItem(storageKey, String(Date.now() + countdownSeconds.value * 1000));
          } else {
            localCooldown.value = false;
            localStorage.removeItem(storageKey);
            if (countdownInterval) {
              clearInterval(countdownInterval);
              countdownInterval = null;
            }
          }
        }, 1000);
      } else {
        localStorage.removeItem(storageKey);
      }
    }
  }
});

onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }
});

const containerClasses = computed(() => 
  `bg-surface-dark border rounded-xl p-1 shadow-lg relative group h-full ${
    isAvailable.value ? 'border-surface-border hover:border-primary/30 transition-colors' : 'border-primary/20'
  }`
);
</script>
