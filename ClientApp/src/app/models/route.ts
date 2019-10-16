import { IPort } from "./port"

export interface IRoute {
    id: number
    abbreviation: string
    description: string
    port: IPort
    isSelected: boolean
    userName: string
}
