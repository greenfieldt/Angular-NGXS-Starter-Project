import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StaticRoutingModule } from './static-routing.module';
import { SharedModule } from '../shared/shared.module';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { LoginComponent } from './login/login.component';
import { PasswordComponent } from './password/password.component';
import { ModalContainerComponent } from './modal-container/modal-container.component';

@NgModule({
    declarations: [HomeComponent,
        AboutComponent,
        LoginComponent,
        PasswordComponent,
        ModalContainerComponent],
    entryComponents: [LoginComponent, PasswordComponent],

    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    imports: [
        SharedModule,
        StaticRoutingModule
    ]
})
export class StaticModule { }
