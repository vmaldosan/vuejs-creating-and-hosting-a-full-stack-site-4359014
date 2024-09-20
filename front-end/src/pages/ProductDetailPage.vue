<template>
	<div v-if="product">
		<div class="img-wrap">
			<img :src="product.imageUrl" />
		</div>
		<div class="product-details">
			<h1>{{ product.name }}</h1>
			<h3 class="price">{{ product.price }}</h3>
			<button v-if="!isInCart" class="add-to-cart" @click="addToCart">
				Add to cart
			</button>
			<button v-else class="grey-button">Already in cart</button>
			<button class="sign-in" @click="signIn">Sign in to add to cart</button>
		</div>
	</div>
	<div v-else>
		<NotFoundPage />
	</div>
</template>

<script>
import axios from 'axios';
import {
	getAuth,
	sendSignInLinkToEmail,
	isSignInWithEmailLink,
	signInWithEmailLink
} from 'firebase/auth';
import NotFoundPage from './NotFoundPage.vue';

export default {
	name: 'ProductDetailPage',
	data() {
		return {
			product: {},
			cartItems: []
		};
	},
	computed: {
		isInCart() {
			return this.cartItems.some(
				(item) => item.id === this.$route.params.productId
			);
		}
	},
	methods: {
		async addToCart() {
			await axios.post('/api/users/12345/cart', {
				id: this.$route.params.productId
			});
			alert('Successfully added item to cart');
		},
		async signIn() {
			const email = prompt('Please enter your email to sign in:');
			const auth = getAuth();
			const actionCodeSettings = {
				url: 'http://localhost:8080/products/${this.$route.params.productId}',
				handleCodeInApp: true
			};
			await sendSignInLinkToEmail(auth, email, actionCodeSettings);
			alert('A login link was sent to your email');
			window.localStorage.setItem('emailForSignIn', email);
		}
	},
	components: {
		NotFoundPage
	},
	async created() {
		const auth = getAuth();
		if (isSignInWithEmailLink(auth, window.location.href)) {
			const email = window.localStorage.getItem('emailForSignIn');
			await signInWithEmailLink(auth, email, window.location.href);
			alert('Successfully signed in!');
			window.localStorage.removeItem('emailForSignIn');
		}

		const response = await axios.get(
			`/api/products/${this.$route.params.productId}`
		);
		this.product = response.data;

		const cartResponse = await axios.get('/api/users/12345/cart');
		this.cartItems = cartResponse.data;
	}
};
</script>
