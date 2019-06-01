import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StaticRoutingModule } from './static-routing.module';
import { SharedModule } from '../shared/shared.module';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ModalContainerComponent } from './modal-container/modal-container.component';
import { SetPasswordComponent } from './set-password/set-password.component';
import { SigninComponent } from './signin/signin.component';
import { FeaturesComponent } from './features/features.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { ContactComponent } from './contact/contact.component';
import { OurworkComponent } from './ourwork/ourwork.component';
import { TechnologyComponent } from './technology/technology.component';
import { ServicesComponent } from './services/services.component';
import { BlogBannerComponent } from './blog-banner/blog-banner.component';
import { NotFoundComponent } from './not-found/not-found.component';

@NgModule({
    declarations: [HomeComponent,
        AboutComponent,
        LoginComponent,
        ForgotPasswordComponent,
        ModalContainerComponent,
        SetPasswordComponent,
        SigninComponent,
        FeaturesComponent,
        ContactUsComponent,
        ContactComponent,
        OurworkComponent,
        TechnologyComponent,
        ServicesComponent,
        BlogBannerComponent,
        NotFoundComponent],
    entryComponents: [LoginComponent,
        ForgotPasswordComponent,
        SetPasswordComponent,
        SigninComponent],

    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    imports: [
        SharedModule,
        StaticRoutingModule
    ]
})
export class StaticModule { }
