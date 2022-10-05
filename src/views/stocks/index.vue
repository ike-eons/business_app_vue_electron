<template>
	<v-data-table
		:headers="headers"
		:items="stocks"
		sort-by="calories"
		class="elevation-1"
	>
		<template v-slot:top>
			<v-toolbar flat color="teal" dark>
				<v-toolbar-title>STOCKS INTAKE</v-toolbar-title>
				<v-divider class="mx-4" inset vertical></v-divider>
				<v-spacer></v-spacer>
				<div max-width="500px">
					<v-btn color="white" class="mb-2 teal--text" @click="redirect()">
						New Stock
					</v-btn>
				</div>
			</v-toolbar>
		</template>
		<template v-slot:item.actions="{ item }">
			<v-icon small class="mr-2" @click="editItem()"> mdi-pencil </v-icon>
			<v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
		</template>

		<!-- STOCK_ID SLOT -->
		<template v-slot:item.stock_id="{ item }">
			<span>{{ `INV-${item.id + 1000}` }}</span>
		</template>
		<template v-slot:item.total="{ item }">
			<span>{{ item.total | currency('GH¢') }}</span>
		</template>

		<template v-slot:no-data>
			<v-btn color="teal" class="white--text" @click="loadStocks()">
				Reset
			</v-btn>
		</template>
	</v-data-table>
</template>
<script>
	export default {
		data: () => ({
			headers: [
				{
					text: '#',
					align: 'start',
					sortable: true,
					value: 'id',
				},
				{ text: 'Stock ID', value: 'stock_id', sortable: false },
				{ text: 'Total', value: 'total', sortable: true },
				{ text: 'Date', value: 'date' },
				{ text: 'Actions', value: 'actions', sortable: false },
			],
			stocks: [],
		}),

		created() {
			this.loadStocks();
		},

		methods: {
			loadStocks() {
				return this.stocks;
			},

			redirect() {
				this.$router.push('/stocks/new');
			},
			editItem() {
				this.$router.push('/stocks/show');
			},
		},
	};
</script>
