const _products = [
	{
		id: 1,
		name: 'Ideal Milk',
		description: 'ideal milk sm',
		stock_price: 4,
		sales_price: 5,
		category_id: 1,
	},
	{
		id: 2,
		name: 'Ideal Milk',
		description: 'ideal milk bg',
		stock_price: 7,
		sales_price: 8.5,
		category_id: 1,
	},
	{
		id: 3,
		name: 'Carnation',
		description: 'carnation tea creamer',
		stock_price: 3,
		sales_price: 3.8,
		category_id: 1,
	},
	{
		id: 4,
		name: 'Milo Tin',
		description: 'Milo Tin 400g',
		stock_price: 20,
		sales_price: 25,
		category_id: 1,
	},
	{
		id: 5,
		name: 'Milo Tin',
		description: 'Milo Tin 800g',
		stock_price: 35,
		sales_price: 40,
		category_id: 1,
	},
];

export default {
	getProducts() {
		setTimeout(() => _products, 100);
	},
};
