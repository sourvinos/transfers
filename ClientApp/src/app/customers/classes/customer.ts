import { KeyValuePair } from 'src/app/shared/classes/model-keyValuePair'

export class Customer extends KeyValuePair {
    description: string
    profession: string
    address: string
    phones: string
    personInCharge: string
    email: string
    isActive: boolean
}
