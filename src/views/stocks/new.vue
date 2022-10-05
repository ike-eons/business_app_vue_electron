<template>
	<v-container>
		<v-row>
			<!-- LEFT SIDE -->
			<v-col cols="12">
				<v-card tile elevation="1">
					<v-card-text>
						<v-row>
							<v-col cols="12" xs="12" sm="12" md="6">
								<v-autocomplete
									v-model="stock.distributor_id"
									:items="distributors"
									item-text="company_name"
									item-value="id"
									label="Select Distributor"
									full-width
									dense
									outlined
									hint="Select a distributors"
								>
								</v-autocomplete>
							</v-col>

							<!-- Stock Reference Number -->
							<v-col cols="12" xs="12" sm="6" md="3">
								<v-text-field
									label="Stock number"
									v-model="stock.reference"
									placeholder="Enter Stock Ref. number here"
									outlined
									dense
								></v-text-field>
							</v-col>

							<!-- Date Picker -->

							<v-col cols="12" xs="12" sm="6" md="3">
								<v-menu
									v-model="menu2"
									:close-on-content-click="false"
									:nudge-right="40"
									transition="scale-transition"
									offset-y
									min-width="auto"
								>
									<template v-slot:activator="{ on, attrs }">
										<v-text-field
											v-model="formatDate"
											label="Stock Date"
											prepend-icon="mdi-calendar"
											outlined
											dense
											readonly
											v-bind="attrs"
											v-on="on"
										></v-text-field>
									</template>
									<v-date-picker
										v-model="date"
										@input="menu2 = false"
									></v-date-picker>
								</v-menu>
							</v-col>
						</v-row>
						<v-divider></v-divider>
						<v-row class="pa-3">
							<v-col cols="1">
								<h4>No.</h4>
							</v-col>
							<v-col cols="6">
								<h4>Product Description</h4>
							</v-col>
							<v-col cols="2">
								<h4>Quantity</h4>
							</v-col>
							<v-col cols="2">
								<h4>Unit Cost</h4>
							</v-col>
							<v-col cols="1">
								<h4><i class="fa fa-bolt"></i></h4>
							</v-col>
						</v-row>
						<v-divider class="pb-5"></v-divider>
						<v-row
							class="mb-n5"
							v-for="(item, index) in stock.stock_items"
							:key="item.id"
							dense
						>
							<v-col cols="1"> {{ getIndex(index) }}{{ index + 1 }} </v-col>
							<v-col cols="6">
								<v-autocomplete
									:items="products"
									v-model="stock.stock_items[parseInt(index)].product"
									item-text="description"
									item-value="id"
									:return-object="true"
									background-color="#fefeff"
									label="Select Product"
									full-width
									dense
									outlined
									hint="list of all products"
									hide-selected
								>
								</v-autocomplete>
							</v-col>
							<v-col cols="2">
								<v-text-field
									type="number"
									v-model="stock.stock_items[index].quantity"
									min="1"
									dense
									outlined
								></v-text-field>
							</v-col>
							<v-col cols="2">
								<v-text-field
									dense
									outlined
									readonly
									:value="calculateUnitCost(index)"
								/>
							</v-col>
							<v-col cols="1">
								<span @click="remove_stock_item(index)">
									<v-icon>mdi-delete</v-icon>
								</span>
							</v-col>
						</v-row>

						<!-- ADD NEW ROW -->
						<v-row>
							<v-col cols="6">
								<v-btn class="mx-2" fab dark color="indigo" @click="add_row()">
									<v-icon dark>mdi-plus</v-icon>
								</v-btn>
							</v-col>
							<v-col cols="6">
								<v-divider class="mx-1"></v-divider>

								<v-card-title class="text-h6">
									Total
									<v-spacer></v-spacer>
									{{ total | currency('GH¢') }}
								</v-card-title>

								<v-divider class="my-2"></v-divider>

								<v-card-actions>
									<v-btn
										block
										tile
										x-large
										color="teal"
										class="white--text"
										@click="save"
									>
										Save
									</v-btn>
								</v-card-actions>
							</v-col>
						</v-row>
					</v-card-text>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
	import moment from 'moment';
	import Vue2Filters from 'vue2-filters';

	export default {
		data() {
			return {
				index: 0,
				// date: new Date().toISOString().substr(0, 10),
				date: moment().format('yyyy-MM-DD hh:mm:ss', true),
				menu: false,
				modal: false,
				menu2: false,
				id: null,
				stock: {
					date: moment().format('yyyy-MM-DD hh:mm:ss', true),
					distributor_id: null,
					reference: '',
					total: 0.0,
					stock_items: [],
				},

				distributors: [],
				products: [],
			};
		},
		watch: {
			index: function (newValue, oldValue) {
				console.log(`${this.index} oldValue: ${oldValue} newValue:${newValue}`);
			},
		},

		mixins: [Vue2Filters.mixin],

		computed: {
			total() {
				return this.calculateTotal(this.stock.stock_items);
			},
			cal_unitcost() {
				return this.calculateUnitCost(this.index);
			},
			formatDate() {
				return this.date ? moment(this.date).format('dddd, MMMM Do YYYY') : '';
			},
		},
		created() {
			this.loadProducts();
			this.loadDistributors();
		},
		methods: {
			loadProducts() {
				return this.products;
			},
			loadDistributors() {
				return this.distributors;
			},
			add_row() {
				this.stock.stock_items.push({
					product: {},
					quantity: 1,
					unit_cost: 0.0,
				});
			},
			remove_stock_item(index) {
				this.stock.stock_items.splice(index, 1);
			},
			getIndex(index) {
				this.index = parseInt(index);
			},
			calculateTotal() {
				let subtotal = this.stock.stock_items
					.map((item) => parseFloat(item.unit_cost))
					.reduce((accumulator, item) => accumulator + item, 0);
				this.stock.total = parseFloat(subtotal.toFixed(2));
				return this.stock.total;
			},
			calculateUnitCost(index) {
				this.stock.stock_items[index].unit_cost =
					this.stock.stock_items[index].quantity *
					this.stock.stock_items[index].product['stock_price'];
				if (isNaN(this.stock.stock_items[index].unit_cost)) {
					return 0;
				} else {
					return this.stock.stock_items[index].unit_cost.toFixed(2);
				}
			},
			save() {
				// this.$router.push(`/stocks/${this.id}`);
			},
		},
	};
</script>

<style></style>
