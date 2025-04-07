<template>
  <div
    class="login-container d-flex justify-content-center align-items-center bg-light"
  >
    <div class="login-form p-4 p-md-5 border rounded bg-white shadow-sm">
      <!-- Optional: Sub-heading like the original -->
      <!-- <p class="text-muted text-center text-uppercase small mb-2">WELCOME BACK</p> -->
      <h1 class="h3 mb-4 fw-normal text-center">로그인</h1>

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
          />
          <label for="floatingPassword">비밀번호</label>
          <button
            type="button"
            @click="togglePasswordVisibility"
            class="btn btn-link position-absolute top-50 end-0 translate-middle-y me-2 border-0"
            aria-label="Toggle password visibility"
          >
            <!-- Using Bootstrap Icons (ensure you have them linked) -->
            <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
            <!-- Or use text: {{ showPassword ? 'Hide' : 'Show' }} -->
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
        <button class="w-100 btn btn-lg btn-primary mb-3" type="submit">
          로그인
        </button>
      </form>

      <!-- Divider -->
      <div class="d-flex align-items-center my-3">
        <hr class="flex-grow-1" />
        <span class="mx-3 text-muted small">Or</span>
        <hr class="flex-grow-1" />
      </div>

      <!-- Social Login Buttons -->
      <!-- <div class="d-grid gap-2">
          <button type="button" class="btn btn-outline-secondary d-flex align-items-center justify-content-center gap-2" @click="loginWithGoogle">
            <i class="bi bi-google"></i> Log in with Google
          </button>
          <button type="button" class="btn btn-outline-secondary d-flex align-items-center justify-content-center gap-2" @click="loginWithFacebook">
            <i class="bi bi-facebook"></i> Log in with Facebook
          </button>
          <button type="button" class="btn btn-outline-secondary d-flex align-items-center justify-content-center gap-2" @click="loginWithApple">
            <i class="bi bi-apple"></i> Log in with Apple
          </button>
        </div> -->

      <!-- Signup Link -->
      <p class="mt-4 text-center text-muted small">
        계정을 잊으셨나요?
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
import { ref, reactive, computed } from "vue";
import { useRouter } from 'vue-router';
const router = useRouter();
// --- Reactive Data ---
const formData = reactive({
  email: "", // Start empty for login
  password: "", // Start empty for login
});

const showPassword = ref(false);

// --- Computed Properties ---
const passwordFieldType = computed(() => {
  return showPassword.value ? "text" : "password";
});

// --- Methods ---
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const handleLogin = () => {
  console.log("Login attempt:", formData);
  // Add your login logic here (e.g., API call)
  alert(`Logging in with Email: ${formData.email}`);
  // Handle response, redirect on success, show errors on failure
};

const loginWithGoogle = () => {
  console.log("Login with Google");
  alert("Login with Google clicked");
  // Add Google Sign-in logic
};

const loginWithFacebook = () => {
  console.log("Login with Facebook");
  alert("Login with Facebook clicked");
  // Add Facebook Sign-in logic
};

const loginWithApple = () => {
  console.log("Login with Apple");
  alert("Login with Apple clicked");
  // Add Apple Sign-in logic
};

const goToSignup = () => {
  console.log("Navigate to Signup Page");
  router.push("/Signup"); // Adjust the route as per your setup
  // Add navigation logic (e.g., using Vue Router)
};

const forgotPassword = () => {
  console.log("Navigate to Forgot Password Page");
  alert("Forgot password clicked");
  // Add navigation logic or modal display
};
</script>

<style scoped>
/* Add custom styles if Bootstrap defaults aren't enough */
.login-container {
  /* You can add a background image or gradient here if desired */
  /* background: linear-gradient(to right, #ece9e6, #ffffff); */
  height:40rem;
}

.login-form {
  width: 100%;
}

/* Style the password toggle button if needed */
.btn-link {
  color: #6c757d; /* Bootstrap's secondary color */
  text-decoration: none;
}
.btn-link:hover {
  color: #495057;
}
.btn-link:focus {
  box-shadow: none; /* Remove focus outline if desired */
}

/* Ensure icon size is consistent */
.bi {
  vertical-align: -0.125em; /* Align Bootstrap icons nicely */
}
</style>

<script>
export default {
  name: "Login",
};
</script>
