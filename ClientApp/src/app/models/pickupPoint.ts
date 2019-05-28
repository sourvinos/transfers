import { IRoute } from "./route";

export interface IPickupPoint {
    id: number
    route: IRoute
    description: string
    exactPoint: string
    time: string
    user: string
}
