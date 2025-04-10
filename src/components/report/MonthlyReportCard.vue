<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <button class="close-btn" @click="$emit('close')">
        <i class="fas fa-times"></i>
      </button>
      <button @click="downloadReportImage" class="download-btn">
        <i class="fas fa-download"></i> 저장
      </button>
      <div id="shareCard" class="report-card">
        <h2>📆 이달의 소비 요약</h2>
        <p class="amount">💸 총 지출: ₩{{ formatAmount(expenseTotal) }}</p>
        <p class="category">
          📌 가장 많이 쓴 곳은<br />
          <strong>{{ topCategory }}</strong>
        </p>
        <p class="emotion-line">
          💭 지금 내가 쓴 돈은<br />
          <span class="highlight">{{ getTimeValue(expenseTotal) }}</span
          >의 노동이에요... 😮‍💨
        </p>
        <img
          src="@/assets/freeIcon.gif"
          alt="귀여운 아이콘"
          class="free-icon"
        />
        <p class="hashtag">#이번달소비요약 #현실자각 #열심히살자</p>
      </div>
    </div>
  </div>
</template>

<script>
import html2canvas from 'html2canvas';

export default {
  props: {
    transactions: Array,
    expenseTotal: Number,
  },
  computed: {
    topCategory() {
      const categoryMap = {};
      this.transactions
        .filter((t) => t.type === 'expense')
        .forEach((tx) => {
          categoryMap[tx.category] =
            (categoryMap[tx.category] || 0) + tx.amount;
        });
      const top = Object.entries(categoryMap).sort((a, b) => b[1] - a[1])[0];
      return top ? `${top[0]} (₩${this.formatAmount(top[1])})` : '없음';
    },
  },
  methods: {
    formatAmount(amount) {
      return Number(amount).toLocaleString();
    },
    getTimeValue(amount) {
      const wage = 10030;
      const hours = Math.floor(amount / wage);
      const minutes = Math.round(((amount / wage) % 1) * 60);
      return `${hours}시간 ${minutes}분`;
    },
    downloadReportImage() {
      const card = document.getElementById('shareCard');
      card.style.aspectRatio = '1 / 1'; // 보장
      html2canvas(card).then((canvas) => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = `Budget_Report_${new Date()
          .toISOString()
          .slice(0, 10)}.png`;
        link.click();
      });
    },
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Dongle:wght@300;400;700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(20, 20, 20, 0.4);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}

.modal-content {
  position: relative;
  width: 550px;
  background: #fff;
  border-radius: 24px;
  padding: 28px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  animation: fadeIn 0.3s ease-in-out;
  text-align: center;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.96);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 18px;
  background: none;
  border: none;
  font-size: 20px;
  color: #aaa;
  cursor: pointer;
}
.close-btn:hover {
  color: #444;
}

.download-btn {
  position: absolute;
  top: 16px;
  left: 18px;
  background-color: #8b5cf6;
  color: #fff;
  border: none;
  padding: 6px 14px;
  font-size: 14px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
}
.download-btn:hover {
  background-color: #7c3aed;
}

.report-card {
  font-family: 'Dongle', sans-serif;
  background: linear-gradient(145deg, #fdfcfa, #f4f6fb);
  padding: 50px 32px;
  border-radius: 28px;
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.03);
  color: #333;
  width: 100%;
  aspect-ratio: 1 / 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.report-card h2 {
  font-size: 40px;
  margin-bottom: 20px;
  color: #333;
}

.amount {
  font-size: 35px;
  font-weight: bold;
  color: #f87171;
  margin: 5px 0;
}

.category {
  font-size: 25px;
  margin: 10px 0;
  color: #6b7280;
  line-height: 1.5;
}

.emotion-line {
  font-size: 25px;
  line-height: 1.9;
  margin: 20px 0;
  color: #4b5563;
}

.emotion-line .highlight {
  font-weight: bold;
  color: #6366f1;
}

.hashtag {
  margin-top: 10px;
  font-size: 28px;
  color: #9ca3af;
}
.free-icon {
  width: 60px;
  height: 60px;
  margin: 10px auto;
  animation: float 2.5s ease-in-out infinite;
}

@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-6px);
  }
  100% {
    transform: translateY(0px);
  }
}
</style>
