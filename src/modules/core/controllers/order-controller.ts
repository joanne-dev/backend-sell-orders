import { Request, Response } from 'express';
import orderService from "../services/order-service";
import mapperUtil from "../utils/mapper-util";

export class OrderController {
    async calculateDates(rq: Request, rs: Response) {
        let response: any;
        try {
            const dataCompleted = await orderService.calculatePromisesDates(rq.body);
            response = mapperUtil.mapResponseSuccessful(dataCompleted);
        }catch (error) {
            console.log(error);
            response = mapperUtil.mapResponseFailed(error);
        } finally {
            rs.status(response.status).json(response);
        }
    }
}

const orderController = new OrderController();
export default orderController;
