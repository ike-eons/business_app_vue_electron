<template>
	<v-system-bar
		style="-webkit-app-region: drag"
		window
		height="32"
		class="system-bar white--text"
		app
	>
		<v-spacer></v-spacer>

		<div id="buttons" style="-webkit-app-region: no-drag">
			<v-icon @click="minimize()" id="minimize" class="pa-2"
				>mdi-window-minimize</v-icon
			>
			<v-icon v-if="resizeWindow" @click="maximize()" id="maximize" class="pa-2"
				>mdi-window-restore</v-icon
			>
			<v-icon
				v-else-if="!resizeWindow"
				@click="maximize()"
				id="maximize"
				class="pa-2"
				>mdi-window-maximize</v-icon
			>
			<v-icon @click="close()" id="close" class="pa-2">mdi-window-close</v-icon>
		</div>
	</v-system-bar>
</template>

<script>
	// const { remote } = require('electron');
	export default {
		props: {
			name: {
				type: String,
				require: true,
			},
		},
		data() {
			return {
				resizeWindow: true,
			};
		},
		methods: {
			minimize() {
				// remote.getCurrentWindow().minimize();
				window.API.minimize();
			},
			maximize() {
				this.resizeWindow = !this.resizeWindow;
				window.API.toggleMaximize(this.resizeWindow);
				// if (!window.API.isMaximized()) {
				// 	this.resizeWindow = true;
				// 	window.API.maximize();
				// } else {
				// 	this.resizeWindow = false;
				// 	window.API.unmaximize();
				// }
				// if (!remote.getCurrentWindow().isMaximized()) {
				// 	this.resizeWindow = true;
				// 	remote.getCurrentWindow().maximize();
				// } else {
				// 	this.resizeWindow = false;
				// 	remote.getCurrentWindow().unmaximize();
				// }
			},
			close() {
				window.localStorage.setItem('totalUsers', 0);
				window.API.close();
				// remote.getCurrentWindow().destroy();
			},
		},
	};
</script>

<style scoped>
	#buttons {
		margin-right: -13px;
		transition: all ease-in-out 0.2s;
		cursor: default;
	}
	/* #buttons #maximize,#buttons #minimize,#buttons #close{
    color: white;
    cursor: pointer;
  } */
	#maximize,
	#minimize,
	#close {
		text-align: center;
		color: white;
		transition: all ease-in-out 0.2s;
	}

	#buttons #maximize:hover,
	#buttons #minimize:hover {
		background-color: white;
		color: black;
		cursor: pointer;
	}
	#buttons #close:hover {
		background-color: #ff0000;
		cursor: pointer;
	}

	.system-bar {
		background: linear-gradient(
			110.7deg,
			rgb(9, 154, 151) 6.3%,
			rgb(21, 205, 168) 90.6%
		);
	}
</style>
