<template>
  <div class="relative w-full" style="position: relative">
    <!-- 선택창 -->
    <div
      @click="toggleDropdown"
      class="border p-2 rounded cursor-pointer d-flex align-items-center"
      style="width: 100%; height: 38px; font-size: 1rem"
    >
      <img
        :src="getFlagPath(selectedCurrency.flag)"
        alt="flag"
        style="width: 24px; height: 16px; object-fit: cover; border-radius: 2px"
      />
      <span class="ms-2">{{ selectedCurrency.name }}</span>
      <span class="ms-auto">▼</span>
    </div>

    <!-- 드롭다운 리스트 -->
    <ul
      v-if="isOpen"
      class="absolute mt-1 w-full bg-white border rounded shadow max-h-60 overflow-y-auto"
      style="z-index: 9999"
    >
      <li
        v-for="currency in currencyList"
        :key="currency.code"
        @click="selectCurrency(currency)"
        class="p-2 hover:bg-gray-100 d-flex align-items-center gap-2 cursor-pointer"
      >
        <img
          :src="getFlagPath(currency.flag)"
          alt="flag"
          style="
            width: 24px;
            height: 16px;
            object-fit: cover;
            border-radius: 2px;
          "
        />
        <span>{{ currency.name }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  modelValue: String,
  currencyList: Array,
});
const emit = defineEmits(['update:modelValue']);

const isOpen = ref(false);
const toggleDropdown = () => (isOpen.value = !isOpen.value);

const selectCurrency = (currency) => {
  emit('update:modelValue', currency.code);
  isOpen.value = false;
};

const selectedCurrency = computed(() => {
  return props.currencyList.find((c) => c.code === props.modelValue);
});

const getFlagPath = (filename) => {
  return new URL(`/src/assets/flags/${filename}`, import.meta.url).href;
};
</script>
