import User from '../models/Users';
// import{BrowserWindow} from 'electron'
// const User = require('../database/models.Users.js');

User.createTable;

const d_user = {
	name: 'isaac',
	username: 'isaac',
	role: 'admin',
	phone: '0209480433',
	password: 'admin',
};

async function allUsers() {
	console.log('loading users');
	const users = await User.getAll();
	return users;
}

async function defaultUser() {
	try {
		let totalUsers = await User.getAll();
		if (totalUsers.length > 0) {
			return totalUsers;
		} else {
			await User.insert(
				d_user.name,
				d_user.username,
				d_user.role,
				d_user.phone,
				d_user.password
			);
			console.log('default user add');
		}
	} catch (err) {
		console.log(err);
	}
}

async function loginUser(user) {
	try {
		const u = await User.loginUser(user.username, user.password);
		console.log(u);
		return u;
	} catch (error) {
		return console.log(error);
	}
}

async function getTotalUser() {
	try {
		const rows = await User.getAll();
		console.log(rows.length);
		return rows.length;
	} catch (error) {
		return console.log(error);
	}
}

export { allUsers, defaultUser, loginUser, getTotalUser };
