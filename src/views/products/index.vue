<template>
	<v-container fluid style="width: 100%">
		<v-data-table
			:fixed-header="true"
			:headers="headers"
			:search="search"
			:items="getProducts"
			sort-by="calories"
			class="elevation-1"
		>
			<template v-slot:top>
				<v-toolbar flat color="teal" dark>
					<v-toolbar-title>products</v-toolbar-title>
					<v-divider class="mx-4" inset vertical></v-divider>
					<v-spacer></v-spacer>

					<v-text-field
						v-model="search"
						outlined
						dense
						append-icon="mdi-magnify"
						label="Search"
						single-line
						hide-details
					></v-text-field>
					<v-spacer></v-spacer>
					<v-divider class="mx-4" inset vertical></v-divider>
					<v-dialog v-model="dialog" max-width="500px">
						<template v-slot:activator="{ on, attrs }">
							<v-btn
								color="white"
								class="mb-2 teal--text"
								v-bind="attrs"
								v-on="on"
							>
								<span class="font-weight-bold">+</span> New Product
							</v-btn>
						</template>
						<v-card>
							<v-card-title>
								<span class="headline">{{ formTitle }}</span>
							</v-card-title>

							<v-card-text>
								<v-container>
									<v-row>
										<v-col cols="12">
											<v-textarea
												v-model="editedItem.description"
												dense
												rows="2"
												outlined
												label="Product's Description"
												@input="$v.editedItem.description.$touch()"
												@blur="$v.editedItem.description.$touch()"
												:error-messages="descriptionErrors"
											>
											</v-textarea>

											<v-text-field
												v-model="editedItem.stock_price"
												outlined
												dense
												type="number"
												label="Stock Price"
												step=".01"
												@input="$v.editedItem.stock_price.$touch()"
												@blur="$v.editedItem.stock_price.$touch()"
												:error-messages="stockPriceErrors"
											>
											</v-text-field>

											<v-text-field
												v-model="editedItem.sales_price"
												type="number"
												outlined
												dense
												label="Sales Price"
												step=".01"
												@input="$v.editedItem.sales_price.$touch()"
												@blur="$v.editedItem.sales_price.$touch()"
												:error-messages="salesPriceErrors"
											>
											</v-text-field>
										</v-col>

										<v-col class="d-flex" cols="12">
											<v-select
												:items="categories"
												item-text="name"
												item-value="id"
												v-model="editedItem.category_id"
												label="Select Product's Category"
												outlined
											>
											</v-select>
										</v-col>
									</v-row>
								</v-container>
							</v-card-text>

							<v-card-actions>
								<v-spacer></v-spacer>
								<v-btn color="red darken-1 white--text" @click="close">
									Cancel
								</v-btn>
								<v-btn
									color="teal darken-1 white--text"
									:disabled="$v.$invalid"
									@click="save"
								>
									Save
								</v-btn>
							</v-card-actions>
						</v-card>
					</v-dialog>
					<v-dialog v-model="dialogDelete" max-width="500px">
						<v-card>
							<v-card-title class="headline"
								>Are you sure you want to delete this item?</v-card-title
							>
							<v-card-actions>
								<v-spacer></v-spacer>
								<v-btn color="red darken-1 white--text" @click="closeDelete"
									>Cancel</v-btn
								>
								<v-btn
									color="teal darken-2 white--text"
									@click="deleteItemConfirm"
									>OK</v-btn
								>
								<v-spacer></v-spacer>
							</v-card-actions>
						</v-card>
					</v-dialog>
				</v-toolbar>
			</template>
			<template v-slot:[`item.stock_price`]="{ item }">
				<span>{{ item.stock_price | currency('GH¢') }}</span>
			</template>
			<template v-slot:[`item.sales_price`]="{ item }">
				<span>{{ item.sales_price | currency('GH¢') }}</span>
			</template>
			<template v-slot:[`item.category_id`]="{ item }">
				<span>{{ getCategoryName(item.category_id) }}</span>
			</template>
			<template v-slot:[`item.actions`]="{ item }">
				<v-icon
					id="editbutton"
					small
					class="mr-2"
					color="teal editbutton"
					alt-labels="Edit"
					@click="editItem(item)"
				>
					mdi-pencil
				</v-icon>
				<v-icon id="deletebutton" small color="red" @click="deleteItem(item)">
					mdi-delete
				</v-icon>
			</template>
			<template v-slot:no-data>
				<v-btn color="teal" @click="initialize"> Reset </v-btn>
			</template>
		</v-data-table>
	</v-container>
</template>

