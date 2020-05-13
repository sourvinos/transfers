import { KeyValuePair } from 'src/app/shared/classes/model-keyValuePair';

export class PickupPoint extends KeyValuePair {
    description: string
    route: {
        id: number
        description: string
    }
    exactPoint: string
    time: string
    isActive: boolean
}
