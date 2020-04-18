import { Injectable } from '@angular/core'

@Injectable({ providedIn: 'root' })

export class MessageService {

    public showAddedRecord() { return 'Record created.' }
    public showUpdatedRecord() { return 'Record updated.' }
    public showDeletedRecord() { return 'Record deleted.' }
    public showNotFoundRecord() { return 'Record not found.' }
    public askConfirmationToAbortEditing() { return 'If you continue, changes will be lost.' }
    public askConfirmationToDelete() { return 'If you continue, this record will be lost for ever.' }
    public recordIsInUse() { return 'Record is in use and can not be deleted.' }

}
