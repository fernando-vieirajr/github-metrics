<script setup lang="ts">
import './TabNav.css'
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
