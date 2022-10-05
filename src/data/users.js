const _users = [
	{
		id: 1,
		name: 'isaac agyei duku',
		username: 'ai.duku',
		role: 'admin',
		phone: '0209480433',
		password: 'admin',
	},
	{
		id: 1,
		name: 'John doe',
		username: 'j.doe',
		role: 'manager',
		phone: '0509480433',
		password: 'manager',
	},
	{
		id: 1,
		name: 'jane doe',
		username: 'jj.doe',
		role: 'manager',
		phone: '0559480433',
		password: 'manager',
	},
];

export default {
	getUsers(cb) {
		setTimeout(() => cb(_users), 100);
	},
};
