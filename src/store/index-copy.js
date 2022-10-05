import Vue from 'vue';
import Vuex from 'vuex';
import router from '../router';
// import users from './modules/users';
import products from './modules/products';
// import sourceUsers from '../data/users.json';
import { ipcRenderer } from 'electron';

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		products,
	},
	state: {
		users: [],
		products: [],
		currentUser: {},
		error: '',
		lengthOfUsers: 0,
	},
	getters: {
		GET_USERS(state) {
			return state.users;
		},
		GET_ERROR(state) {
			return state.error;
		},

		GET_CURRENT_USER(state) {
			//  return window.sessionStorage.currentUser
			return state.currentUser;
		},
		GET_LENGTH_OF_USERS(state) {
			return state.lengthOfUsers;
		},
	},
	mutations: {
		SET_USERS(state, users) {
			// let users = state.users.push(user);
			state.users = users;
		},
		ADD_USERS(state, user) {
			let users = state.users.push(user);
			state.users = users;
		},
		SET_ERROR(state, error) {
			state.error = error;
		},
		SET_LENGTH_OF_USERS(state, lengthOfUsers) {
			state.lengthOfUsers = lengthOfUsers;
		},
		SET_CURRENT_USER(state, user) {
			state.currentUser = user;
			sessionStorage.setItem('curentUser', JSON.stringify(user));
		},
		LOGOUT(state) {
			state.currentUser = {};
			sessionStorage.setItem('currentUser', JSON.stringify({}));
		},
		ERROR(state, data) {
			return (state.error = data);
		},
	},
	actions: {
		async lengthofusers({ commit }) {
			let total = 0;
			ipcRenderer.send('users:loadtotal', total);
			ipcRenderer.on('users:total', (_, totalusers) => {
				total = totalusers;
				sessionStorage.setItem('totalUsers', total);
				commit('SET_LENGTH_OF_USERS', total);
				return total;
			});
		},
		async loginUser({ commit }, user) {
			try {
				let data = await ipcRenderer.invoke('user:login', user);

				if (data.error || undefined) {
					console.log(`reporting error: ${data.error}`);
					commit('SET_ERROR', data.error);
				} else {
					console.log(data);
					commit('SET_CURRENT_USER', data);
					router.replace({ name: 'Layout' });
					return data;
				}
			} catch (error) {
				console.log(error.data.message || error.message);
				commit('error', error);
				return error;
			}
		},
		async fetchUsers({ commit }, users) {
			users = [];
			let data = await ipcRenderer.invoke('users:load', users);
			commit('SET_USERS', data);
			return data;
		},

		logoutUser({ commit }) {
			commit('LOGOUT');
			router.replace({ name: 'Logout' });
		},

		async createUser({ commit }, user) {
			try {
				// console.log(user);
				let data = await ipcRenderer.invoke('user:create', user);
				if (data.error || undefined) {
					console.log(`reporting error: ${data.error}`);
					commit('SET_ERROR', data.error);
				} else {
					commit('SET_CURRENT_USER', user);
					router.replace({ name: 'Layout' });
					return data;
				}
			} catch (e) {
				console.log(e);
			}
		},
		async saveUser({ commit }, user) {
			try {
				let data = await ipcRenderer.invoke('user:create', user);
				if (data.error || undefined) {
					console.log(`reporting error: ${data.error}`);
					commit('SET_ERROR', data.error);
				} else {
					commit('ADD_USER', user);
					// router.push({ name: 'Settings' });
					console.log('in saveUsers');
					return data;
				}
			} catch (e) {
				console.log(e);
			}
		},
	},
});
