import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { AuthGuardService } from '../shared/auth-guard/auth-guard.service';
import { LoginComponent } from './login/login.component';
import { ModalContainerComponent } from './modal-container/modal-container.component';


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

