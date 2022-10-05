<template>
	<v-navigation-drawer
		v-model="mutableDrawer"
		color="#222d32"
		dark
		width="150"
		app
	>
		<!-- COMPANY NAME & LOGO -->
		<v-sheet
			color="#222d34"
			elevation="10"
			height="80"
			width="100%"
			class="text-center pt-5"
			justify="center"
		>
			<h3 class="text-center"><span class="red--text">Eons</span> Ent. App</h3>
		</v-sheet>

		<v-divider></v-divider>

		<!-- USER'S INFO -->
		<!-- <v-list-item two-line>
			<v-list-item-avatar class="ml-n4">
				<v-icon id="close" class="pa-3">mdi-account-circle</v-icon>
			</v-list-item-avatar>

			<v-list-item-content v-if="user">
				<v-list-item-title
					><span color="white">welcome Isaac</span></v-list-item-title
				>
				<v-list-item-subtitle>Admin</v-list-item-subtitle>
			</v-list-item-content>
		</v-list-item> -->

		<v-divider></v-divider>
		<div>
			<ul class="nav-box">
				<router-link
					v-for="item in items"
					:key="item.icon"
					class="nav-box__link"
					:class="item.class"
					:to="item.route"
				>
					<v-icon class="nav-box__link-icon">{{ item.icon }}</v-icon>
					<span class="nav-box__link-text">{{ item.text }}</span>
				</router-link>
			</ul>
		</div>
		<!-- navigation links -->

		<!-- <v-divider></v-divider> -->

		<!-- settings -->

		<div class="settings mt-15 pt-5">
			<router-link :to="{ name: 'Settings' }" class="nav-box__link">
				<v-icon class="nav-box__link-icon">mdi-cog</v-icon>
				<span class="nav-box__link-text">Settings</span>
			</router-link>
		</div>
	</v-navigation-drawer>
	<!--end of navigation  -->
</template>

<script>
	export default {
		props: {
			drawer: {
				type: Boolean,
			},
		},
		data() {
			return {
				active_id: 1,
				user: {},
				items: [
					{
						id: 1,
						icon: 'mdi-view-dashboard',
						text: 'System Statistics',
						route: '/layout',
						class: 'active',
					},
					{
						id: 2,
						icon: 'mdi-cart',
						text: 'Store',
						route: '/invoices',
						class: 'inactive',
					},
					// { icon: 'mdi-shape', text: 'Categories', route: '/categories' },
					{
						id: 3,
						icon: 'mdi-currency-rub',
						text: 'Products',
						route: '/products',
						class: 'inactive',
					},
					// { icon: 'mdi-chart-line-variant', text: 'Stocks', route: '/stocks' },
					// { icon: 'mdi-shape', text: 'Distributors', route: '/distributors' },
					{
						id: 4,
						icon: 'mdi-account-group',
						text: 'Customers',
						route: '/customers',
						class: 'inactive',
					},
					// {icon:'show_chart', text:'System Analytics', route:'/pagenotfound'},
				],
			};
		},
		computed: {
			mutableDrawer: {
				get() {
					return this.drawer;
				},
				set(value) {
					this.$emit('emutableVaue', value);
				},
			},
		},
		methods: {},
	};
</script>

<style lang="scss" scoped>
	.nav-box {
		padding: 10px 1px;

		&__link {
			list-style-type: none;
			text-decoration: none;
			color: #fff;
			display: flex;
			flex-direction: column;
			place-items: center;
			place-content: center;
			padding: 10px 0;
			font-size: 13px;
			cursor: pointer;
			&-text {
				color: #ccc;
			}
			&-icon {
				color: #fff;
				font-size: 30px;
			}
			&:hover {
				background-color: #30454e;
			}
		}
	}
	.nav-box__link:not(:last-child) {
		border-bottom: 1px solid rgb(85, 85, 85);
	}
	.nav-box__link:last-child {
		border-bottom: 5px solid rgb(85, 85, 85);
	}

	.active {
		// background-color: red;
	}

	.router-link-active {
		background-color: #2c3b42;
	}
</style>
