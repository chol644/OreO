<template>
  <div class="container py-5">
    <!-- 소개 문구 -->
    <div class="text-center mb-5">
      <h2 class="fw-bold mb-3">카드사별 추천 카드</h2>
      <p class="text-muted fs-5">
        다양한 카드사의 혜택을 한눈에!<br />
        나에게 꼭 맞는 카드를 찾아보세요 ✨
      </p>
    </div>

    <!-- 카드 리스트 -->
    <div class="row row-cols-1 row-cols-md-3 g-4">
      <div class="col" v-for="card in cardCompanies" :key="card.name">
        <div
          class="card h-100 text-center card-hover border-0 shadow rounded-4"
        >
          <div class="card-body d-flex flex-column justify-content-center p-4">
            <img
              :src="card.logo"
              :alt="`${card.name} 로고`"
              class="mb-4 mx-auto"
              style="height: 50px"
            />
            <h5 class="card-title mb-3">{{ card.name }}</h5>
            <a
              :href="card.link"
              target="_blank"
              class="btn btn-gradient mt-auto"
            >
              홈페이지 바로가기
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import samsungLogo from '@/assets/samsunglogo.png';
import kbLogo from '@/assets/kblogo.png';
import hyundaiLogo from '@/assets/hyundailogo.png';
import hanaLogo from '@/assets/hanalogo.png';
import wooricardlogo from '@/assets/wooricardlogo.png';
import lottelogo from '@/assets/lottelogo.png';
import kakaoLogo from '@/assets/kakaoLogo.png';

export default {
  name: 'CardPage',
  data() {
    return {
      cardCompanies: [
        {
          name: '신한카드',
          link: 'https://www.shinhancard.com/pconts/html/card/MOBFM265/R01/MOBFM265R01.html?crustMenuId=ms221',
          logo: 'https://www.shinhancard.com/pconts/company/images/contents/shc_ci_basic_02.png',
        },
        {
          name: '삼성카드',
          link: 'https://www.samsungcard.com/home/card/cardinfo/PGHPPDCCardCardinfoRecommendPC001?webViewFirstPage=true',
          logo: samsungLogo,
        },
        {
          name: 'KB국민카드',
          link: 'https://card.kbcard.com/CRD/DVIEW/HCAM0101',
          logo: kbLogo,
        },
        {
          name: '현대카드',
          link: 'https://www.hyundaicard.com/cpc/ma/CPCMA0101_01.hc',
          logo: hyundaiLogo,
        },
        {
          name: '롯데카드',
          link: 'https://www.lottecard.co.kr/app/LPCDARA_V100.lc',
          logo: lottelogo,
        },
        {
          name: '우리카드',
          link: 'https://pc.wooricard.com/dcpc/yh1/crd/crd01/H1CRD201S00.do',
          logo: wooricardlogo,
        },
        {
          name: '하나카드',
          link: 'https://www.hanacard.co.kr/',
          logo: hanaLogo,
        },
        {
          name: '비씨카드',
          link: 'https://www.bccard.com/app/card/CardSub.do',
          logo: 'https://www.bccard.com/favicon.ico',
        },
        {
          name: '카카오뱅크',
          link: 'https://www.kakaobank.com/products/checkcard',
          logo: kakaoLogo,
        },
      ],
    };
  },
};
</script>

<style scoped>
.card-title {
  font-weight: bold;
  font-size: 1.3rem;
  color: #333;
}

.card-hover {
  transition: all 0.3s ease;
}

.card-hover:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.12);
  background-color: #f9fbff;
}

.btn-gradient {
  background: linear-gradient(90deg, #007bff, #66ccff);
  border: none;
  color: white;
  font-weight: 500;
  padding: 10px 16px;
  border-radius: 20px;
  transition: all 0.3s ease;
}

.btn-gradient:hover {
  background: linear-gradient(90deg, #0056b3, #33b5e5);
  box-shadow: 0 4px 10px rgba(0, 123, 255, 0.3);
  color: white;
}
</style>
