<template>
  <div class="container mt-4">
    <h2 class="mb-4">📈 <span class="text-success">미국 경제 뉴스</span></h2>

    <div v-if="news.length" class="row row-cols-1 g-4">
      <div v-for="(article, idx) in news" :key="idx" class="col">
        <div class="card shadow-sm h-100 flex-row">
          <img
            :src="article.urlToImage"
            @error="
              (e) =>
                (e.target.src =
                  'https://dummyimage.com/200x120/cccccc/ffffff&text=No+Image')
            "
            alt="썸네일"
            class="img-fluid rounded-start"
            style="width: 200px; object-fit: cover"
          />
          <div class="card-body">
            <h5 class="card-title">{{ article.title }}</h5>
            <p class="card-text">{{ article.description }}</p>
            <a
              :href="article.url"
              target="_blank"
              class="btn btn-sm btn-outline-primary"
            >
              기사 보기
            </a>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-muted">
      <img
        src="@/assets/loading.png"
        alt="로딩 중"
        style="width: 50px; height: 50px"
      />뉴스를 불러오는 중...
    </div>
  </div>
</template>

<script>
// import { fetchBusinessNews } from './openNews';
import axios from 'axios';

const fetchBusinessNews = async () => {
  const res = await axios.get(
    'https://saurav.tech/NewsAPI/top-headlines/category/business/us.json'
  );
  // console.log(res);
  return res.data.articles;
};

export default {
  data() {
    return {
      news: [],
    };
  },
  async mounted() {
    try {
      this.news = await fetchBusinessNews();
    } catch (e) {
      console.error('뉴스 로딩 실패:', e);
    }
  },
};
</script>
