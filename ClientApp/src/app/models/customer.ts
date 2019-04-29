import { KeyValuePair } from './keyValuePair';

export interface ICustomer {
    id: number;
    description: string;
    profession: string;
    taxOffice: KeyValuePair;
    vatState: KeyValuePair;
    address: string
    phones: string
    personInCharge: string
    email: string
    taxNo: string
    accountCode: string
    user: string
}
