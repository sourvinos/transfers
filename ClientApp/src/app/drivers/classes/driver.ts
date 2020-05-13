import { KeyValuePair } from '../../shared/classes/model-keyValuePair';

export class Driver extends KeyValuePair {
    description: string
    phones: string
    isDefault: boolean
    isActive: boolean
}
