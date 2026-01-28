<template>
  <nav class="sticky top-0 z-50 border-b border-surface-border bg-background-dark/80 backdrop-blur-md">
    <div class="flex items-center justify-between px-4 h-16 max-w-2xl mx-auto">
      <div class="flex items-center gap-2">
        <div class="h-8 w-8 bg-primary rounded flex items-center justify-center text-black">
          <span class="material-symbols-outlined">sports_esports</span>
        </div>
      </div>
      <div class="flex items-center gap-1">
        <span class="text-xs font-bold tracking-widest text-gray-400">STATUS:</span>
        <span class="text-xs font-bold text-green-400 animate-pulse">LIVE</span>
      </div>
      <button class="p-2 text-gray-400 hover:text-white transition-colors">
        <span class="material-symbols-outlined">help</span>
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
</script>
