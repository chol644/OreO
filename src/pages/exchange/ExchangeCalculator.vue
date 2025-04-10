<template>
  <div class="card shadow-lg p-4 mx-auto mt-5" style="max-width: 600px">
    <h4 class="text-center fw-bold mb-1">환율 계산기</h4>
    <p class="text-center text-muted mb-4">{{ directionText }}</p>

    <div class="row g-3 align-items-end justify-content-center">
      <!-- 왼쪽 -->
      <div class="col-5">
        <label class="form-label">
          {{ isReversed ? '기준 통화' : 'KRW' }}
        </label>
        <div v-if="isReversed">
          <ExchangeDropdown
            v-model="targetCurrency"
            :currencyList="currencyList"
            class="form-select"
          />
        </div>
        <div v-else>
          <input
            v-model.number="amount"
            type="number"
            class="form-control"
            placeholder="금액 입력"
          />
        </div>
      </div>

      <!-- 전환 아이콘 -->
      <div class="col-auto">
        <button
          class="btn btn-outline-secondary btn-sm rounded-circle border-0 swap-btn"
          @click="swapCurrency"
          title="기준 통화 전환"
        >
          <i class="bi bi-arrow-left-right fs-4"></i>
        </button>
      </div>

      <!-- 오른쪽 -->
      <div class="col-5">
        <label class="form-label">
          {{ isReversed ? targetCurrency.toUpperCase() : '환전 통화' }}
        </label>
        <div v-if="isReversed">
          <input
            v-model.number="amount"
            type="number"
            class="form-control"
            placeholder="금액 입력"
          />
        </div>
        <ExchangeDropdown
          v-model="targetCurrency"
          :currencyList="currencyList"
        />
      </div>
    </div>

    <!-- 결과 -->
    <div v-if="exchangeRate" class="mt-4 text-center">
      <div class="alert alert-success fw-bold mb-0" style="font-size: 1.1rem">
        {{
          isReversed
            ? `${amount.toLocaleString()} ${targetCurrency.toUpperCase()} = ${convertedAmount} KRW`
            : `${amount.toLocaleString()} KRW = ${convertedAmount} ${targetCurrency.toUpperCase()}`
        }}
      </div>
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
.swap-btn {
  background-color: #f8f9fa;
  transition: transform 0.2s ease;
}
.swap-btn:hover {
  transform: rotate(180deg);
  background-color: #e9ecef;
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
