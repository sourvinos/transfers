export class Transfer {
    id: number
    dateIn: string
    customer: {
        id: number
        description: string
    }
    pickupPoint: {
        id: number,
        description: string
        time: string,
        route: {
            id: number
            description: string,
            port: {
                id: number,
                description: string
            }
        }
    }
    destination: {
        id: number
        shortDescription: string
        description: string
    }
    driver: {
        id: number,
        description: string
    }
    adults: number
    kids: number
    free: number
    totalPersons: number
    remarks: string
    userId: string
}
