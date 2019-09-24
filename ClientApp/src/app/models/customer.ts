import { ITaxOffice } from"./taxOffice";
import { IVatState } from"./vatState";

export interface ICustomer {
    id: number
    description: string
    profession: string
    taxOffice: ITaxOffice
    vatState: IVatState
    address: string
    phones: string
    personInCharge: string
    email: string
    taxNo: string
    accountCode: string
    isSelected: boolean
    userName: string
}
