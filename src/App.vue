<template>
	<v-app>
		<v-main>
			<transition name="fade">
				<router-view :key="$route.path" />
			</transition>
		</v-main>
	</v-app>
	<!-- <v-main>
		<router-view :key="$route.path" />
	</v-main> -->
</template>

<script>
	export default {
		name: 'App',

		data: () => ({
			//
		}),
		created() {
			this.$store.dispatch('lengthofusers');
		},
	};
</script>

<style>
	::-webkit-scrollbar {
		width: 0px;
	}
	::-webkit-scrollbar-track {
		-webkit-box-shadw: inset 0 0 6px rgba(0, 0, 0, 0.3);
		border-radius: 10px;
	}
	::-webkit-scrollbar-thumb {
		border-radius: 10px;
		-webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
	}
</style>

<!-- <template>
  <v-app>
    <v-app-bar 
      app
      color="primary"
      dark
    >
      
    </v-app-bar>

    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  data: () => ({
    //
  }),
};
</script> -->
