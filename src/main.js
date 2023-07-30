import '@/bootstrap';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createI18n } from '@/services/language.service';

import App from '@/App.vue';
import router from '@/router/index';

const app = createApp(App);

app.use(createPinia());
app.use(createI18n());
app.use(router);

app.mount('#app');
