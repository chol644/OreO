<template>
  <div
    class="login-container d-flex justify-content-center align-items-center bg-light"
  >
    <div class="login-form p-4 p-md-5 border rounded bg-white shadow-sm">
      <h1 class="h3 mb-4 fw-normal text-center">로그인</h1>

      <!-- Error Message Display -->
      <div v-if="loginError" class="alert alert-danger p-2" role="alert">
        {{ loginError }}
      </div>

      <form @submit.prevent="handleLogin">
        <!-- Email Input -->
        <div class="form-floating mb-3">
          <input
            type="email"
            class="form-control"
            id="floatingInput"
            placeholder="name@example.com"
            v-model="formData.email"
            required
            :disabled="isLoading"
          />
          <label for="floatingInput">이메일</label>
        </div>

        <!-- Password Input -->
        <div class="form-floating mb-3 position-relative">
          <input
            :type="passwordFieldType"
            class="form-control pe-5"
            id="floatingPassword"
            placeholder="Password"
            v-model="formData.password"
            required
            :disabled="isLoading"
          />
          <label for="floatingPassword">비밀번호</label>
          <button
            type="button"
            @click="togglePasswordVisibility"
            class="btn btn-link position-absolute top-50 end-0 translate-middle-y me-2 border-0"
            aria-label="Toggle password visibility"
            :disabled="isLoading"
          >
            <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
          </button>
        </div>

        <!-- Optional: Remember Me & Forgot Password -->
        <div class="d-flex justify-content-between align-items-center mb-3">
          <div class="form-check">
            <input
              class="form-check-input"
              type="checkbox"
              value=""
              id="rememberMe"
              :disabled="isLoading"
            />
            <label class="form-check-label small" for="rememberMe">
              로그인 기억하기
            </label>
          </div>
          <a
            href="#"
            class="small text-decoration-none"
            @click.prevent="forgotPassword"
            >비밀번호를 잊으셨나요?</a
          >
        </div>

        <!-- Submit Button -->
        <button
          class="w-100 btn btn-lg btn-primary mb-3"
          type="submit"
          :disabled="isLoading"
        >
          <span
            v-if="isLoading"
            class="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          ></span>
          <span v-else>로그인</span>
        </button>
      </form>

      <!-- Divider -->
      <div class="d-flex align-items-center my-3">
        <hr class="flex-grow-1" />
        <span class="mx-3 text-muted small">Or</span>
        <hr class="flex-grow-1" />
      </div>

      <!-- Signup Link -->
      <p class="mt-4 text-center text-muted small">
        계정이 없으신가요?
        <a
          href="#"
          @click.prevent="goToSignup"
          class="fw-bold text-decoration-none"
          >회원가입</a
        >
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios'; // Import axios
import { useAuthStore } from '../../stores/auth';

const authStore = useAuthStore();

// --- Router Instance ---
const router = useRouter();

// --- Reactive Data ---
const formData = reactive({
  email: '',
  password: '',
});

const showPassword = ref(false);
const loginError = ref(null);
const isLoading = ref(false);

// --- Computed Properties ---
const passwordFieldType = computed(() => {
  return showPassword.value ? 'text' : 'password';
});

// --- Methods ---
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const handleLogin = async () => {
  loginError.value = null;
  isLoading.value = true;
  console.log('Login attempt (axios):', formData.email);

  // --- IMPORTANT SECURITY WARNING ---
  // Sending passwords in plain text like this is highly insecure for real applications.
  // Use hashing server-side. This is only for local mock `json-server`.
  // --- --- --- ---

  try {
    // Base URL for your json-server
    // Assumes db.json is served at the root
    const apiUrl = '/api/users';
    // Use axios.get with a `params` object for query parameters
    const response = await axios.get(apiUrl, {
      params: {
        email: formData.email,
        password: formData.password,
        // Note: json-server will filter the array based on these params
      },
    });

    // axios automatically parses JSON, data is in `response.data`
    const matchingUsers = response.data;

    // Check if exactly one user matched
    if (Array.isArray(matchingUsers) && matchingUsers.length === 1) {
      const user = matchingUsers[0];

      // 이메일과 비밀번호 완전 일치 확인
      if (
        user.email === formData.email.trim() &&
        user.password === formData.password
      ) {
        localStorage.setItem('userId', user.id);

        authStore.setUser(user);
        alert('로그인 성공!');
        router.push('/');
        return;
      }
    }

    // 일치하지 않으면 아래 실행
    loginError.value = '이메일 또는 비밀번호가 일치하지 않습니다.';
  } catch (error) {
    // axios throws errors for non-2xx status codes (unlike fetch)
    console.error('Login error:', error);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error data:', error.response.data);
      console.error('Error status:', error.response.status);
      loginError.value = `로그인 오류가 발생했습니다 (상태: ${error.response.status}).`;
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Error request:', error.request);
      loginError.value =
        '서버에 연결할 수 없습니다. 네트워크를 확인하거나 서버가 실행 중인지 확인하세요.';
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error message:', error.message);
      loginError.value = '로그인 요청 중 오류가 발생했습니다.';
    }
  } finally {
    isLoading.value = false; // Reset loading state
  }
};

// --- Other Methods (unchanged) ---
const goToSignup = () => {
  router.push('/signup');
};
const forgotPassword = () => {
  alert('Forgot password clicked (Not implemented)');
};
</script>

<!-- Keep the existing style block -->
<style scoped>
.login-container {
  min-height: 80vh;
}
.login-form {
  width: 100%;
  max-width: 420px;
}
.btn-link {
  color: #6c757d;
  text-decoration: none;
}
.btn-link:hover {
  color: #495057;
}
.btn-link:focus {
  box-shadow: none;
}
.bi {
  vertical-align: -0.125em;
}
.btn .spinner-border {
  margin-right: 0.5rem;
}
</style>
