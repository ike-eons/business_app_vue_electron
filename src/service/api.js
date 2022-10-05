import axios from 'axios';

export default () => {
	return axios.create({
		baseURL: '127.0.0.1:8080/api',
		withCredentials: false,
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
	});
};
