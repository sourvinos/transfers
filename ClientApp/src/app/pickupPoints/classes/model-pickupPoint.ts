import { IRoute } from "src/app/models/route";

export interface IPickupPoint {
    id: number
    route: {
        id: number
        description: string
    }
    description: string
    exactPoint: string
    time: string
    userName: string
}
