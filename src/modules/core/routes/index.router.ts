import { Router } from 'express';

import indexCoreController from '../controllers/indexController';
import orderController from "../controllers/order-controller";

class IndexRouter {
  public router: Router = Router();

  constructor() {
    this.config();
  }

  private config(): void {
    this.router.get('/health', indexCoreController.Health);
    this.router.post('/order', orderController.calculateDates);
  }
}

const indexRouter = new IndexRouter();
export default indexRouter.router;
