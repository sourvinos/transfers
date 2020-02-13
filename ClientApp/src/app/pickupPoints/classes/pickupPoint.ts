import { KeyValuePair } from "src/app/shared/classes/model-keyValuePair";

export class PickupPoint extends KeyValuePair {
    route: {
        id: number
        description: string
    }
    exactPoint: string
    time: string
    userName: string
}