<script>
	import {
		required,
		minLength,
		minValue,
		decimal,
	} from 'vuelidate/lib/validators';

	import { mapGetters, mapActions } from 'vuex';

	export default {
		data: () => ({
			dialog: false,
			dialogDelete: false,
			headers: [
				{
					text: 'Product Description',
					align: 'start',
					sortable: true,
					value: 'description',
				},
				{
					text: 'Sales Price (GH¢)',
					sortable: true,
					value: 'sales_price',
				},
				{
					text: 'Stock Price (GH¢)',
					sortable: true,
					value: 'stock_price',
				},
				{
					text: 'Category',
					sortable: true,
					value: 'category_id',
				},
				{ text: 'Actions', value: 'actions', sortable: false },
			],
			search: '',
			select: 'MISC',
			categories: [],
			editedIndex: -1,
			editedItem: {
				description: '',
				sales_price: 0,
				stock_price: 0,
				category_id: 1,
			},
			defaultItem: {
				description: '',
				sales_price: 0,
				stock_price: 0,
				category_id: 1,
			},
		}),

		validations: {
			editedItem: {
				description: {
					required,
					minLength: minLength(3),

					async uniqueName(value) {
						if (value === null) return true;
						const products = this.products;
						const nameAlreadyExist = products.find(
							(product) =>
								product.description.toLowerCase() === value.toLowerCase()
						);
						if (nameAlreadyExist) {
							return false;
						}
						return true;
					},
				},
				stock_price: {
					required,
					decimal,
					minValue: minValue(0),
				},
				sales_price: {
					required,
					decimal,
					minValue: minValue(0),
				},
				category_id: {
					required,
				},
			},
		},

		computed: {
			...mapGetters(['getProducts']),
			formTitle() {
				return this.editedIndex === -1 ? 'New product' : 'Edit product';
			},
			descriptionErrors() {
				const errors = [];
				if (!this.$v.editedItem.description.$dirty) return errors;
				!this.$v.editedItem.description.minLength &&
					errors.push('Product description must be atleast 3 characters*');
				!this.$v.editedItem.description.required &&
					errors.push('Product description is required*');
				!this.$v.editedItem.description.uniqueName &&
					errors.push('Product description already Exist*');
				return errors;
			},
			stockPriceErrors() {
				const errors = [];
				if (!this.$v.editedItem.stock_price.$dirty) return errors;
				!this.$v.editedItem.stock_price.decimal &&
					errors.push('Stock price value is INVALID*');
				!this.$v.editedItem.stock_price.required &&
					errors.push('stock price is required*');
				!this.$v.editedItem.stock_price.minValue &&
					errors.push("stock price can't be less than 0 *");
				return errors;
			},
			salesPriceErrors() {
				const errors = [];
				if (!this.$v.editedItem.sales_price.$dirty) return errors;
				!this.$v.editedItem.sales_price.decimal &&
					errors.push('Sales price value is INVALID*');
				!this.$v.editedItem.sales_price.required &&
					errors.push('Sales price is required*');
				!this.$v.editedItem.sales_price.minValue &&
					errors.push("Sales price can't be less than 0 *");
				return errors;
			},
			categoryErrors() {
				const errors = [];
				if (!this.$v.editedItem.category_id.$dirty) return errors;
				!this.$v.editedItem.category_id.required &&
					errors.push('Category is required*');
				return errors;
			},
		},

		watch: {
			dialog(val) {
				val || this.close();
			},
			dialogDelete(val) {
				val || this.closeDelete();
			},
		},

		created() {
			this.loadCategories();
			this.fetchProducts();
		},

		methods: {
			...mapActions(['fetchProducts']),
			initialize() {
				return this.$store.dispatch('fetchProducts');
			},

			loadCategories() {
				return this.categories;
			},
			getCategoryName(item) {
				let category_name = this.categories
					.filter((category) => category.id == item)
					.map((category) => category.name);
				return category_name[0];
			},
			editItem(item) {
				this.editedIndex = this.products.indexOf(item);
				this.editedItem = Object.assign({}, item);
				this.dialog = true;
			},

			deleteItem(item) {
				this.editedIndex = this.products.indexOf(item);
				this.editedItem = Object.assign({}, item);
				this.dialogDelete = true;
			},

			deleteItemConfirm() {
				this.products.splice(this.editedIndex, 1);
				// ipcRenderer.send('products:delete', this.editedItem.id);
				this.closeDelete();
			},

			close() {
				this.dialog = false;
				this.$nextTick(() => {
					this.editedItem = Object.assign({}, this.defaultItem);
					this.editedIndex = -1;
				});
			},

			closeDelete() {
				this.dialogDelete = false;
				this.$nextTick(() => {
					this.editedItem = Object.assign({}, this.defaultItem);
					this.editedIndex = -1;
				});
			},

			save() {
				if (this.editedIndex > -1) {
					Object.assign(this.products[this.editedIndex], this.editedItem);
				} else {
					this.$v.$touch();
					if (!this.$v.$invalid) {
						// ipcRenderer.send('products:add', this.editedItem);
						this.loadProducts();
						// this.products.push(this.editedItem)
					}
				}
				this.close();
			},
		},
	};
</script>
<style scoped>
	.flex-table {
		height: 50px;
	}
	.flex-table.row:nth-of-type(2n) {
		background: rgb(238, 238, 238);
	}

	/* .flex-table.v-text-field input {
    padding: 2px 0 2px 0px;
  }
  tbody tr:nth-of-type(odd) {
   background-color: rgba(0, 0, 0, .05);
  }
  table thead{
    font-weight: bolder;
    background-color: black;
  } */
</style>
