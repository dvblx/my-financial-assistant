import axios from 'axios';
const API_URL = 'http://localhost:8000/api';
const BANK_API_URL = API_URL+'/bank-account/';

export default class BankAccountService{
	
	constructor(){}
	
	getBankAccounts() {
		const url = `${BANK_API_URL}`;
		return axios.get(url).then(response => response.data);
	}  
	getBankAccountsByURL(link){
		const url = `${API_URL}${link}`;
		return axios.get(url).then(response => response.data);
	}
	getBankAccount(pk) {
		const url = `${BANK_API_URL}${pk}`;
		return axios.get(url).then(response => response.data);
	}
	deleteBankAccount(bankAccount){
		const url = `${BANK_API_URL}${bankAccount.pk}`;
		return axios.delete(url);
	}
	createBankAccount(bankAccount){
		const url = `${BANK_API_URL}`;
		return axios.post(url,bankAccount);
	}
	updateBankAccount(bankAccount){
		const url = `${BANK_API_URL}${bankAccount.pk}`;
		return axios.put(url,customer);
	}
	confirmEmail(pk, confirmationCode){
	    const url = `${BANK_API_URL}${pk}/email_confirmation/`
	    return axios.post(url, confirmationCode);
	}
}