import { IPickupPoint } from "./pickupPoint";

export interface IRoute {
    id: number;
    shortDescription: string;
    description: string;
    user: string;
    pickupPoints: IPickupPoint[]
}
