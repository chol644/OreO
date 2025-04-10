<!-- components/exchange/ExchangeDropdown.vue -->
<template>
  <div class="position-relative w-100">
    <div
      @click="toggleDropdown"
      class="form-select d-flex align-items-center justify-content-between"
      style="height: 38px; cursor: pointer"
    >
      <div class="d-flex align-items-center">
        <img
          :src="getFlagPath(selectedCurrency.flag)"
          alt="flag"
          class="me-2"
          style="
            width: 24px;
            height: 16px;
            object-fit: cover;
            border-radius: 2px;
          "
        />
        <span>{{ selectedCurrency.name }}</span>
      </div>
    </div>

    <ul
      v-if="isOpen"
      class="list-group position-absolute w-100 z-3 shadow"
      style="max-height: 200px; overflow-y: auto"
    >
      <li
        v-for="currency in currencyList"
        :key="currency.code"
        @click="selectCurrency(currency)"
        class="list-group-item list-group-item-action d-flex align-items-center"
      >
        <img
          :src="getFlagPath(currency.flag)"
          alt="flag"
          class="me-2"
          style="
            width: 24px;
            height: 16px;
            object-fit: cover;
            border-radius: 2px;
          "
        />
        {{ currency.name }}
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

const selectedCurrency = computed(() =>
  props.currencyList.find((c) => c.code === props.modelValue)
);

const getFlagPath = (filename) => {
  return new URL(`/src/assets/flags/${filename}`, import.meta.url).href;
};
</script>
