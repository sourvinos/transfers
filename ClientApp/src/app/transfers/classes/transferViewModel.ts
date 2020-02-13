import { Transfer } from "./transfer";

export class TransferViewModel {
	persons: number
	transfers: Transfer[]
	personsPerCustomer: number[]
	personsPerDestination: number[]
	personsPerRoute: number[]
}
