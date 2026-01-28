<template>
  <div>
    <div class="scanlines fixed h-full w-full pointer-events-none z-0"></div>

    <main class="max-w-2xl mx-auto relative z-20 pb-20">
      <div class="relative overflow-hidden pt-8 pb-6 px-4">
        <div class="relative z-10 text-center flex flex-col items-center">
          <h1 class="text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)]">
            BUMS<br />
            <span class="text-primary drop-shadow-[0_0_8px_rgba(249,249,31,0.6)]">ALPHA TIME</span>
          </h1>
          <p class="mt-2 text-sm text-white uppercase tracking-[0.2em] border border-surface-border px-3 py-1 rounded-full bg-surface-dark/50 backdrop-blur">
            Boost Your TGE Allocation with Accelerators!
          </p>
          <div v-if="activeTab === 'hub'" class="mt-4 px-4 w-full max-w-md">
            <button class="w-full bg-primary hover:bg-primary-dim text-black font-bold px-6 py-4 rounded-lg shadow-neon hover:shadow-neon-strong transition-all flex items-center justify-center gap-2 uppercase tracking-wide text-sm">
              <span>CHECK MY BUMS MEDALS</span>
              <img src="/jackpot.png" alt="" class="h-4 w-auto object-contain" />
              <img src="/icebums.png" alt="" class="h-4 w-auto object-contain" />
              <img src="/goldbums.png" alt="" class="h-4 w-auto object-contain" />
            </button>
          </div>
        </div>
      </div>

      <!-- Hub Content -->
      <div v-if="activeTab === 'hub'">
        <WalletSection />
        <ProgressSection :weight="currentWeight" />
        <AcceleratorHub :weight="currentWeight" @weight-increase="handleWeightIncrease" />
      </div>

      <!-- Rank Content -->
      <div v-else-if="activeTab === 'rank'" class="px-4 py-20 flex flex-col items-center justify-center text-center text-gray-400">
        <span class="material-symbols-outlined text-6xl mb-4 opacity-50">leaderboard</span>
        <h2 class="text-xl font-bold text-white mb-2">Leaderboard</h2>
        <p>Rankings coming soon to Season 1.</p>
      </div>

      <!-- Profile Content -->
      <div v-else-if="activeTab === 'profile'" class="px-4 py-20 flex flex-col items-center justify-center text-center text-gray-400">
        <span class="material-symbols-outlined text-6xl mb-4 opacity-50">person</span>
        <h2 class="text-xl font-bold text-white mb-2">Player Profile</h2>
        <p>Connect wallet to view stats.</p>
      </div>
    </main>

    <BottomNav :activeTab="activeTab" @tabChange="setActiveTab" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import WalletSection from './components/WalletSection.vue';
import ProgressSection from './components/ProgressSection.vue';
import AcceleratorHub from './components/AcceleratorHub.vue';
import BottomNav from './components/BottomNav.vue';

type Tab = 'hub' | 'rank' | 'profile';

const activeTab = ref<Tab>('hub');

// Load weight from localStorage or use default
const loadWeight = () => {
  const saved = localStorage.getItem('tge_weight');
  return saved !== null ? parseFloat(saved) : 0;
};
const currentWeight = ref(loadWeight());

const setActiveTab = (tab: Tab) => {
  activeTab.value = tab;
};

const handleWeightIncrease = (boost: number) => {
  currentWeight.value = Math.min(100, currentWeight.value + boost);
  localStorage.setItem('tge_weight', String(currentWeight.value));
};

const resetClaimState = () => {
  // Reset weight to 0
  currentWeight.value = 0;
  localStorage.setItem('tge_weight', '0');
  
  // Clear all accelerator counts
  localStorage.removeItem('accelerator_count_crystal');
  localStorage.removeItem('accelerator_count_stone');
  localStorage.removeItem('accelerator_count_metal');
  
  // Clear all accelerator cooldowns
  localStorage.removeItem('accelerator_cooldown_crystal');
  localStorage.removeItem('accelerator_cooldown_stone');
  localStorage.removeItem('accelerator_cooldown_metal');
  
  // Reload page to reset all states
  window.location.reload();
};
</script>
