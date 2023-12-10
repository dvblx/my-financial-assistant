import axios from 'axios';
const API_URL = 'http://localhost:8000/api';
const INVOICE_API_URL = API_URL+'/cache-invoice/';

export default class CacheInvoiceService{

	constructor(){}


	getCustomers() {
		const url = `${INVOICE_API_URL}`;
		return axios.get(url).then(response => response.data);
	}
	getCustomersByURL(link){
		const url = `${API_URL}${link}`;
		return axios.get(url).then(response => response.data);
	}
	getCustomer(pk) {
		const url = `${INVOICE_API_URL}${pk}`;
		return axios.get(url).then(response => response.data);
	}
	deleteCustomer(invoice){
		const url = `${INVOICE_API_URL}${invoice.pk}`;
		return axios.delete(invoice);
	}
	createCustomer(invoice){
		const url = `${INVOICE_API_URL}`;
		return axios.post(url,invoice);
	}
	updateCustomer(invoice){
		const url = `${INVOICE_API_URL}${invoice.pk}`;
		return axios.put(url,invoice);
	}
}