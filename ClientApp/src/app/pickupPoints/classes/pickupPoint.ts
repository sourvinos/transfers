import { KeyValuePair } from 'src/app/shared/classes/model-keyValuePair';

export class PickupPoint {
    id: number
    description: string
    route: {
        id: number
        abbreviation: string
    }
    exactPoint: string
    time: string
    userName: string
}
