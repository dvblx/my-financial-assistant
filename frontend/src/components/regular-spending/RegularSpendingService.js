import axios from 'axios';
const API_URL = 'http://localhost:8000/api';
const SPENDING_API_URL = API_URL+'/regular-spending/';

export default class RegularSpendingService{

	constructor(){}


	getCustomers() {
		const url = `${SPENDING_API_URL}`;
		return axios.get(url).then(response => response.data);
	}
	getCustomersByURL(link){
		const url = `${API_URL}${link}`;
		return axios.get(url).then(response => response.data);
	}
	getCustomer(pk) {
		const url = `${SPENDING_API_URL}${pk}`;
		return axios.get(url).then(response => response.data);
	}
	deleteCustomer(spending){
		const url = `${SPENDING_API_URL}${spending.pk}`;
		return axios.delete(spending);
	}
	createCustomer(spending){
		const url = `${SPENDING_API_URL}`;
		return axios.post(url,spending);
	}
	updateCustomer(spending){
		const url = `${SPENDING_API_URL}${spending.pk}`;
		return axios.put(url,spending);
	}
}