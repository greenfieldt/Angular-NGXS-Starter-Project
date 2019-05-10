import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogpostComponent } from './blogpost/blogpost.component';
import { DynamicHomeComponent } from './dynamichome/dynamichome.component';
import { SharedModule } from '../shared/shared.module';
import { DynamicRoutingModule } from './dynamic-routing.module';

import { MarkdownModule } from 'ngx-markdown';
import { PlayingWithTechComponent } from './playing-with-tech/playing-with-tech.component';
import { LoginComponent } from './login/login.component';
import { PasswordComponent } from './password/password.component';
import { ContactComponent } from './contact/contact.component';

@NgModule({
    declarations: [BlogpostComponent, DynamicHomeComponent, PlayingWithTechComponent, LoginComponent, PasswordComponent, ContactComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    exports: [LoginComponent],
    entryComponents: [LoginComponent],
    imports: [
        SharedModule,
        DynamicRoutingModule,
        CommonModule,
        MarkdownModule.forRoot()
    ]
})
export class DynamicModule { }
