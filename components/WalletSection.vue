<template>
  <div class="px-4 mb-8">
    <div class="bg-surface-dark border border-surface-border rounded-xl p-5 shadow-lg relative overflow-hidden group">
      <!-- Background Image -->
      <div class="absolute right-0 top-0 w-[30%] aspect-square pointer-events-none z-0">
        <img src="/binance@2x.png" alt="" class="w-full h-full object-contain opacity-50" />
      </div>
      <div class="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10 z-0"></div>
      <div class="relative z-10">
        <h2 class="text-xl font-bold mb-2 flex items-center gap-2 text-white">
        <span class="material-symbols-outlined text-primary">account_balance_wallet</span>
        LINK WALLET
      </h2>
        <p class="text-white text-sm mb-4">
          Submit your BSC address to qualify for TGE rewards and track your weight.
        </p>
      <form class="flex flex-col sm:flex-row gap-3" @submit.prevent="handleSubmit">
        <input
          class="flex-1 bg-background-dark border border-surface-border rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm font-mono transition-all"
          :class="{ 'opacity-60': isSaved && !isEditing }"
          placeholder="0x..."
          type="text"
          v-model="address"
          :disabled="isSaved && !isEditing"
        />
        <button
          v-if="!isSaved || isEditing"
          class="bg-primary hover:bg-primary-dim text-black font-bold px-6 py-3 rounded-lg shadow-neon hover:shadow-neon-strong transition-all flex items-center justify-center gap-2 uppercase tracking-wide text-sm cursor-pointer"
          type="submit"
          :disabled="!address.trim()"
        >
          <span>{{ isEditing ? 'Save' : 'Save' }}</span>
          <span class="material-symbols-outlined text-[18px]">{{ isEditing ? 'check' : 'save' }}</span>
        </button>
        <button
          v-else
          class="bg-surface-border hover:bg-surface-border/80 text-white font-bold px-6 py-3 rounded-lg transition-all flex items-center justify-center gap-2 uppercase tracking-wide text-sm cursor-pointer border border-white/10"
          type="button"
          @click="handleEdit"
        >
          <span>Edit</span>
          <span class="material-symbols-outlined text-[18px]">edit</span>
        </button>
      </form>
      
        <!-- Success Message -->
        <div v-if="isSaved && !isEditing" class="mt-3 text-xs text-green-400 flex items-center gap-1">
          <span class="material-symbols-outlined text-[14px]">check_circle</span>
          <span>Address saved successfully</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const address = ref('');
const isSaved = ref(false);
const isEditing = ref(false);

const handleSubmit = () => {
  if (!address.value.trim()) return;
  
  console.log("Save wallet address:", address.value);
  isSaved.value = true;
  isEditing.value = false;
};

const handleEdit = () => {
  isEditing.value = true;
};
</script>
