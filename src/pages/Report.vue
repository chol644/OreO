<template>
  <div class="container p-2 justify-content-center align-items-center">
    <div class="d-flex align-items-center mb-3">
      <span class="me-2 fw-semibold text-secondary"> 검색 결과 :</span>
      <span class="badge bg-primary fs-6">2 건</span>
    </div>

    <div class="filter d-flex flex-wrap align-items-center gap-2">
      <span
        class="period bg-light bg-box rounded-pill d-flex justify-content-center align-items-center"
      >
        기간 :　
        <input type="text" class="period" />　~　
        <input type="text" class="period" />
      </span>
      <span><button class="btn btn-outline-dark bg-light">자산</button></span>
      <span
        ><button class="btn btn-outline-dark bg-white">분류(지출)</button></span
      >
      <span
        ><button class="btn btn-outline-dark bg-light">분류(수입)</button></span
      >
      <span><button class="btn btn-outline-dark bg-light">금액</button></span>
      <span
        class="bg-light bg-box rounded-pill d-flex justify-content-center align-items-center"
      >
        <i class="fa-solid fa-magnifying-glass"></i>
        <input type="text" class="inputMemo" placeholder="🔍 내용 또는 메모" />
        <button class="btn btn-outline-dark">검색</button>
      </span>
      <span><button class="btn btn-primary float-end">초기화</button></span>
    </div>

    <div class="total d-flex justify-content-center gap-2 flex-wrap my-3">
      <span
        class="bg-secondary text-white rounded-pill text-center small px-2 py-1"
        style="min-width: 80px"
      >
        전체(2)<br />2,000,000 원
      </span>
      <span
        class="bg-success text-white rounded-pill text-center small px-2 py-1"
        style="min-width: 80px"
      >
        수입(1)<br />2,000,000 원
      </span>
      <span
        class="bg-danger text-white rounded-pill text-center small px-2 py-1"
        style="min-width: 80px"
      >
        지출(1)<br />100,000 원
      </span>
    </div>

    <div class="table-responsive rounded shadow-sm overflow-hidden">
      <table
        class="table table-bordered table-hover align-middle text-center mb-0"
      >
        <thead class="table-light">
          <tr>
            <th scope="col"><input type="checkbox" /></th>
            <th scope="col">날짜</th>
            <th scope="col">자산</th>
            <th scope="col">분류</th>
            <th scope="col">금액</th>
            <th scope="col">내용</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><input type="checkbox" /></td>
            <td>25.04.07 (월)</td>
            <td>현금</td>
            <td>월급</td>
            <td class="text-success fw-bold">2,000,000 원</td>
            <td>월급 들어옴</td>
          </tr>
          <tr>
            <td><input type="checkbox" /></td>
            <td>25.04.08 (화)</td>
            <td>카드</td>
            <td>쇼핑</td>
            <td class="text-danger fw-bold">100,000 원</td>
            <td>자켓 구매</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<style>
div {
  margin: 20px;
}
.container {
  background-color: white;
}
.total > span {
  margin: 5px;
  padding: 4px 15px;
  width: 300px;
}
.filter {
  padding: 10px;
}
.filter > .bg-box {
  padding: 5px 10px;
  height: 40px;
  width: auto;
}
.btn {
  padding: 5px;
}
.period {
  width: 80px;
  height: 30px;
}
.inputMemo {
  width: 200px;
  height: 30px;
  margin-right: 7px;
}
</style>
<script>
export default {
  name: 'Report',
};
</script>
