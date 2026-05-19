<script setup lang="ts">
const props = defineProps<{ tabs: string[]; modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <div class="tab-nav">
    <button
      v-for="tab in props.tabs"
      :key="tab"
      class="tab-nav__item"
      :class="{ 'tab-nav__item--active': tab === modelValue }"
      type="button"
      @click="emit('update:modelValue', tab)"
    >
      {{ tab }}
    </button>
  </div>
</template>

<style scoped>
.tab-nav {
  display: flex;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 16px;
}
.tab-nav__item {
  padding: 10px 16px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
  margin-bottom: -1px;
}
.tab-nav__item:hover { color: #111827; }
.tab-nav__item--active {
  color: #111827;
  font-weight: 700;
  border-bottom-color: #111827;
}
</style>
