import { ITransfer } from"./transfer";

export interface IQueryResult {
	persons: number
	transfers: ITransfer[]
	personsPerCustomer: number[]
	personsPerDestination: number[]
	personsPerRoute: number[]
}
