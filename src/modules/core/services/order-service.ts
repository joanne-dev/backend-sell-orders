import shippingMethodService from "./shipping-method-service";
import {addDays, addHours, getHour} from "../utils/calculations";
import {OrderDetails} from "../models/types";

class OrderService {
    nextBusinessDays: any[] = [];
    orderDetails: OrderDetails =  {};
    offDays: string[] = [];
    shippingMethod: any;
    async calculatePromisesDates(body: any): Promise<OrderDetails>{
        this.mapResponse(body);
       const responseShipping = await shippingMethodService.getShippingMethod(body.shippingMethod.id);
       this.shippingMethod = responseShipping.data;
       const responseGetOffDays = await shippingMethodService.getOffDays();
       this.offDays = responseGetOffDays.data as string[];
       this.calculateNextBusinessDays();
       this.validateWeightAvailability(body.lineItems);
       return this.orderDetails;
    }
    mapResponse(body: any){
        this.orderDetails = {
            orderInfo: {
                creationDate: this.getCreationDate().slice(0, 10),
                sellerStore: body.sellerStore,
                orderNumber: this.internalOrderNumber,
                buyerFullName: body.buyerFullName,
                buyerPhoneNumber: body.buyerPhoneNumber,
                buyerEmail: body.buyerEmail
            },
            shippingInfo: {
                method: body.shippingMethod.name,
                address: body.shippingAddress,
                city: body.shippingCity,
                region: body.shippingRegion,
                country: body.shippingCountry
            },
            items: body.lineItems
        };
    }
    calculateNextBusinessDays() {
        const currentDate = this.getCreationDate();
        for (let day=1; day<=10; day++){
            const nextDay: any = addDays(day, currentDate);
            if(!(this.offDays.includes(nextDay))){
                this.nextBusinessDays.push(nextDay);
            }
        }
    }
    getCreationDate() {
        return new Date().toISOString();
    }
    get internalOrderNumber() {
        return Date.now() + Math.floor(Math.random() * (100 + 1));
    }

    validateWeightAvailability(lineItems: any[]) {
        const minWeight = this.shippingMethod.rules.availability.byWeight.min;
        const maxWeight = this.shippingMethod.rules.availability.byWeight.max;
        const totalWeight = this.calculateTotalWeight(lineItems);
        if(minWeight <= totalWeight <= maxWeight) {
            this.validateRequestTimeAvailability();
        }
    }

    calculateTotalWeight(lineItems: any[]){
        const totalReducer = ( acc: any, curVal: any ) => {
            return acc.productWeight + curVal.productWeight;
        }
        return lineItems.reduce(totalReducer);

    }

    validateRequestTimeAvailability(){
        const dayType = this.shippingMethod.rules.availability.byRequestTime.dayType;
        if(dayType === 'ANY') {
            this.validateTimeOfDay();
        } else if (dayType === 'BUSINESS') {
            this.validateIsABusinessDay() && this.validateTimeOfDay();
        }
    }
     validateIsABusinessDay(){
         return  this.offDays.includes(this.getCreationDate().slice(0, 10));
     }

    validateTimeOfDay(){
        const fromTimeOfDay = this.shippingMethod.rules.availability.byRequestTime.fromTimeOfDay;
        const toTimeOfDay = this.shippingMethod.rules.availability.byRequestTime.toTimeOfDay;
        if(fromTimeOfDay <= getHour() <= toTimeOfDay) {
            this.determineWhichCaseApplies(1);
        }
    }

    determineWhichCaseApplies(priority: number) {
        const cases = this.shippingMethod.rules.promisesParameters.cases;
        const casePriority = cases.filter((casesP: any) => casesP.priority === priority);
        if(casePriority) {
            const dayType = casePriority[0].condition.byRequestTime.dayType;
            if (dayType === 'ANY') {
                this.validateTimeOfDayCase(casePriority[0], priority);
            }
            if (dayType === 'BUSINESS') {
                if(this.validateIsABusinessDay()){
                    this.validateTimeOfDayCase(casePriority[0], priority);
                } else {
                    priority++;
                    this.determineWhichCaseApplies(priority);
                }
            }
        }
    }

    validateTimeOfDayCase(caseByPriority: any, priority: number) {
        const fromTimeOfDay = caseByPriority.condition.byRequestTime.fromTimeOfDay;
        const toTimeOfDay = caseByPriority.condition.byRequestTime.toTimeOfDay;
        if(fromTimeOfDay <= getHour() <= toTimeOfDay) {
            const packPromise = this.getPackPromiseParams(caseByPriority, 'packPromise');
            const shipPromise = this.getPackPromiseParams(caseByPriority, 'shipPromise');
            const deliveryPromise = this.getPackPromiseParams(caseByPriority, 'deliveryPromise');
            const readyPickUpPromise = this.getPackPromiseParams(caseByPriority, 'readyPickUpPromise');
            this.orderDetails.promiseDates = {
                packPromiseMin: packPromise.promiseMin,
                packPromiseMax: packPromise.promiseMax,
                shipPromiseMin: shipPromise.promiseMin,
                shipPromiseMax: shipPromise.promiseMax,
                deliveryPromiseMin: deliveryPromise.promiseMin,
                deliveryPromiseMax: deliveryPromise.promiseMax,
                readyPickupPromiseMin: readyPickUpPromise.promiseMin,
                readyPickupPromiseMax: readyPickUpPromise.promiseMax,
            }
        } else {
            priority++;
            this.determineWhichCaseApplies(priority);
        }
    }

    getPackPromiseParams(workingCase: any, promise: string){
        const minType = workingCase[promise].min.type;
        const minDeltaHours = workingCase[promise].min.deltaHours;
        const minDeltaBusinessDays = workingCase[promise].min.deltaBusinessDays;
        const minTimeOfDay = workingCase[promise].min.timeOfDay;

        const maxType = workingCase[promise].max.type;
        const maxDeltaHours = workingCase[promise].max.deltaHours;
        const maxDeltaBusinessDays = workingCase[promise].max.deltaBusinessDays;
        const maxTimeOfDay = workingCase[promise].max.timeOfDay;

        const promiseMin = this.calculateMin({
            minType, minDeltaHours, minDeltaBusinessDays, minTimeOfDay
        });
        const promiseMax =this.calculateMax({
            maxType, maxDeltaHours, maxDeltaBusinessDays, maxTimeOfDay
        });
        return {promiseMin, promiseMax};
    }

    calculateMin(min: any){
        if(min.minType === 'NULL') {
            return 'NULL';
        } else if (min.minType === 'DELTA-HOURS'){
            const currentDate = this.getCreationDate();
            const nextHour: any = addHours(min.minDeltaHours, currentDate);
            return new Date(nextHour).toString();
        } else {
            const date = this.nextBusinessDays[min.minDeltaBusinessDays - 1];
            return new Date(date.setHours(min.minTimeOfDay)).toString();
        }
    }

    calculateMax(max: any){
        if(max.maxType === 'NULL') {
            return 'NULL';
        } else if (max.maxType === 'DELTA-HOURS'){
            const currentDate = this.getCreationDate();
            const nextHour: any = addHours(max.maxDeltaHours, currentDate);
            return new Date(nextHour).toString();
        } else {
            const date = this.nextBusinessDays[max.maxDeltaBusinessDays - 1];
            const  final = new Date(date.setHours(max.maxTimeOfDay));
            return final.toString();
        }
    }
}
const orderService = new OrderService();
export default orderService;
