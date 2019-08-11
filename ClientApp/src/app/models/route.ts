import { IPort } from "./port";

export interface IRoute {
    id: number
    shortDescription: string
    description: string
    port: IPort
    isSelected: boolean
    userName: string
}
