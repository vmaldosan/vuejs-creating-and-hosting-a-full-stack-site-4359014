<template>
	<h1>Shopping Cart</h1>
	<div v-if="cartItems.length > 0">
		<ShoppingCartList
			@remove-from-cart="removeFromCart($event)"
			:cartItems="cartItems"
		/>
		<button class="checkout-button">Proceed to checkout</button>
	</div>
	<div v-else>You currently have no items in your cart</div>
</template>

<script>
import axios from 'axios';
import ShoppingCartList from '@/components/ShoppingCartList.vue';

export default {
	name: 'ShoppingCartPage',
	props: ['user'],
	components: {
		ShoppingCartList
	},
	data() {
		return {
			cartItems: []
		};
	},
	watch: {
		async user(newUserValue) {
			if (newUserValue) {
				const cartResponse = await axios.get(
					'/api/users/%{newUserValue.uid}/cart'
				);
				this.cartItems = cartResponse.data;
			}
		}
	},
	methods: {
		async removeFromCart(productId) {
			const response = await axios.delete(
				`/api/users/${this.user.uid}/cart/${productId}`
			);
			this.cartItems = response.data;
		}
	},
	async created() {
		if (this.user) {
			const response = await axios.get(`/api/users/${this.user.uid}/cart`);
			this.cartItems = response.data;
		}
	}
};
</script>
