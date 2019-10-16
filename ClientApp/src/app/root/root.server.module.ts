import { ModuleMapLoaderModule } from '@nguniversal/module-map-ngfactory-loader'
import { NgModule } from '@angular/core'
import { ServerModule } from '@angular/platform-server'

import { AppModule } from '../root/app.module'
import { RootComponent } from '../root/root.component'

@NgModule({
    imports: [AppModule, ServerModule, ModuleMapLoaderModule],
    bootstrap: [RootComponent]
})

export class AppServerModule { }
