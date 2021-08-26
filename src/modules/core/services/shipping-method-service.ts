import axios, {AxiosRequestConfig} from 'axios';
import {configEnv} from "../../../config";

class ShippingMethodService {
    async getShippingMethod(shippingNumber: number) {
        const config: AxiosRequestConfig = {
            headers: this.headers
        }
        return axios.get(configEnv.URL+'shipping-methods/'+shippingNumber, config);
    }
    async getOffDays(){
        const config: AxiosRequestConfig = {
            headers: this.headers
        }
        return axios.get(configEnv.URL+'off-days', config);
    }

    get headers() {
        return {
            'x-api-key': configEnv.API_KEY,
            'Content-Type': 'application/json'
        }
    }
}
const shippingMethodService = new ShippingMethodService();
export default shippingMethodService;
