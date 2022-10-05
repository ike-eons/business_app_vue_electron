<template>
	<v-container class="my-5">
		<v-row>
			<v-col md="12">
				<v-data-table
					:headers="headers"
					:items="users"
					sort-by="text"
					class="elevation-1 strip-table"
				>
					<template v-slot:[`item.fullname`]="{ item }">
						{{ item.firstname }} {{ item.lastname }}
					</template>
					<template v-slot:top>
						<v-toolbar
							flat
							elevation-1
							color="teal darken-1"
							dark
							class="lighten-2"
						>
							<v-toolbar-title
								><v-icon>mdi-account-group</v-icon> USERS</v-toolbar-title
							>
							<v-divider class="mx-5" inset vertical></v-divider>
							<v-spacer></v-spacer>

							<v-dialog v-model="dialog" max-width="500px">
								<template v-slot:activator="{ on }">
									<v-btn class="mb-2 teal--text" color="white" v-on="on">
										<i class="fa fa-plus" aria-hidden="true"></i>
										<span>new user</span>
									</v-btn>
								</template>

								<v-card>
									<v-card-title>
										<span class="headline">{{ formTitle }}</span>
									</v-card-title>

									<!-- Form Textfields -->
									<v-card-text>
										<v-container>
											<v-row dense>
												<v-col cols="12">
													<v-text-field
														v-model="editedItem.firstname"
														outlined
														dense
														color="teal darken-4"
														label=" Firstname"
														@input="$v.editedItem.firstname.$touch()"
														@blur="$v.editedItem.firstname.$touch()"
														:error-messages="firstnameErrors"
													/>
												</v-col>
												<v-col cols="12">
													<v-text-field
														v-model="editedItem.lastname"
														color="teal darken-4"
														outlined
														dense
														label=" Lastname"
														@input="$v.editedItem.lastname.$touch()"
														@blur="$v.editedItem.lastname.$touch()"
														:error-messages="lastnameErrors"
													/>
												</v-col>
												<v-col cols="12">
													<v-text-field
														v-model="editedItem.username"
														color="teal darken-4"
														outlined
														dense
														label="Username"
														@input="$v.editedItem.username.$touch()"
														@blur="$v.editedItem.username.$touch()"
														:error-messages="usernameErrors"
													/>
												</v-col>

												<v-col cols="12">
													<v-text-field
														v-model="editedItem.phone"
														color="teal darken-4"
														type="number"
														outlined
														dense
														label="Phone"
														@input="$v.editedItem.phone.$touch()"
														@blur="$v.editedItem.phone.$touch()"
														:error-messages="phoneErrors"
													/>
												</v-col>

												<v-col class="d-flex" cols="12" sm="6">
													<v-select
														:items="roles"
														label="Select role"
														color="teal darken-4"
														dense
														outlined
														v-model="editedItem.role"
													></v-select>
												</v-col>
												<v-col cols="12">
													<v-text-field
														outlined
														dense
														:type="showPassword ? 'text' : 'password'"
														label="Enter your password"
														prepend-icon="mdi-lock"
														:append-icon="
															showPassword ? 'mdi-eye' : 'mdi-eye-off'
														"
														@click:append="showPassword = !showPassword"
														v-model="editedItem.password"
														color="teal darken-4"
														@input="$v.editedItem.password.$touch()"
														@blur="$v.editedItem.password.$touch()"
														:error-messages="passwordErrors"
													/>
												</v-col>
												<v-col>
													<v-text-field
														outlined
														dense
														:type="showPassword ? 'text' : 'password'"
														label="Confirm your password"
														prepend-icon="mdi-lock"
														:append-icon="
															showPassword ? 'mdi-eye' : 'mdi-eye-off'
														"
														@click:append="showPassword = !showPassword"
														v-model="editedItem.confirm_password"
														color="teal darken-4"
														@input="$v.editedItem.confirm_password.$touch()"
														@blur="$v.editedItem.confirm_password.$touch()"
														:error-messages="cpasswordErrors"
													/>
												</v-col>
											</v-row>
										</v-container>
									</v-card-text>

									<v-card-actions>
										<v-spacer></v-spacer>
										<v-btn
											color="red darken-1"
											class="white--text"
											@click="close"
											>Cancel</v-btn
										>
										<v-btn
											color="teal darken-1"
											class="white--text"
											:disabled="$v.$invalid"
											@click="save"
											>Save</v-btn
										>
									</v-card-actions>
								</v-card>
							</v-dialog>
							<v-dialog v-model="dialogDelete" max-width="500px">
								<v-card>
									<v-card-title class="headline"
										>Are you sure you want to delete this <br />
										User?</v-card-title
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
						<v-icon small color="red darken-2" @click="deleteItem(item)">
							mdi-delete
						</v-icon>
					</template>
					<template v-slot:no-data>
						<v-btn color="teal darken-2" dark @click="GET_USERS">Reset</v-btn>
					</template>
				</v-data-table>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
	import {
		required,
		minLength,
		sameAs,
		numeric,
	} from 'vuelidate/lib/validators';

	import { mapState, mapGetters } from 'vuex';
	import moment from 'moment';

	export default {
		data() {
			return {
				pro: [],
				users: this.$store.state.users,
				dialog: false,
				dialogDelete: false,
				valid: false,
				showPassword: false,

				headers: [
					{
						text: 'Name',
						align: 'left',
						sortable: true,
						value: 'fullname',
					},
					{ text: 'Username', value: 'username' },
					{ text: 'Phone', value: 'phone' },
					{ text: 'Role', value: 'role' },
					{ text: 'Date Created', value: 'date' },

					{
						text: 'Actions',
						align: 'center',
						value: 'actions',
						sortable: false,
					},
				],
				roles: ['admin', 'manager', 'user'],
				editedIndex: -1,
				editedItem: {
					firstname: '',
					lastname: '',
					username: '',
					phone: '',
					role: '',
					password: '',
					confirm_password: '',
					date: '',
				},
				defaultItem: {
					firstname: '',
					lastname: '',
					username: '',
					phone: '',
					role: '',
					password: '',
					confirm_password: '',
					date: '',
				},
			};
		},
		validations: {
			editedItem: {
				firstname: {
					required,
				},
				lastname: {
					required,
				},
				username: {
					required,
					async uniqueUsername(value) {
						if (value == '') return true;

						let users = this.$store.state.users;
						console.log(users);
						const username_AlreadyExist = users.find(
							(user) => user.username.toLowerCase() === value.toLowerCase()
						);
						if (username_AlreadyExist) {
							return false;
						}
						return true;
					},
				},

				phone: {
					required,
					numeric,

					tenDigitPhonNumber(value) {
						return value.trim().length === 10;
					},
				},
				role: {
					required,
				},
				password: {
					required,
					minLength: minLength(4),
				},
				confirm_password: {
					required,
					sameAsPassword: sameAs('password'),
				},
			},
		},

		computed: {
			...mapState(['products']),
			...mapGetters(['GET_USERS']),
			formTitle() {
				return this.editedIndex === -1 ? 'New User' : 'Edit User';
			},
			firstnameErrors() {
				const errors = [];
				if (!this.$v.editedItem.firstname.$dirty) return errors;
				!this.$v.editedItem.firstname.required &&
					errors.push('User firstname is required*');

				return errors;
			},
			lastnameErrors() {
				const errors = [];
				if (!this.$v.editedItem.lastname.$dirty) return errors;
				!this.$v.editedItem.lastname.required &&
					errors.push('User lastname is required*');

				return errors;
			},
			usernameErrors() {
				const errors = [];
				if (!this.$v.editedItem.username.$dirty) return errors;
				!this.$v.editedItem.username.uniquePhone &&
					errors.push('Username already exist*');
				!this.$v.editedItem.username.required &&
					errors.push('Username is required*');

				return errors;
			},
			phoneErrors() {
				const errors = [];
				if (!this.$v.editedItem.phone.$dirty) return errors;

				!this.$v.editedItem.phone.required &&
					errors.push('phone number is required*');
				!this.$v.editedItem.phone.numeric &&
					errors.push('phone number is INVALID, must only be digits (0 - 9) *');
				!this.$v.editedItem.phone.tenDigitPhonNumber &&
					errors.push('phone number must be exactly 10 digits *');

				return errors;
			},

			roleErrors() {
				const errors = [];
				!this.$v.editedItem.role.required && errors.push('role is required*');
				return errors;
			},
			passwordErrors() {
				const errors = [];
				if (!this.$v.editedItem.password.$dirty) return errors;
				!this.$v.editedItem.password.required &&
					errors.push('Password is required *');
				!this.$v.editedItem.password.minLength &&
					errors.push('Password must be atleast 4 characters*');
				return errors;
			},
			cpasswordErrors() {
				const errors = [];
				if (!this.$v.editedItem.confirm_password.$dirty) return errors;
				!this.$v.editedItem.confirm_password.required &&
					errors.push('Confirm Password is required *');
				!this.$v.editedItem.confirm_password.sameAsPassword &&
					errors.push('Password & Confirm Password do not match*');
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
			this.$store.dispatch('fetchProducts');
		},
		methods: {
			saveUser(data) {
				data.date = moment().format('DD-MM-YYYY');
				this.$store.dispatch('saveUser', data);
			},

			deleteItem(item) {
				this.editedIndex = this.users.indexOf(item);
				this.editedItem = Object.assign({}, item);
				this.dialogDelete = true;
			},

			deleteItemConfirm() {
				this.users.splice(this.editedIndex, 1);
				// ipcRenderer.send('users:delete', this.editedItem.id);
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

			async save() {
				this.$v.$touch();
				if (!this.$v.$invalid) {
					this.users.unshift(this.editedItem);
					this.saveUser(this.editedItem);
				}
				this.close();
			},
			clearForm() {
				this.$v.reset;
				this.editedItem.name = '';
				this.editedItem.username = '';
				this.editedItem.role = '';
				this.editedItem.phone = '';
			},
		},
	};
</script>

<style scoped>
	.v-data-table table tr:nth-of-type(2n) {
		background: lightslategrey;
	}
</style>
