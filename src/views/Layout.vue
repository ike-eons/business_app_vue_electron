<template>
	<v-app>
		<system-bar />
		<app-bar @openDrawer="drawer = $event" />
		<left-navigation :drawer="drawer" />

		<app-main></app-main>
	</v-app>
</template>

<script>
	import SystemBar from '../components/LayoutComponents/SystemBar.vue';
	import AppBar from '../components/LayoutComponents/AppBar.vue';
	import LeftNavigation from '../components/LayoutComponents/LeftNavigation.vue';
	import AppMain from '../components/LayoutComponents/AppMain.vue';
	export default {
		components: {
			SystemBar,
			AppBar,
			LeftNavigation,
			AppMain,
		},
		data() {
			return {
				drawer: true,
				users: [],
			};
		},
		created() {},
		methods: {},
	};
</script>

<style></style>
