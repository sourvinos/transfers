import { Injectable } from '@angular/core'

@Injectable({ providedIn: 'root' })

export class MessageService {

    public askConfirmationToAbortEditing() { return 'If you continue, changes will be lost.' }
    public askConfirmationToDelete() { return 'If you continue, this record will be lost for ever.' }
    public showAddedRecord() { return 'Record saved.' }
    public showUpdatedRecord() { return 'Record updated.' }
    public showDeletedRecord() { return 'Record deleted.' }
    public showNotFoundRecord() { return 'This record was not found.' }

}
