import { Transfer } from "./model-transfer";

export class QueryResult {
	persons: number
	transfers: Transfer[]
	personsPerCustomer: number[]
	personsPerDestination: number[]
	personsPerRoute: number[]
}
