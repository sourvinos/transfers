import { ITransfer } from "../transfers/classes/model-transfer";

export interface IQueryResult {
	persons: number
	transfers: ITransfer[]
	personsPerCustomer: number[]
	personsPerDestination: number[]
	personsPerRoute: number[]
}
