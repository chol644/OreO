<template>
  <div
    class="signup-container d-flex justify-content-center align-items-center min-vh-100 bg-light"
  >
    <div
      class="signup-form p-4 p-md-5 bg-white shadow-sm"
    >
      <h2 class="h3 fw-bold text-center text-uppercase mb-2">
        회원가입
      </h2>

      <form @submit.prevent="handleSignup">
        <!-- Name Input -->
        <div class="input-group mb-3">
          <span class="input-group-text bg-transparent border-end-0 text-muted">
            <i class="bi bi-person"></i>
          </span>
          <input
            type="text"
            class="form-control border-start-0"
            placeholder="닉네임"
            aria-label="Your Name"
            v-model="formData.name"
            required
          />
        </div>

        <!-- Email Input -->
        <div class="input-group mb-3">
          <span class="input-group-text bg-transparent border-end-0 text-muted">
            <i class="bi bi-envelope"></i>
          </span>
          <input
            type="email"
            class="form-control border-start-0"
            placeholder="example@email.com"
            aria-label="Email Address"
            v-model="formData.email"
            required
          />
        </div>

        <!-- Password Input -->
        <div class="input-group mb-4">
          <span class="input-group-text bg-transparent border-end-0 text-muted">
            <i class="bi bi-lock"></i>
          </span>
          <input
            :type="passwordFieldType"
            class="form-control pe-5"
            id="floatingPassword"
            placeholder="Password"
            v-model="formData.password"
            required
          />
          <button
            type="button"
            @click="togglePasswordVisibility"
            class="btn btn-sm btn-link text-muted text-decoration-none border border-start-0"
            style="font-size: 0.75rem; padding-top: 0; padding-bottom: 0"
          >
          <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
          </button>
        </div>

        <!-- Submit Button -->
        <button
          class="w-100 btn btn-exclusive btn-lg d-flex justify-content-between align-items-center"
          type="submit"
        >
          <span>Become a Member</span>
          <i class="bi bi-arrow-right"></i>
        </button>
      </form>

      <!--
        <p class="mt-4 text-center text-muted small">
          Already a member? <a href="#" @click.prevent="goToLogin" class="fw-bold text-decoration-none">LOG IN</a>
        </p>
        -->
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";

// --- Reactive Data ---
const formData = reactive({
  name: "",
  email: "",
  password: "",
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

const handleSignup = () => {
  console.log("Signup attempt:", formData);
  // Add your signup logic here (e.g., API call)
  alert(`Signing up with Name: ${formData.name}, Email: ${formData.email}`);
  // Handle response, redirect on success, show errors on failure
};

// Optional: Method to navigate to login
/*
  const goToLogin = () => {
    console.log('Navigate to Login Page');
    alert('Log In clicked');
    // Add navigation logic (e.g., using Vue Router)
  };
  */
</script>

<style scoped>
.signup-container {
  /* background-color: #f8f9fa; */ /* Use bg-light or custom */
  width: 100%;
}

.signup-form {
  border: 1px solid #dee2e6; /* Add border like the image if shadow isn't enough */
  border-radius: 0.375rem; /* Bootstrap's default radius */
}

/* Input Group Styling to match image */
.input-group .form-control {
  border-color: #dee2e6; /* Match form border color */
  box-shadow: none; /* Remove default focus glow */
}
.input-group .form-control:focus {
  border-color: #86b7fe; /* Bootstrap focus color (optional) */
  /* Or keep the original border color: border-color: #dee2e6; */
}

.input-group .input-group-text {
  border-color: #dee2e6;
}

/* Remove left border radius for control when icon is prepended */
.input-group
  > :not(:first-child):not(.dropdown-menu):not(.valid-tooltip):not(
    .valid-feedback
  ):not(.invalid-tooltip):not(.invalid-feedback) {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
/* Remove right border radius for control when button is appended */
.input-group
  > :not(:last-child):not(.dropdown-menu):not(.dropdown-toggle):not(
    .valid-tooltip
  ):not(.valid-feedback):not(.invalid-tooltip):not(.invalid-feedback) {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

/* Custom Button Style */
.btn-exclusive {
  background-color: #0d6efd; /* Adjust dark blue/purple color */
  color: #ffffff;
  border: none;
}

.btn-exclusive:hover {
  background-color: #3a3f5a; /* Slightly lighter shade for hover */
  color: #ffffff;
}

/* Password Show/Hide Button Specifics */
.input-group .btn-link {
  border-color: #dee2e6 !important; /* Ensure border color matches input */
  color: #adb5bd; /* Lighter text color for SHOW/HIDE */
  background-color: #fff; /* Ensure background is white */
}
.input-group .btn-link:hover {
  color: #495057; /* Darker text on hover */
  background-color: #f8f9fa; /* Slight background change on hover */
}
.input-group .btn-link:focus {
  box-shadow: none;
}

/* Ensure icons are vertically centered */
.bi {
  vertical-align: -0.125em;
}
</style>

<script>
export default {
  name: "Signup",
};
</script>
