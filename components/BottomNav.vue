<template>
  <nav class="fixed bottom-0 left-0 right-0 bg-surface-dark/95 backdrop-blur-lg border-t border-surface-border z-50">
    <div class="max-w-2xl mx-auto flex justify-around items-center h-16">
      
      <button :class="getButtonClass('hub')" @click="emit('tabChange', 'hub')">
        <span :class="getIconClass('hub')">home</span>
        <span class="text-[10px] font-bold tracking-wider">HUB</span>
      </button>

      <button :class="getButtonClass('rank')" @click="emit('tabChange', 'rank')">
        <span :class="getIconClass('rank')">leaderboard</span>
        <span class="text-[10px] font-bold tracking-wider">RANK</span>
      </button>

      <button :class="getButtonClass('profile')" @click="emit('tabChange', 'profile')">
        <span :class="getIconClass('profile')">person</span>
        <span class="text-[10px] font-bold tracking-wider">PROFILE</span>
      </button>

    </div>
    <!-- iOS Home Indicator Spacer -->
    <div class="h-6 w-full bg-surface-dark/95"></div>
  </nav>
</template>

<script setup lang="ts">
export type Tab = 'hub' | 'rank' | 'profile';

interface Props {
  activeTab: Tab;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  tabChange: [tab: Tab]
}>();

const getButtonClass = (tab: Tab) => {
  const isActive = props.activeTab === tab;
  return `flex flex-col items-center justify-center w-full h-full transition-colors group ${
    isActive ? 'text-primary' : 'text-gray-500 hover:text-white'
  }`;
};

const getIconClass = (tab: Tab) => {
  const isActive = props.activeTab === tab;
  return `material-symbols-outlined mb-1 group-hover:scale-110 transition-transform ${isActive ? 'filled' : ''}`;
};
</script>
