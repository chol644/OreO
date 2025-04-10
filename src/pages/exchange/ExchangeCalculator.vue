<template>
  <div
    class="p-6 mx-auto bg-white rounded shadow-md space-y-4 text-center"
    style="max-width: 600px"
  >
    <h2 class="text-xl font-bold">환율 계산기</h2>
    <p
      class="text-muted mt-3 fw-bold"
      style="margin-top: -8px; font-size: 0.95rem"
    >
      {{ directionText }}
    </p>
    <div class="d-flex justify-content-center align-items-center gap-4 mt-3">
      <!-- 왼쪽 -->
      <div style="width: 220px">
        <label class="form-label">
          {{ isReversed ? '기준 통화' : 'KRW' }}
        </label>
        <template v-if="isReversed">
          <ExchangeDropdown
            v-model="targetCurrency"
            :currencyList="currencyList"
            style="width: 100%; height: 38px; font-size: 1rem"
          />
        </template>
        <template v-else>
          <input
            v-model.number="amount"
            type="number"
            class="form-control"
            style="height: 38px; font-size: 1rem"
          />
        </template>
      </div>

      <!-- 아이콘 -->
      <div class="d-flex align-items-center" style="height: 58px">
        <i
          class="bi bi-arrow-left-right fs-4 text-dark cursor-pointer"
          @click="swapCurrency"
          title="기준 통화 전환"
        ></i>
      </div>

      <!-- 오른쪽 -->
      <div style="width: 220px">
        <label class="form-label">
          {{ isReversed ? targetCurrency.toUpperCase() : '환전 통화' }}
        </label>
        <template v-if="isReversed">
          <input
            v-model.number="amount"
            type="number"
            class="form-control"
            style="height: 38px; font-size: 1rem"
          />
        </template>
        <template v-else>
          <ExchangeDropdown
            v-model="targetCurrency"
            :currencyList="currencyList"
            style="width: 100%; height: 38px; font-size: 1rem"
          />
        </template>
      </div>
    </div>

    <!-- 결과 출력 -->
    <div v-if="exchangeRate" class="text-lg fw-bold text-success mt-3">
      {{
        isReversed
          ? ` ${amount.toLocaleString()} ${targetCurrency.toUpperCase()} = ${convertedAmount} KRW`
          : `${amount.toLocaleString()} KRW = ${convertedAmount} ${targetCurrency.toUpperCase()}`
      }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import ExchangeDropdown from '@/components/exchange/ExchangeDropdown.vue';

const amount = ref(1000);
const isReversed = ref(false);
const baseCurrency = ref('krw');
const targetCurrency = ref('vnd');
const exchangeRates = ref({});

const currencyList = [
  { code: 'usd', flag: 'emoji_u1f1fa_1f1f8.svg', name: 'USD' },
  { code: 'eur', flag: 'emoji_u1f1ea_1f1fa.svg', name: 'EUR' },
  { code: 'jpy', flag: 'emoji_u1f1ef_1f1f5.svg', name: 'JPY' },
  { code: 'cny', flag: 'emoji_u1f1e8_1f1f3.svg', name: 'CNY' },
  { code: 'hkd', flag: 'emoji_u1f1ed_1f1f0.svg', name: 'HKD' },
  { code: 'sgd', flag: 'emoji_u1f1f8_1f1ec.svg', name: 'SGD' },
  { code: 'aud', flag: 'emoji_u1f1e6_1f1fa.svg', name: 'AUD' },
  { code: 'cad', flag: 'emoji_u1f1e8_1f1e6.svg', name: 'CAD' },
  { code: 'gbp', flag: 'emoji_u1f1ec_1f1e7.svg', name: 'GBP' },
  { code: 'twd', flag: 'emoji_u1f1f9_1f1fc.svg', name: 'TWD' },
  { code: 'thb', flag: 'emoji_u1f1f9_1f1ed.svg', name: 'THB' },
  { code: 'php', flag: 'emoji_u1f1f5_1f1ed.svg', name: 'PHP' },
  { code: 'vnd', flag: 'emoji_u1f1fb_1f1f3.svg', name: 'VND' },
];

const fetchRates = async () => {
  const res = await axios.get(
    'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/krw.json'
  );
  exchangeRates.value = res.data.krw;
};
onMounted(fetchRates);

const exchangeRate = computed(() => {
  if (!targetCurrency.value) return null;
  const rate = exchangeRates.value[targetCurrency.value];
  if (!rate) return null;

  return isReversed.value ? 1 / rate : rate;
});

const convertedAmount = computed(() => {
  if (!exchangeRate.value) return '...';
  return (amount.value * exchangeRate.value).toLocaleString(undefined, {
    maximumFractionDigits: 2,
  });
});

const directionText = computed(() => {
  const from = isReversed.value ? targetCurrency.value.toUpperCase() : 'KRW';
  const to = isReversed.value ? 'KRW' : targetCurrency.value.toUpperCase();
  return `${from} → ${to} 변환`;
});

const swapCurrency = () => {
  isReversed.value = !isReversed.value;
};
</script>

<style scoped>
label {
  display: block;
  margin-bottom: 4px;
  font-weight: 500;
}

.cursor-pointer {
  cursor: pointer;
}

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
