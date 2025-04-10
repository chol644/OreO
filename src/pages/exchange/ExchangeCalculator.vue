<template>
  <div class="p-6 max-w-xl mx-auto bg-white rounded shadow-md space-y-4">
    <h2 class="text-xl font-bold">실시간 환율 계산기</h2>

    <div class="grid grid-cols-2 gap-4 items-center">
      <!-- 원화 입력 -->
      <div>
        <label>금액 (KRW)</label>
        <input
          v-model.number="amountKRW"
          type="number"
          class="border p-2 w-full rounded"
        />
      </div>

      <!-- 환전 통화 선택 -->
      <div>
        <label>환전 통화</label>
        <select v-model="targetCurrency" class="border p-2 w-full rounded">
          <option
            v-for="currency in currencyList"
            :key="currency.code"
            :value="currency.code"
          >
            {{ currency.emoji }} {{ currency.name }}
          </option>
        </select>
      </div>
    </div>

    <!-- 결과 출력 -->
    <div
      v-if="exchangeRate"
      class="text-lg text-center font-semibold text-green-600"
    >
      ₩{{ amountKRW.toLocaleString() }} = {{ convertedAmount }}
      {{ targetCurrency.toUpperCase() }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import axios from 'axios';

const amountKRW = ref(1000);
const targetCurrency = ref('vnd');
const exchangeRates = ref({});
const currencyList = [
  { code: 'usd', emoji: '🇺🇸', name: 'USD' },
  { code: 'eur', emoji: '🇪🇺', name: 'EUR' },
  { code: 'jpy', emoji: '🇯🇵', name: 'JPY' },
  { code: 'cny', emoji: '🇨🇳', name: 'CNY' },
  { code: 'hkd', emoji: '🇭🇰', name: 'HKD' },
  { code: 'sgd', emoji: '🇸🇬', name: 'SGD' },
  { code: 'aud', emoji: '🇦🇺', name: 'AUD' },
  { code: 'cad', emoji: '🇨🇦', name: 'CAD' },
  { code: 'gbp', emoji: '🇬🇧', name: 'GBP' },
  { code: 'twd', emoji: '🇹🇼', name: 'TWD' },
  { code: 'thb', emoji: '🇹🇭', name: 'THB' },
  { code: 'php', emoji: '🇵🇭', name: 'PHP' },
  { code: 'vnd', emoji: '🇻🇳', name: 'VND' },
];

const fetchRates = async () => {
  const res = await axios.get(
    'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/krw.json'
  );
  exchangeRates.value = res.data.krw;
};
onMounted(fetchRates);

const exchangeRate = computed(
  () => exchangeRates.value[targetCurrency.value] ?? null
);

const convertedAmount = computed(() => {
  if (!exchangeRate.value) return '...';
  return (amountKRW.value * exchangeRate.value).toLocaleString(undefined, {
    maximumFractionDigits: 2,
  });
});
</script>

<style scoped>
label {
  display: block;
  margin-bottom: 4px;
  font-weight: 500;
}
</style>

<style scoped>
/* 스핀 버튼 제거 */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type='number'] {
  -moz-appearance: textfield;
}
</style>
