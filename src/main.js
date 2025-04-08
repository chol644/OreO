import './assets/main.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import { createApp } from 'vue';
import App from './App.vue';
import 'bootstrap';
import router from '../src/router';
const app = createApp(App);

app.use(router);

app.mount('#app');
