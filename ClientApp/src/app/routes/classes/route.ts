import { KeyValuePair } from 'src/app/shared/classes/model-keyValuePair'
import { Port } from 'src/app/ports/classes/port'

export class Route extends KeyValuePair {
    abbreviation: string
    port: Port
}
