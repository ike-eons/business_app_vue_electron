<template>
	<div id="tray-buttons" style="-webkit-app-region: drag">
		<div style="-webkit-app-region: no-drag">
			<div id="system-icons">
				<div id="minimize">
					<v-icon @click="minimize()" id="minimize" class="pa-2"
						>mdi-window-minimize</v-icon
					>
				</div>

				<div id="close">
					<v-icon @click="close()" id="close" class="pa-2"
						>mdi-window-close</v-icon
					>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	// import { remote } from 'electron';
	export default {
		data() {
			return {};
		},

		methods: {
			minimize() {
				// remote.getCurrentWindow().minimize();
			},

			close() {
				window.localStorage.setItem('totalUsers', 0);
				// remote.getCurrentWindow().destroy();
			},
		},
	};
</script>

<style lang="scss" scoped>
	#system-icons {
		display: flex;
		position: absolute;
		top: 0;
		right: 0;
	}
	#minimize {
		font-size: 20px;
		padding: 5px 10px;
		color: #ffff;
		margin-top: -1px;
		cursor: pointer;
		&:hover {
			background-color: teal;
			color: #ffffff;
		}
	}
	#close {
		font-size: 20px;
		padding: 5px 10px;
		margin-top: -1px;
		color: #ffffff;
		cursor: pointer;
		&:hover {
			background-color: rgb(184, 40, 40);
			color: #ffffff;
		}
	}
</style>
