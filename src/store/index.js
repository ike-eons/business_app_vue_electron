import Vue from 'vue';
import Vuex from 'vuex';
import router from '../router';
// import users from './modules/users';
import products from './modules/products';
// import sourceUsers from '../data/users.json';
// import { ipcRenderer } from 'electron';

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
		ADD_USER(state, user) {
			let users = state.users.push(user);
			state.users = users;
		},
		EDIT_USER(state, user) {
			state.users.forEach((u) => {
				if (u.id == user.id) {
					u = user;
				}
			});
		},
		DELETE_USER(state, user) {
			let users = state.users.filter((u) => u.id !== user);
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
		async lengthofusers({ commit }, users) {
			users = [];
			const data = await window.API.usersFetch(users);
			// console.log(data);
			let total = data.length;
			commit('SET_LENGTH_OF_USERS', total);
			// console.log(`total users: ${total}`);
			return total;
		},
		async loginUser({ commit }, user) {
			try {
				let data = await window.API.userLogin(user);

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
			// let data = await ipcRenderer.invoke('users:load', users);
			let data = await window.API.usersFetch(users);
			commit('SET_USERS', data);
			return data;
		},

		logoutUser({ commit }) {
			commit('LOGOUT');
			router.replace({ name: 'Logout' });
		},

		async registerUser({ commit }, { user, pushToSessionStorage }) {
			try {
				let data = await window.API.userCreate(user);
				if (data.error || undefined) {
					console.log(`reporting error: ${data.error}`);
					commit('SET_ERROR', data.error);
				} else {
					console.log(`vuex data`);
					console.log(data);
					console.log(`vuex data`);
					if (pushToSessionStorage == true) {
						commit('SET_CURRENT_USER', data);
						router.replace({ name: 'Layout' });
					}
					return data;
				}
			} catch (e) {
				console.log(e);
			}
		},

		async editUser({ commit }, user) {
			let data = await window.API.userUpdate(user);
			console.log(data);
			if (data == data.error || data == undefined) {
				console.log(`reporting error`);
				// commit('SET_ERROR', data.error | undefined);
			} else {
				commit('EDIT_USER', user);
				return user;
			}
		},
		async deleteUser({ commit }, user) {
			let res = await window.API.userDelete(user);
			console.log(res);
			if (res.message == 'deleted') {
				commit('DELETE_USER', user);
				return res;
			} else {
				return res.error.message;
			}
		},
	},
});
