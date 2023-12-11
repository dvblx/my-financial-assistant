import axios from 'axios';
const API_URL = 'http://localhost:8000/api/';
const GOAL_API_URL = API_URL+'financial-goal/';

export default class FinancialGoalService{

	constructor(){}


	getCustomers() {
		const url = `${GOAL_API_URL}`;
		return axios.get(url).then(response => response.data);
	}
	getCustomersByURL(link){
		const url = `${API_URL}${link}`;
		return axios.get(url).then(response => response.data);
	}
	getCustomer(pk) {
		const url = `${GOAL_API_URL}${pk}`;
		return axios.get(url).then(response => response.data);
	}
	deleteCustomer(goal){
		const url = `${GOAL_API_URL}${goal.pk}`;
		return axios.delete(goal);
	}
	createCustomer(goal){
		const url = `${GOAL_API_URL}`;
		return axios.post(url,goal);
	}
	updateCustomer(goal){
		const url = `${GOAL_API_URL}${goal.pk}`;
		return axios.put(url,goal);
	}
}