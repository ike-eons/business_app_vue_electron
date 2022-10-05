<template>
	<div class="background-color main-container">
		<v-container class="scroll-y" fluid>
			<transition name="fade" mode="out-in">
				<router-view :key="$route.path" />
			</transition>
		</v-container>
		<v-btn
			v-scroll="onScroll"
			bottom
			color="red"
			dark
			fab
			fixed
			right
			@click="toTop"
			class="clickable"
		>
			<v-icon>mdi-chevron-up</v-icon>
		</v-btn>
	</div>
</template>

<script>
	export default {
		methods: {
			onScroll(e) {
				if (typeof window === 'undefined') return;
				const top = window.pageYOffset || e.target.scrollTop || 0;
				this.fab = top > 20;
			},
			toTop() {
				this.$vuetify.goTo(0);
			},
		},
	};
</script>

<style lang="scss">
	.background-color {
		background-color: #fafafa;
	}

	.main-container {
		position: relative;
		width: 100%;
		padding-left: 50px !important;
		padding-right: 50px !important;
		top: 50px !important;
	}
</style>
