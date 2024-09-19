<template>
	<h1>Shopping Cart</h1>
	<div v-if="cartItems.length > 0">
		<ShoppingCartList :cartItems="cartItems" />
		<button class="checkout-button">Proceed to checkout</button>
	</div>
	<div v-else>You currently have no items in your cart</div>
</template>

<script>
import axios from 'axios';
import ShoppingCartList from '@/components/ShoppingCartList.vue';

export default {
	name: 'ShoppingCartPage',
	components: {
		ShoppingCartList
	},
	data() {
		return {
			cartItems: []
		};
	},
	async created() {
		const response = await axios.get('/api/users/12345/cart');
		this.cartItems = response.data;
	}
};
</script>
