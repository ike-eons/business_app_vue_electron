<template>
	<v-app id="container">
		<div id="tray-buttons">
			<SystemBar />
		</div>

		<!-- <div class="auth-card" v-if="get_total_user > 0">
			<LoginComponent :user="user" />
		</div>
		<div class="auth-card" v-else>
			<RegisterComponent :user="user" />
		</div> -->
		<component :user="user" :is="dynamicComponent"></component>
	</v-app>
</template>

<script>
	import SystemBar from '../../components/LayoutComponents/SystemBar';
	import LoginComponent from '../../components/LoginComponent';
	import RegisterComponent from '@/components/RegisterComponent';
	// import SystemIcons from '@/components/SystemIcons';
	import moment from 'moment';
	export default {
		components: {
			LoginComponent,
			RegisterComponent,
			SystemBar,
		},
		data() {
			return {
				user: {
					firstname: '',
					lastname: '',
					username: '',
					phone: '',
					password: '',
					confirm_password: '',
					role: 'admin',
					date_created: moment().format('DD-MM-YYYY'),
					date_modified: moment().format('DD-MM-YYYY'),
				},
			};
		},

		computed: {
			dynamicComponent() {
				// return this.$store.getters.GET_LENGTH_OF_USERS;
				if (this.$store.getters.GET_LENGTH_OF_USERS > 0) {
					return 'LoginComponent';
				} else {
					return 'RegisterComponent';
				}
			},
		},
		created() {
			this.$store.dispatch('lengthofusers');
		},
		methods: {},
	};
</script>

<style lang="scss" scoped>
	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
		overflow: hidden !important;
	}

	#container {
		scrollbar-width: none;
		width: 100%;
		height: 100%;
		display: block;
		position: absolute;
		top: 0;
		left: 0;
		background: linear-gradient(
			110.7deg,
			rgb(9, 154, 151) 6.3%,
			rgb(21, 205, 168) 90.6%
		);

		background-image: linear-gradient(
				110.7deg,
				hsla(179, 89%, 32%, 0.95) 6.3%,
				rgba(21, 205, 168, 0.99) 90.6%
			),
			url('../../assets/sales.jpg');
		background-size: contain;
	}

	#tray-buttons {
		display: flex;
		/* background-color: red; */
		position: absolute;
		top: 0;
		right: 0;
		padding: 0px;
		cursor: pointer;
	}

	.auth-card {
		width: 100% !important;
	}
</style>
