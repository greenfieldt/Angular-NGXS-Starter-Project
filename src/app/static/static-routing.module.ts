import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { AuthGuardService } from '../shared/auth-guard/auth-guard.service';
import { LoginComponent } from './login/login.component';
import { ModalContainerComponent } from './modal-container/modal-container.component';
import { Contact } from '../shared/state/contacts.state';
import { ContactComponent } from './contact/contact.component';
import { ServicesComponent } from './services/services.component';
import { OurworkComponent } from './ourwork/ourwork.component';
import { TechnologyComponent } from './technology/technology.component';


const routes: Routes = [
    {
        path: 'home',
        component: HomeComponent,
        data: { title: 'increate.menu.home' }
    },
    {
        path: 'about',
        component: AboutComponent,
        data: { title: 'increate.menu.about' },
        //canActivate: [AuthGuardService]
    },
    {
        path: 'contact',
        component: ContactComponent,
        data: { title: 'increate.menu.contact' },
    },
    {
        path: 'services',
        component: ServicesComponent,
        data: { title: 'increate.menu.services' },
    },
    {
        path: 'ourwork',
        component: OurworkComponent,
        data: { title: 'increate.menu.ourwork' },
    },
    {
        path: 'technology',
        component: TechnologyComponent,
        data: { title: 'increate.menu.technology' },
    },
    {
        path: 'process',
        redirectTo: 'blog/post/process/master/overview.md',
        data: { title: 'increate.menu.blog' },
    },
    {
        path: 'modal/:component',
        component: ModalContainerComponent,
        outlet: 'modal'
    },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class StaticRoutingModule { }

