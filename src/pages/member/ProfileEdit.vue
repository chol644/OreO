<template>
  <div
    class="profile-edit-container d-flex justify-content-center align-items-center bg-light py-5"
  >
    <div
      class="profile-edit-form p-4 p-md-5 bg-white shadow-sm rounded"
      style="width: 100%; max-width: 500px"
    >
      <h2 class="h3 text-center mb-3">내 정보 수정</h2>
      <hr class="mb-4" />

      <!-- Loading Indicator -->
      <div v-if="isLoading" class="text-center my-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-2">정보를 불러오는 중...</p>
      </div>

      <!-- Error Display -->
      <div v-if="errorMessage" class="alert alert-danger" role="alert">
        {{ errorMessage }}
      </div>

      <!-- Form (shown only when not loading and no critical error) -->
      <form v-if="!isLoading && userData" @submit.prevent="handleUpdateProfile">
        <!-- Email (Read-only) -->
        <div class="mb-3">
          <label for="emailDisplay" class="form-label fw-bold">이메일</label>
          <!-- Use a disabled input for consistency and accessibility -->
          <input
            type="email"
            id="emailDisplay"
            class="form-control bg-light custom-rounded"
            :value="userData.email"
            disabled
            readonly
          />
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
            :disabled="isSubmitting"
          />
        </div>

        <!-- Password (For confirmation) -->
        <div class="mb-4">
          <label for="password" class="form-label fw-bold">현재 비밀번호</label>
          <input
            type="password"
            id="password"
            class="form-control custom-rounded"
            v-model="editableUserData.current_password"
            placeholder="정보 수정을 위해 현재 비밀번호 입력"
            required
            :disabled="isSubmitting"
          />
          <div class="form-text">
            닉네임 변경을 완료하려면 현재 비밀번호를 입력해주세요.
          </div>
        </div>

        <!-- Buttons -->
        <div class="d-grid gap-2 mt-4">
          <button
            type="submit"
            class="btn btn-update btn-lg fw-bold"
            :disabled="isSubmitting"
          >
            <span
              v-if="isSubmitting"
              class="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            ></span>
            {{ isSubmitting ? '수정 중...' : '수 정' }}
          </button>
          <button
            type="button"
            class="btn btn-cancel btn-lg fw-bold"
            @click="cancelEdit"
            :disabled="isSubmitting"
          >
            취 소
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
const authStore = useAuthStore(); // ✅ 2단계: 선언

// --- Router & State ---
const router = useRouter();
const userData = ref(null); // Store fetched user data
const editableUserData = reactive({
  nickname: '',
  current_password: '',
});
const isLoading = ref(true); // For initial data load
const isSubmitting = ref(false); // For update process
const errorMessage = ref(null); // To display errors
const apiUrl = '/api/users';

// --- Lifecycle Hook ---
onMounted(() => {
  fetchUserData();
});

// --- Methods ---

// Fetch current user data
const fetchUserData = async () => {
  isLoading.value = true;
  errorMessage.value = null;
  // --- Get user ID (Replace with your actual method) ---
  const user = localStorage.getItem('userData'); // EXAMPLE: Retrieving from localStorage
  const userId = user ? JSON.parse(user).id : null; // Assuming userData contains an ID

  if (!user) {
    errorMessage.value = '사용자 정보를 찾을 수 없습니다. 다시 로그인해주세요.';
    isLoading.value = false;
    // Optionally redirect to login
    // router.push('/login');
    return;
  }
  // --- --- --- --- --- --- --- ---

  try {
    userData.value = JSON.parse(user); // Use localStorage data
    editableUserData.nickname = userData.value.nickname; // Initialize form
  } catch (error) {
    console.error('Error fetching user data:', error);
    if (error.response && error.response.status === 404) {
      errorMessage.value = '사용자 정보를 찾을 수 없습니다 (404).';
    } else {
      errorMessage.value = '사용자 정보를 불러오는 중 오류가 발생했습니다.';
    }
    userData.value = null; // Ensure form doesn't render if data fetch fails
  } finally {
    isLoading.value = false;
  }
};

// Handle profile update submission
const handleUpdateProfile = async () => {
  isSubmitting.value = true;
  errorMessage.value = null;

  if (!userData.value || !userData.value.id) {
    errorMessage.value = '사용자 정보가 유효하지 않습니다.';
    isSubmitting.value = false;
    return;
  }

  // --- !!! INSECURE PASSWORD CHECK !!! ---
  // This check happens client-side. DO NOT DO THIS IN PRODUCTION.
  if (userData.value.password !== editableUserData.current_password) {
    errorMessage.value = '현재 비밀번호가 일치하지 않습니다.';
    editableUserData.current_password = ''; // Clear password field
    isSubmitting.value = false;
    return;
  }
  // --- !!! END INSECURE CHECK !!! ---

  // If password matches, proceed to update nickname
  try {
    const userId = userData.value.id;
    // Use PATCH to update only the nickname
    const response = await axios.patch(`${apiUrl}/${userId}`, {
      nickname: editableUserData.nickname,
    });

    if (response.status === 200) {
      // OK status for PATCH/PUT
      console.log('Profile updated successfully:', response.data);
      // Update local data to reflect change immediately (optional)
      userData.value.nickname = response.data.nickname;
      authStore.setUser({
        ...authStore.user,
        nickname: response.data.nickname,
      });
      alert('프로필 정보가 성공적으로 수정되었습니다.');
      router.push('/'); // Navigate to home or profile view page
    } else {
      throw new Error(`Unexpected response status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    errorMessage.value =
      '프로필 업데이트 중 오류가 발생했습니다. 다시 시도해주세요.';
  } finally {
    isSubmitting.value = false;
    editableUserData.current_password = ''; // Clear password field after attempt
  }
};

// Handle cancellation
const cancelEdit = () => {
  if (isSubmitting.value) return; // Prevent cancel during submission

  console.log('Edit cancelled');
  if (userData.value) {
    editableUserData.nickname = userData.value.nickname; // Reset nickname
  }
  editableUserData.current_password = ''; // Clear password
  errorMessage.value = null; // Clear any previous error
  // Optional: Navigate back
  // router.go(-1);
  alert('수정이 취소되었습니다.'); // Or navigate silently
};
</script>

<style scoped>
.profile-edit-container {
  min-height: 80vh; /* Ensure it takes up space */
  padding-top: 2rem;
  padding-bottom: 2rem;
}

/* Consistent rounding */
.custom-rounded {
  border-radius: 0.5rem; /* Adjust as needed */
}

/* Read-only field appearance */
input:disabled,
input[readonly] {
  cursor: not-allowed;
}
.form-control:disabled,
.form-control[readonly] {
  background-color: #e9ecef; /* Standard disabled background */
  opacity: 1;
}

/* Update button */
.btn-update {
  background-color: #6d63ff;
  color: white;
  border: none;
  /* border-radius default from btn */
}
.btn-update:hover {
  background-color: #584fc9;
  color: white;
}
.btn-update:disabled {
  background-color: #a39eff; /* Lighter color when disabled */
}

/* Cancel button */
.btn-cancel {
  background-color: #6c757d; /* Bootstrap secondary */
  color: white;
  border: none;
}
.btn-cancel:hover {
  background-color: #5a6268;
  color: white;
}
.btn-cancel:disabled {
  background-color: #adb5bd; /* Lighter color when disabled */
}

.form-label {
  margin-bottom: 0.5rem;
}

/* Center spinner in button */
.btn .spinner-border {
  vertical-align: text-bottom;
}
</style>
