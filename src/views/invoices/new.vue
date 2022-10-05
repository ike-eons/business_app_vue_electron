<template>
	<v-container>
		<v-row>
			<!-- LEFT SIDE -->
			<v-col cols="8">
				<v-card tile elevation="1">
					<v-card-text>
						<v-row>
							<v-col>
								<v-btn color="success" @click="showCustomer($event)"
									>+ Add Customer</v-btn
								>
								<div class="mt-2 customer-hide">
									<v-autocomplete
										v-model="selectedItem"
										color="teal"
										dense
										outlined
										:items="products"
										item-text="description"
										item-value="id"
										@change="$v.selectedItem.$touch()"
										@blur="$v.selectedItem.$touch()"
										:error-messages="productError"
									>
									</v-autocomplete>
								</div>
							</v-col>
						</v-row>
						<v-row>
							<v-col cols="7">
								<p>Select Item</p>
								<v-autocomplete
									v-model="selectedItem"
									color="teal"
									dense
									outlined
									:items="products"
									item-text="description"
									item-value="id"
									@change="$v.selectedItem.$touch()"
									@blur="$v.selectedItem.$touch()"
									:error-messages="productError"
								>
								</v-autocomplete>
							</v-col>
							<v-col cols="2">
								<p>Quantity</p>
								<v-text-field
									dense
									v-model="quantity"
									color="teal"
									name="quantity"
									type="number"
									min="1"
									oninput="validity.valid||(value='');"
									outlined
									id="id"
									@input="$v.quantity.$touch()"
									@blur="$v.quantity.$touch()"
								></v-text-field>
							</v-col>
							<v-col cols="3">
								<div style="margin-top: 30px">
									<v-btn
										x-large
										color="teal"
										class="white--text"
										block
										depressed
										:disabled="$v.$invalid"
										@click="add_row()"
									>
										<span class="font-weight-bolder">+</span> Add
									</v-btn>
								</div>
							</v-col>
						</v-row>
						<v-divider class="mt-3"></v-divider>

						<v-data-table
							:headers="headers"
							:items="invoice.invoice_items"
							:calculate-widths="true"
							hide-default-footer
							class="mt-3"
						>
							<!--QUANTITY SLOT  -->

							<!-- DELETE ITEM FROM TABLE -->
							<template v-slot:[`item.actions`]="{ item }">
								<v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
							</template>

							<!-- NO DATA -->
							<template v-slot:no-data>
								<div>No Item Selected</div>
							</template>
						</v-data-table>
					</v-card-text>
				</v-card>
			</v-col>

			<!-- RIGHT SIDE -->
			<v-col cols="4">
				<v-card tile class="mx-auto" max-width="500">
					<v-system-bar height="35">
						Date
						<v-spacer></v-spacer>
						<span class="teal--text">{{ invoice.date }}</span>
					</v-system-bar>

					<v-card-title class="text-h6">
						Sub Total
						<v-spacer></v-spacer>
						GH¢{{ sub_total }}
					</v-card-title>

					<v-divider class="mx-1"></v-divider>

					<v-card-title class="text-h6">
						Tax
						<v-spacer></v-spacer>
						{{ tax }}%
					</v-card-title>

					<v-divider class="mx-1"></v-divider>

					<v-card-title class="text-h5">
						Total
						<v-spacer></v-spacer>
						{{ total | currency('GH¢') }}
					</v-card-title>

					<v-divider class="my-2"></v-divider>

					<!-- Payment Field -->
					<v-card-title>
						<v-row>
							<v-col md="8">
								<div>
									<!-- <v-text-field
                            @click="check($event)"
                                name="payment"
                                label="Amount Paid" outlined dense
                                v-model="invoice.amount_paid"
                                color="green"
                                min="0"
                                step=".01"
                                type="number" 
                                id="amount_paid"
                            /> -->
								</div>
							</v-col>

							<!-- Check For Full Payment -->
							<v-col md="4">
								<v-spacer></v-spacer>
								<div class="mt-n5">
									<v-checkbox
										name="fullpayment"
										id="fullpayment"
										label=""
										color="success"
										hide-details
									></v-checkbox>
									<div class="text-caption ml-n3">Full Payment</div>
								</div>
							</v-col>
						</v-row>
					</v-card-title>
					<v-card-actions>
						<v-btn
							block
							tile
							x-large
							color="teal"
							class="white--text"
							@click="save()"
						>
							PAY & PRINT</v-btn
						>
					</v-card-actions>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
	import moment from 'moment';
	import Vue2Filters from 'vue2-filters';

	import { required, integer } from 'vuelidate/lib/validators';

	export default {
		data() {
			return {
				headers: [
					{
						text: '#',
						align: 'center',
						sortable: false,
						value: 'index',
					},
					{
						text: 'Item Description',
						value: 'description',
						align: 'left',
					},
					{
						text: 'Quantity',
						value: 'quantity',
						align: 'center',
					},
					{
						text: 'Unit Cost(GH¢)',
						value: 'unit_cost',
						align: 'center',
					},
					{
						text: 'Actions',
						align: 'center',
						value: 'actions',
					},
				],
				customers: [],
				selectedItem: null,
				id: null,
				quantity: null,
				tax: 0.03,
				products: [],
				invoice: {
					date: moment().format('yyyy-MM-DD hh:mm:ss', true),
					total: 0.0,
					amount_paid: 0.0,
					customer_id: null,
					invoice_items: [],
				},
				full_payment: false,
				amt_paid: 0.0,
				editedIndex: 0,
				defaultItem: {
					index: 0,
					description: '',
					quantity: 0,
					product_id: null,
					unit_cost: 0,
				},
			};
		},

		mixins: [Vue2Filters.mixin],

		validations: {
			quantity: {
				required,
				integer,
			},
			selectedItem: {
				async uniqueProduct(value) {
					if (value == '') return true;
					console.log(`Selected value is ${value}`);
					const items = await this.invoice.invoice_items.map(
						(item) => item.product_id
					);
					const item_AlreadyExist = items.find((item) => item === value);
					if (item_AlreadyExist) {
						return false;
					}
					return true;
				},
			},
		},

		computed: {
			sub_total() {
				return this.calculateSubTotal();
			},
			total() {
				return this.calculateTotal(this.invoice.invoice_items);
			},
			quantityErrors() {
				const errors = [];
				if (!this.$v.quantity.$dirty) return errors;
				!this.$v.quantity.integer && errors.push('Quantity value is INVALID*');
				!this.$v.quantity.required && errors.push('Quantity is required*');
				return errors;
			},
			productError() {
				const errors = [];
				if (!this.$v.selectedItem.$dirty) return errors;
				!this.$v.selectedItem.uniqueProduct &&
					errors.push('Item already Selected*');
				return errors;
			},
		},
		created() {
			this.loadProducts();
		},
		methods: {
			loadProducts() {
				return this.products;
			},
			add_row() {
				this.$v.$touch();
				if (!this.$v.invalid) {
					this.defaultItem.index++;
					// this.defaultItem.description = this.selectedItem
					this.defaultItem.product_id = this.selectedItem;
					this.editedIndex = this.products.findIndex(
						(product) => product.id == this.selectedItem
					);

					this.defaultItem.quantity = parseInt(this.quantity);

					this.defaultItem.description =
						this.products[this.editedIndex]['description'];
					let u_cost = (
						this.quantity * this.products[this.editedIndex]['sales_price']
					).toFixed(2);
					this.defaultItem.unit_cost = parseFloat(u_cost);
					this.invoice.invoice_items.push(Object.assign({}, this.defaultItem));

					this.clear();
				}
			},
			// check(e){
			//     this.full_payment = false
			// },
			clear() {
				this.$v.reset;
				this.selectedItem = null;
				this.quantity = null;
			},
			removeSelectedItem() {
				let index = this.products.findIndex(
					(product) => product.id == this.selectedItem
				);
				console.log(`index: ${index}`);
				this.products.splice(index, 1);
			},

			deleteItem(item) {
				item = this.products.findIndex(
					(product) => product.id == this.selectedItem
				);
				console.log(item);
				// this.products.push(item)
				this.invoice.invoice_items.splice(item, 1);
			},
			calculateSubTotal() {
				let subtotal = this.invoice.invoice_items
					.map((item) => parseFloat(item.unit_cost))
					.reduce((accumulator, item) => accumulator + item, 0);
				return parseFloat(subtotal.toFixed(2));
			},
			calculateTotal() {
				this.invoice.total =
					this.calculateSubTotal() * this.tax + this.calculateSubTotal();
				return parseFloat(this.invoice.total).toFixed(2);
			},
			save() {
				// his.$router.push(`/invoices/${this.id}`);
			},

			showCustomer(event) {
				event.target.classList.add('customer-show');
			},
		},
	};
</script>

<style scoped>
	.customer-hidden {
		display: none;
	}
	.customer-show {
		display: block;
	}
</style>
