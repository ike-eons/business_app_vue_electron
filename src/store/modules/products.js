// import allproducts from '../../data/products.json';
import sourceProducts from '../../data/products.json';

export default {
	// namespaced: true,
	state: {
		products: [],
	},
	getters: {
		getProducts(state) {
			return state.products;
		},
	},
	mutations: {
		setProducts(state, products) {
			state.products = products;
		},
	},
	actions: {
		async fetchProducts({ commit }) {
			const response = await sourceProducts.products;

			console.log(response);
			commit('setProducts', response);
			return response;
		},
	},
};
