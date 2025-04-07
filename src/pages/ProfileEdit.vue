<template>
    <div class="profile-edit-container d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div class="profile-edit-form p-4 p-md-5 bg-white shadow-sm rounded" style="max-width: 450px;">
  
        <h2 class="h3 fw-bold text-center mb-3">내 정보 수정</h2>
        <hr class="mb-4">
  
        <form @submit.prevent="handleUpdateProfile">
  
          <!-- Email (Read-only) -->
          <div class="mb-3">
            <label for="emailDisplay" class="form-label fw-bold">이메일</label>
            <p id="emailDisplay" class="form-control-plaintext bg-light p-2 rounded">
              {{ userData.email }}
            </p>
            <!-- Alternatively, use a disabled input: -->
            <!-- <input type="email" id="emailDisplay" class="form-control" :value="userData.email" disabled readonly> -->
          </div>
  
          <!-- Nickname (Editable) -->
          <div class="mb-3">
            <label for="nickname" class="form-label fw-bold">닉네임</label>
            <input
              type="text"
              id="nickname"
              class="form-control custom-rounded" 
              v-model="editableUserData.nickname"
              required
            />
          </div>
  
          <!-- Password (For confirmation or change) -->
          <div class="mb-4"> 
            <label for="password" class="form-label fw-bold">비밀번호</label>
            <input
              type="password"
              id="password"
              class="form-control custom-rounded" 
              v-model="editableUserData.current_password"
              placeholder="정보 수정을 위해 현재 비밀번호 입력"
              required
            />
            
          </div>
  
          <!-- Buttons -->
          <div class="d-grid gap-2">
            <button type="submit" class="btn btn-update btn-lg fw-bold">수 정</button>
            <button type="button" class="btn btn-cancel btn-lg fw-bold" @click="cancelEdit">취 소</button>
          </div>
  
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, onMounted } from 'vue';
  import { useRouter } from 'vue-router'; // 취소 시 페이지 이동을 위해
  
  const router = useRouter();
  
  // 실제로는 API 등에서 가져올 사용자 데이터
  const userData = ref({
    email: 'asdfa@naver.com', // 예시 데이터
    nickname: 'lalla',       // 예시 데이터
  });
  
  // 폼 입력을 위한 반응형 데이터 (초기값은 불러온 데이터로 설정)
  const editableUserData = reactive({
    nickname: '',
    current_password: '', // 현재 비밀번호 확인용
    // new_password: '', // 새 비밀번호 필드를 추가했다면 필요
    // new_password_confirmation: '', // 새 비밀번호 확인 필드를 추가했다면 필요
  });
  
  // 컴포넌트 마운트 시 사용자 데이터를 폼 데이터로 복사
  onMounted(() => {
    // 실제 앱에서는 여기서 API 호출로 userData를 채움
    // fetchUserData().then(data => {
    //   userData.value = data;
    //   editableUserData.nickname = data.nickname;
    // });
  
    // 예시 데이터로 초기화
    editableUserData.nickname = userData.value.nickname;
  });
  
  // 프로필 업데이트 처리 함수
  const handleUpdateProfile = () => {
    console.log('Updating profile:', editableUserData);
    // --- 여기에 실제 업데이트 API 호출 로직 추가 ---
    // 1. editableUserData.current_password 가 유효한지 확인
    // 2. 변경된 정보 (editableUserData.nickname 등) 를 서버로 전송
    // 3. 성공/실패 처리
  
    // 예시: 성공 알림 후 이전 페이지로 이동
    alert('프로필 정보가 수정되었습니다.');
    // router.push('/my-page'); // 또는 특정 페이지로 이동
    // router.go(-1); // 이전 페이지로 이동
  };
  
  // 수정 취소 함수
  const cancelEdit = () => {
    console.log('Edit cancelled');
    // 폼 변경사항을 리셋하거나 이전 페이지로 이동
    editableUserData.nickname = userData.value.nickname; // 닉네임 원래대로
    editableUserData.current_password = ''; // 비밀번호 필드 비우기
    // router.go(-1); // 이전 페이지로 이동하는 것이 일반적
    alert('수정이 취소되었습니다.');
  };
  
  // 실제 데이터 로딩 함수 (예시)
  // async function fetchUserData() {
  //   // const response = await fetch('/api/user/profile');
  //   // const data = await response.json();
  //   // return data;
  //   return { email: 'real-user@example.com', nickname: 'RealNickname' }; // API 응답 예시
  // }
  
 
  </script>
  
  <style scoped>
  .profile-edit-container {
    /* 필요 시 배경 스타일 추가 */
    width: 100%;
  }
  
  .profile-edit-form {
    border: 1px solid #e9ecef; /* 폼 테두리 (선택 사항) */
  }
  
  /* 읽기 전용 이메일 필드 스타일 (이미지와 유사하게) */
  #emailDisplay {
    color: #495057; /* 약간 어두운 텍스트 색상 */
  }
  
  /* 입력 필드 둥글기 (이미지와 유사하게) */
  .custom-rounded {
    border-radius: 1rem; /* 더 둥글게 */
    /* padding: 0.75rem 1rem; */ /* 필요 시 패딩 조정 */
  }
  
  /* 수정 버튼 스타일 */
  .btn-update {
    background-color: #6d63ff; /* 이미지의 파란색 계열 */
    color: white;
    border: none;
    border-radius: 0.5rem; /* 버튼 둥글기 */
    padding: 0.75rem 1rem; /* 버튼 크기 */
  }
  
  .btn-update:hover {
    background-color: #584fc9; /* 호버 시 약간 어둡게 */
    color: white;
  }
  
  /* 취소 버튼 스타일 */
  .btn-cancel {
    background-color: #a0a8d4; /* 이미지의 회색/보라색 계열 */
    color: white;
    border: none;
    border-radius: 0.5rem; /* 버튼 둥글기 */
    padding: 0.75rem 1rem; /* 버튼 크기 */
  }
  
  .btn-cancel:hover {
    background-color: #8a92c2; /* 호버 시 약간 어둡게 */
    color: white;
  }
  
  /* 폼 라벨 굵게 */
  .form-label {
      margin-bottom: 0.5rem; /* 라벨과 입력 필드 사이 간격 */
  }
  </style>
  <script>
 export default {
    name: 'ProfileEdit',
  };
  </script>