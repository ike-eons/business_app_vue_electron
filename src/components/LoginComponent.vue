<template>
	<div class="login" id="login">
		<v-card class="mx-auto" max-width="400">
			<v-app-bar dark color="teal mb-5">
				<v-icon large left> mdi-account-multiple-outline</v-icon>
				<span class="text-h4 font-weight-light">Login</span>
			</v-app-bar>

			<v-card-text class="text-h6 font-weight-light">
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

				<p class="displayError" v-show="display_error != ''">
					{{ display_error }}
				</p>
				<v-card-actions>
					<v-btn
						id="disabled-login-button"
						block
						x-large
						tile
						color="teal"
						@click="login()"
						>Login</v-btn
					>
				</v-card-actions>
				<!-- <v-card-actions>
					<v-btn
						id="disabled-login-button"
						block
						x-large
						tile
						color="teal"
						@click="login()"
						:disabled="$v.user.$invalid"
						>Login</v-btn
					>
				</v-card-actions> -->
			</v-card-text>
		</v-card>
	</div>
</template>

<script>
	import { required, minLength } from 'vuelidate/lib/validators';
	export default {
		props: {
			user: {
				type: Object,
				require: true,
			},
		},
		data() {
			return {
				formIsValid: true,
				showPassword: false,
				apiRequest: false,
			};
		},
		validations: {
			user: {
				username: {
					required,
				},
				password: {
					required,
					minLength: minLength(4),
				},
			},
		},
		computed: {
			display_error() {
				return this.$store.getters.GET_ERROR;
			},
			usernameErrors() {
				const errors = [];
				if (!this.$v.user.username.$dirty) return errors;
				!this.$v.user.username.required &&
					errors.push('Username is required *');
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
		},
		methods: {
			async login() {
				console.log(this.user);
				if (this.$v.$invalid) {
					return false;
				} else {
					// this.$store.dispatch('createUser', this.user);
					await this.$store.dispatch('loginUser', this.user);
				}
			},
		},
	};
</script>

<style>
	#login {
		min-width: 400px;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
	.displayError {
		color: red;
		font-size: 16px;
		margin-top: -20px;

		text-align: center;
	}
	#disabled-login-button {
		color: #ffffff;
	}
</style>
