<template>
	<v-data-table
		:fixed-header="true"
		:headers="headers"
		:search="search"
		:items="customers"
		sort-by="name"
		class="elevation-1 mytable"
	>
		<template v-slot:top>
			<v-toolbar flat color="teal" dark>
				<v-toolbar-title
					><span><v-icon medium>mdi-account-group</v-icon> </span
					>&nbsp;Customers</v-toolbar-title
				>
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
							<span class="font-weight-bold">+</span> New Customer
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
										<v-text-field
											v-model="editedItem.name"
											outlined
											dense
											label="Customer name"
											@input="$v.editedItem.name.$touch()"
											@blur="$v.editedItem.name.$touch()"
											:error-messages="nameErrors"
										>
										</v-text-field>
									</v-col>
									<v-col cols="12">
										<v-text-field
											v-model="editedItem.phone"
											label="Phone number"
											type="number"
											outlined
											dense
											@blur="$v.editedItem.phone.$touch()"
											@input="$v.editedItem.phone.$touch()"
											:error-messages="phoneErrors"
										/>
									</v-col>
									<v-col cols="12">
										<v-text-field
											v-model="editedItem.shop_name"
											label="Shop name"
											outlined
											dense
											@blur="$v.editedItem.shop_name.$touch()"
											@input="$v.editedItem.shop_name.$touch()"
											:error-messages="shopNameErrors"
										/>
									</v-col>
									<v-col cols="12">
										<v-textarea
											v-model="editedItem.shop_address"
											label="Shop address"
											outlined
											dense
											rows="2"
											@blur="$v.editedItem.shop_address.$touch()"
											@input="$v.editedItem.shop_address.$touch()"
											:error-messages="shopAddressErrors"
										/>
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
								>No</v-btn
							>
							<v-btn
								color="teal darken-2 white--text"
								@click="deleteItemConfirm"
								>Yes</v-btn
							>
							<v-spacer></v-spacer>
						</v-card-actions>
					</v-card>
				</v-dialog>
			</v-toolbar>
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
			<v-btn color="teal" class="white--text" @click="loadCustomers()">
				Reset
			</v-btn>
		</template>
	</v-data-table>
</template>

<script>
	import { minLength, required, numeric } from 'vuelidate/lib/validators';

	export default {
		data: () => ({
			dialog: false,
			dialogDelete: false,
			search: '',
			customers: [
				{
					name: 'eons',
					phone: '0209480433',
					shop_name: 'eons shop',
					shop_address: 'adum - kumasi',
				},
			],
			headers: [
				{
					text: 'Customer Name',
					align: 'start',
					sortable: true,
					value: 'name',
				},
				{ text: 'Phone', value: 'phone', sortable: true },
				{ text: 'Shop Name', value: 'shop_name', sortable: true },
				{ text: 'Shop Address', value: 'shop_address', sortable: true },
				{ text: 'Actions', value: 'actions', sortable: false },
			],
			editedIndex: -1,
			editedItem: {
				name: '',
				shop_name: '',
				shop_address: '',
				phone: '',
			},
			defaultItem: {
				name: '',
				shop_name: '',
				shop_address: '',
				phone: '',
			},
		}),

		computed: {
			formTitle() {
				return this.editedIndex === -1 ? 'New Customer' : 'Edit Customer';
			},

			nameErrors() {
				const errors = [];
				if (!this.$v.editedItem.name.$dirty) return errors;
				!this.$v.editedItem.name.minLength &&
					errors.push(' Name must be atleast 2 characters*');
				!this.$v.editedItem.name.required && errors.push(' Name is required*');
				return errors;
			},
			phoneErrors() {
				const errors = [];
				if (!this.$v.editedItem.phone.$dirty) return errors;
				!this.$v.editedItem.phone.uniquePhone &&
					errors.push('Phone number already exist*');
				!this.$v.editedItem.phone.required &&
					errors.push('phone number is required*');
				!this.$v.editedItem.phone.numeric &&
					errors.push('phone number is INVALID, must only be digits (0 - 9) *');
				!this.$v.editedItem.phone.tenDigitPhonNumber &&
					errors.push('phone number must be exactly 10 digits *');

				return errors;
			},
			shopNameErrors() {
				const errors = [];
				if (!this.$v.editedItem.shop_name.$dirty) return errors;
				!this.$v.editedItem.shop_name.minLength &&
					errors.push('Shop name must be atleast 4 characters*');
				!this.$v.editedItem.shop_name.required &&
					errors.push('Shop name is required*');
				return errors;
			},
			shopAddressErrors() {
				const errors = [];
				if (!this.$v.editedItem.shop_address.$dirty) return errors;
				!this.$v.editedItem.shop_address.minLength &&
					errors.push('Shop address must be atleast 4 characters*');
				!this.$v.editedItem.shop_address.required &&
					errors.push('Shop address is required*');
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

		// VALIDATION OF FORM INPUTS
		validations: {
			editedItem: {
				name: {
					required,
					minLength: minLength(2),
				},
				phone: {
					required,
					numeric,
					tenDigitPhonNumber(value) {
						return value.trim().length === 10;
					},
					async uniquePhone(value) {
						if (value == '') return true;

						const customers = this.customers;
						const phone_no_AlreadyExist = customers.find(
							(customer) => customer.phone === value
						);
						if (phone_no_AlreadyExist) {
							return false;
						}
						return true;
					},
				},
				shop_name: {
					required,
					minLength: minLength(4),
				},
				shop_address: {
					required,
					minLength: minLength(4),
				},
			},
		},

		created() {
			this.loadCustomers();
		},

		methods: {
			loadCustomers() {
				return this.customers;
			},

			editItem(item) {
				this.editedIndex = this.customers.indexOf(item);
				this.editedItem = Object.assign({}, item);
				this.dialog = true;
			},

			deleteItem(item) {
				this.editedIndex = this.customers.indexOf(item);
				this.editedItem = Object.assign({}, item);
				this.dialogDelete = true;
			},

			deleteItemConfirm() {
				this.customers.splice(this.editedIndex, 1);
				// ipcRenderer.send('customers:delete', this.editedItem.id);
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
					Object.assign(this.customers[this.editedIndex], this.editedItem);
				} else {
					this.$v.$touch();
					if (!this.$v.$invalid) {
						// ipcRenderer.send('customers:add', this.editedItem);
						this.loadCustomers();
						// this.products.push(this.editedItem)
					}
				}
				this.close();
			},
		},
	};
</script>

<style>
	.flex-table {
		height: 50px;
	}
	.flex-table.row:nth-of-type(2n) {
		background: rgb(238, 238, 238);
	}

	.flex-table.v-text-field input {
		padding: 2px 0 2px 0px;
	}

	/* .mytable table tr {
    background-color: lightgoldenrodyellow;
    border-bottom: none;
  } */

	.mytable tbody tr:nth-of-type(odd) {
		background-color: rgba(0, 0, 0, 0.05);
	}
	/* tbody tr:nth-of-type(odd) {
   background-color: rgba(0, 0, 0, .05);
  }
  table thead{
    font-weight: bolder;
    background-color: black;
  } */
</style>
