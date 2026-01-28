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
        
        <!-- Metal Accelerator: Two buttons or single countdown button -->
        <div v-if="type === 'metal'" class="flex gap-2 flex-1">
          <!-- Show two buttons when not processing and not in cooldown -->
          <template v-if="!isProcessing && !localCooldown">
            <button 
              :disabled="!isAvailable || isLocked || isClaimed"
              :class="[
                'text-sm font-bold py-2 px-3 rounded flex-1 flex items-center justify-center gap-0',
                (isAvailable && !isLocked && !isClaimed)
                  ? 'bg-white hover:bg-gray-200 text-black shadow-lg transition-colors clip-path-tech' 
                  : 'bg-surface-border text-white cursor-not-allowed border border-white/5'
              ]"
              @click="handleMetalClaim(1.00, '100')"
            >
              <span class="flex items-center gap-0">
                CLAIM 100
                <img v-if="isAvailable && !isClaimed" src="/stars.png" alt="" class="h-4 w-auto object-contain ml-0" />
              </span>
            </button>
            <button 
              :disabled="!isAvailable || isLocked || isClaimed"
              :class="[
                'text-sm font-bold py-2 px-3 rounded flex-1 flex items-center justify-center gap-0',
                (isAvailable && !isLocked && !isClaimed)
                  ? 'bg-white hover:bg-gray-200 text-black shadow-lg transition-colors clip-path-tech' 
                  : 'bg-surface-border text-white cursor-not-allowed border border-white/5'
              ]"
              @click="handleMetalClaim(0.01, '1')"
            >
              <span class="flex items-center gap-0">
                CLAIM 1
                <img v-if="isAvailable && !isClaimed" src="/toncoin.png" alt="" class="h-4 w-auto object-contain ml-0" />
              </span>
            </button>
          </template>
          
          <!-- Show processing spinner -->
          <button 
            v-else-if="isProcessing"
            disabled
            class="text-sm font-bold py-2 px-4 rounded flex-1 flex items-center justify-center bg-surface-border text-white cursor-not-allowed border border-white/5"
          >
            <span class="material-symbols-outlined animate-spin text-[16px]">sync</span>
            <span class="ml-2">Processing...</span>
          </button>
          
          <!-- Show single countdown button after payment success -->
          <button 
            v-else
            disabled
            :class="[
              'text-sm font-bold py-2 px-4 rounded flex-1 flex items-center justify-center font-mono',
              'bg-surface-border text-white cursor-not-allowed border border-white/5'
            ]"
          >
            <span class="material-symbols-outlined text-[16px]">timer</span>
            <span class="ml-2">{{ countdownText }}</span>
          </button>
        </div>
        
        <!-- Other Accelerators: Single button -->
        <button 
          v-else
          :disabled="localCooldown || !isAvailable || isLocked || isClaimed || isProcessing"
          :class="[
            'text-sm font-bold py-2 px-4 rounded flex-1 flex items-center justify-center gap-2',
            (isAvailable && !localCooldown && !isLocked && !isClaimed && !isProcessing)
              ? 'bg-white hover:bg-gray-200 text-black shadow-lg transition-colors clip-path-tech' 
              : 'bg-surface-border text-white cursor-not-allowed border border-white/5',
            (isCooldown || localCooldown) ? 'font-mono' : ''
          ]"
          @click="handleClaim"
        >
          <span v-if="isProcessing" class="material-symbols-outlined animate-spin text-[16px]">sync</span>
          <span v-else-if="localCooldown || (buttonIcon && (isLocked || !isAvailable))" class="material-symbols-outlined text-[16px]">{{ localCooldown ? 'timer' : buttonIcon }}</span>
          <span v-if="isProcessing">Processing...</span>
          <span v-else>{{ isClaimed && type === 'crystal' ? 'CLAIMED' : (localCooldown ? countdownText : buttonText) }}</span>
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

const props = defineProps<AcceleratorProps & {
  currentWeight?: number;
}>();
const emit = defineEmits<{
  weightIncrease: [boost: number]
}>();

const localCooldown = ref(false);
const countdownSeconds = ref(0);
let countdownInterval: number | null = null;

// Metal Accelerator payment processing state
const isProcessing = ref(false);
const metalClaimType = ref<'100' | '1' | null>(null);

// Load claim count from localStorage
const loadClaimCount = () => {
  const storageKey = `accelerator_count_${props.type}`;
  const saved = localStorage.getItem(storageKey);
  return saved ? parseInt(saved) : 0;
};
const claimCount = ref(loadClaimCount());

// Load claimed milestones for Crystal Accelerator
const loadClaimedMilestones = () => {
  if (props.type === 'crystal') {
    const storageKey = 'crystal_claimed_milestones';
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [];
  }
  return [];
};
const claimedMilestones = ref<number[]>(loadClaimedMilestones());

