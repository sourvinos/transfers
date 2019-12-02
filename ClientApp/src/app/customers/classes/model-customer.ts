import { ITaxOffice } from "../../models/taxOffice"
import { IVatState } from "../../models/vatState"

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
