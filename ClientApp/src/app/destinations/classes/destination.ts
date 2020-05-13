import { KeyValuePair } from 'src/app/shared/classes/model-keyValuePair'

export class Destination extends KeyValuePair {
    abbreviation: string
    description: string
    isActive: boolean
}