// Check if Crystal is claimed at current milestone
const currentMilestone = computed(() => {
  if (props.type === 'crystal' && props.currentWeight !== undefined && props.currentWeight >= 10) {
    return Math.floor(props.currentWeight / 10) * 10;
  }
  return 10; // Default to first milestone
});

const isClaimed = computed(() => {
  if (props.type === 'crystal') {
    return claimedMilestones.value.includes(currentMilestone.value);
  }
  return false;
});

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

// Handle Metal Accelerator claim with payment processing
const handleMetalClaim = async (boost: number, claimType: '100' | '1') => {
  if (!isAvailable.value || isProcessing.value) return;
  
  isProcessing.value = true;
  metalClaimType.value = claimType;
  
  // Simulate payment processing (2 seconds)
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Payment success - proceed with claim
  isProcessing.value = false;
  
  // Increase claim count
  claimCount.value++;
  const storageKey = `accelerator_count_${props.type}`;
  localStorage.setItem(storageKey, String(claimCount.value));
  
  // Emit weight increase (ensure boost is a valid number)
  const validBoost = isNaN(boost) ? 0 : boost;
  emit('weightIncrease', validBoost);
  
  // Start cooldown
  localCooldown.value = true;
  const duration = getCooldownDuration();
  countdownSeconds.value = duration;
  
  // Save to localStorage (only for long cooldowns)
  if (duration >= 60) {
    const cooldownKey = `accelerator_cooldown_${props.type}`;
    const endTime = Date.now() + countdownSeconds.value * 1000;
    localStorage.setItem(cooldownKey, String(endTime));
  }
  
  // Start countdown
  countdownInterval = setInterval(() => {
    if (countdownSeconds.value > 0) {
      countdownSeconds.value--;
      // Update localStorage for long cooldowns
      if (duration >= 60) {
        const cooldownKey = `accelerator_cooldown_${props.type}`;
        localStorage.setItem(cooldownKey, String(Date.now() + countdownSeconds.value * 1000));
      }
    } else {
      localCooldown.value = false;
      metalClaimType.value = null;
      if (duration >= 60) {
        const cooldownKey = `accelerator_cooldown_${props.type}`;
        localStorage.removeItem(cooldownKey);
      }
      if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
      }
    }
  }, 1000);
};

const handleClaim = async (customBoost?: number) => {
  if (!isAvailable.value || props.type === 'metal' || isProcessing.value) return;
  
  // Start processing
  isProcessing.value = true;
  
  // Simulate payment processing (2 seconds)
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Payment success - proceed with claim
  isProcessing.value = false;
  
  // For Crystal Accelerator, mark current milestone as claimed
  if (props.type === 'crystal' && props.currentWeight !== undefined) {
    const milestone = Math.floor(props.currentWeight / 10) * 10;
    if (!claimedMilestones.value.includes(milestone)) {
      claimedMilestones.value.push(milestone);
      localStorage.setItem('crystal_claimed_milestones', JSON.stringify(claimedMilestones.value));
    }
  }
  
  // Increase claim count
  claimCount.value++;
  const storageKey = `accelerator_count_${props.type}`;
  localStorage.setItem(storageKey, String(claimCount.value));
  
  // Use custom boost value if provided, otherwise extract from boost string
  let boostValue: number;
  if (customBoost !== undefined) {
    boostValue = isNaN(customBoost) ? 0 : customBoost;
  } else {
    const parsed = parseFloat(props.boost.replace(/[+%]/g, ''));
    boostValue = isNaN(parsed) ? 0 : parsed;
  }
  emit('weightIncrease', boostValue);
  
  // Only start cooldown if not Crystal (Crystal doesn't have cooldown after claim)
  if (props.type !== 'crystal') {
    localCooldown.value = true;
    const duration = getCooldownDuration();
    countdownSeconds.value = duration;
    
    // Save to localStorage (only for long cooldowns)
    if (duration >= 60) {
      const cooldownKey = `accelerator_cooldown_${props.type}`;
      const endTime = Date.now() + countdownSeconds.value * 1000;
      localStorage.setItem(cooldownKey, String(endTime));
    }
    
    // Start countdown
    countdownInterval = setInterval(() => {
      if (countdownSeconds.value > 0) {
        countdownSeconds.value--;
        // Update localStorage for long cooldowns
        if (duration >= 60) {
          const cooldownKey = `accelerator_cooldown_${props.type}`;
          localStorage.setItem(cooldownKey, String(Date.now() + countdownSeconds.value * 1000));
        }
      } else {
        localCooldown.value = false;
        if (duration >= 60) {
          const cooldownKey = `accelerator_cooldown_${props.type}`;
          localStorage.removeItem(cooldownKey);
        }
        if (countdownInterval) {
          clearInterval(countdownInterval);
          countdownInterval = null;
        }
      }
    }, 1000);
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
