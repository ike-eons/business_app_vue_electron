<template>
	<div class="register" id="register">
		<v-card class="mx-auto" max-width="400">
			<v-app-bar dark color="teal mb-5">
				<v-icon large left> mdi-account-multiple-plus-outline</v-icon>
				<span class="text-h4 font-weight-light">Register </span>
			</v-app-bar>

			<v-card-text class="text-h6 font-weight-light">
				<v-text-field
					outlined
					dense
					label="Firstname"
					prepend-icon="mdi-account-circle"
					color="teal darken-4"
					v-model="user.firstname"
					@input="$v.user.firstname.$touch()"
					@blur="$v.user.firstname.$touch()"
					:error-messages="firstnameErrors"
				/>

				<v-text-field
					outlined
					dense
					label="Lastname"
					prepend-icon="mdi-account-circle"
					color="teal darken-4"
					v-model="user.lastname"
					@input="$v.user.lastname.$touch()"
					@blur="$v.user.lastname.$touch()"
					:error-messages="lastnameErrors"
				/>

				<v-text-field
					class="mt-3"
					outlined
					dense
					label="Username"
					prepend-icon="mdi-account-circle"
					color="teal darken-4"
					v-model="user.username"
					@input="$v.user.username.$touch()"
					@blur="$v.user.username.$touch()"
					:error-messages="usernameErrors"
				/>
				<v-text-field
					class="mt-3"
					outlined
					dense
					type="number"
					label="Phone number"
					prepend-icon="mdi-account-circle"
					color="teal darken-4"
					v-model="user.phone"
					@input="$v.user.phone.$touch()"
					@blur="$v.user.phone.$touch()"
					:error-messages="phoneErrors"
				/>
				<v-text-field
					outlined
					dense
					:type="showPassword ? 'text' : 'password'"
					label="Enter your password"
					prepend-icon="mdi-lock"
					:append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
					@click:append="showPassword = !showPassword"
					v-model="user.password"
					color="teal darken-4"
					@input="$v.user.password.$touch()"
					@blur="$v.user.password.$touch()"
					:error-messages="passwordErrors"
				/>

				<v-text-field
					outlined
					dense
					:type="showPassword ? 'text' : 'password'"
					label="Confirm your password"
					prepend-icon="mdi-lock"
					:append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
					@click:append="showPassword = !showPassword"
					v-model="user.confirm_password"
					color="teal darken-4"
					@input="$v.user.confirm_password.$touch()"
					@blur="$v.user.confirm_password.$touch()"
					:error-messages="cpasswordErrors"
				/>

				<v-card-actions>
					<v-btn
						id="disabled-button"
						block
						x-large
						tile
						color="teal"
						@click.prevent="register()"
						:disabled="$v.user.$invalid"
						>Save
					</v-btn>
				</v-card-actions>
			</v-card-text>
		</v-card>
	</div>
</template>

<script>
	import {
		required,
		minLength,
		maxLength,
		sameAs,
	} from 'vuelidate/lib/validators';
	export default {
		props: {
			user: {
				type: Object,
				require: true,
			},
		},

		data() {
			return {
				pushToSessionStorage: true,
				formIsValid: true,
				showPassword: false,
				apiRequest: false,
			};
		},
		validations: {
			user: {
				firstname: {
					required,
				},
				lastname: {
					required,
				},
				username: {
					required,
				},
				phone: {
					required,
					maxLength: maxLength(10),
					minLength: minLength(10),
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
			firstnameErrors() {
				const errors = [];
				if (!this.$v.user.firstname.$dirty) return errors;
				!this.$v.user.firstname.required &&
					errors.push('Firstname is required *');
				return errors;
			},
			lastnameErrors() {
				const errors = [];
				if (!this.$v.user.lastname.$dirty) return errors;
				!this.$v.user.lastname.required &&
					errors.push('Lastname is required *');
				return errors;
			},
			usernameErrors() {
				const errors = [];
				if (!this.$v.user.username.$dirty) return errors;
				!this.$v.user.username.required &&
					errors.push('Username is required *');
				return errors;
			},
			phoneErrors() {
				const errors = [];
				if (!this.$v.user.phone.$dirty) return errors;
				!this.$v.user.phone.required &&
					errors.push('Phone number is required *');
				!this.$v.user.phone.minLength &&
					errors.push('Phone number must be exactly 10 Digits*');
				!this.$v.user.phone.maxLength &&
					errors.push('Phone number must be exactly 10 Digits*');
				return errors;
			},
			passwordErrors() {
				const errors = [];
				if (!this.$v.user.password.$dirty) return errors;
				!this.$v.user.password.required &&
					errors.push('Password is required *');
				!this.$v.user.password.minLength &&
					errors.push('Password must be atleast 4 characters*');
				return errors;
			},
			cpasswordErrors() {
				const errors = [];
				if (!this.$v.user.confirm_password.$dirty) return errors;
				!this.$v.user.confirm_password.required &&
					errors.push('Confirm Password is required *');
				!this.$v.user.confirm_password.sameAsPassword &&
					errors.push('Password & Confirm Password do not match*');
				return errors;
			},
		},

		methods: {
			register() {
				console.log(this.user);
				if (this.$v.$invalid) {
					return false;
				} else {
					this.$store.dispatch('registerUser', {
						user: this.user,
						pushToSessionStorage: this.pushToSessionStorage,
					});
				}
			},
		},
	};
</script>

<style>
	#register {
		min-width: 400px;

		position: absolute;
		top: 45%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
	#disabled-button {
		color: #ffffff;
	}
</style>
