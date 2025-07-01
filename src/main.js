import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { onAuthStateChanged } from "firebase/auth";
import { projectAuth } from '@/firebase/config';

import '@fortawesome/fontawesome-free/css/all.css';
import '../public/main.css';

let app;

onAuthStateChanged(projectAuth, (_user) => {
    if (!app) {
        app = createApp(App)
        .use(createPinia())
        .use(router)
        .mount('#app')
    }
  })