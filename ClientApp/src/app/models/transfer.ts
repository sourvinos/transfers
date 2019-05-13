export interface ITransfer {
    id: number;
    date: string;
    customerId: number;
    transferTypeId: number;
    pickupPointId: number;
    destinationId: number;
    adults: number;
    kids: number;
    free: number;
    remarks: string;
    user: string;
}
