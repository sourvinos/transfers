import { KeyValuePair } from "src/app/shared/classes/model-keyValuePair";

export interface IPickupPoint extends KeyValuePair {
    route: {
        id: number
        description: string
    }
    exactPoint: string
    time: string
    userName: string
}
