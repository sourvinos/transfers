import { KeyValuePair } from 'src/app/shared/classes/model-keyValuePair';

export class PickupPoint extends KeyValuePair {
    route: {
        id: number
        abbreviation: string
    }
    exactPoint: string
    time: string
}
