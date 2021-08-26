export type OderInformation = {
    sellerStore: string;
    orderNumber: number;
    buyerFullName: string;
    buyerPhoneNumber: number;
    buyerEmail: string;
    creationDate: string;
};

export type ShippingInfo = {
    method: string;
    address: string;
    city: string;
    region: string;
    country: string;
};

export type PromiseDates =  {
    packPromiseMin: string;
    packPromiseMax: string;
    shipPromiseMin: string;
    shipPromiseMax: string;
    deliveryPromiseMin: string;
    deliveryPromiseMax: string;
    readyPickupPromiseMin: string;
    readyPickupPromiseMax: string;
};

export type Products =  {
    name: string;
    qty: number;
    weight: number;
};

export type OrderDetails = {
    orderInfo?: OderInformation;
    shippingInfo?: ShippingInfo;
    promiseDates?: PromiseDates;
    items?: Products[];
};

export type Response = {
    status: number;
    data: any;
}
