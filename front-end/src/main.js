import { createApp } from 'vue';
import * as VueRouter from 'vue-router';
import { initializeApp } from 'firebase/app';
import App from './App.vue';
import './main.css';
import ShoppingCartPage from './pages/ShoppingCartPage.vue';
import ProductsPage from './pages/ProductsPage.vue';
import ProductDetailPage from './pages/ProductDetailPage.vue';
import NotFoundPage from './pages/NotFoundPage.vue';

const FIREBASE_API_KEY = process.env.VUE_APP_VITE_FIREBASE_API_KEY;
const SENDER_ID = process.env.VUE_APP_SENDER_ID;
const PROJECT_ID = process.env.VUE_APP_PROJECT_ID;
const APP_ID = process.env.VUE_APP_APP_ID;

const firebaseConfig = {
	apiKey: FIREBASE_API_KEY,
	authDomain: PROJECT_ID + '.firebaseapp.com',
	projectId: PROJECT_ID,
	storageBucket: PROJECT_ID + '.appspot.com',
	messagingSenderId: SENDER_ID,
	appId: APP_ID
};

initializeApp(firebaseConfig);

createApp(App)
	.use(
		VueRouter.createRouter({
			history: VueRouter.createWebHistory(process.env.BASE_URL),
			routes: [
				{
					path: '/cart',
					component: ShoppingCartPage
				},
				{
					path: '/products',
					component: ProductsPage
				},
				{
					path: '/products/:productId',
					component: ProductDetailPage
				},
				{
					path: '/',
					redirect: '/products'
				},
				{
					path: '/:pathMatch(.*)*',
					component: NotFoundPage
				}
			]
		})
	)
	.mount('#app');
