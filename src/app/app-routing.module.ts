import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'dynamic',
        loadChildren: './dynamic/dynamic.module#DynamicModule'
    },
    {
        path: 'process',
        redirectTo: 'dynamic/blog/process/master/overview.md'
    {
        path: '**',
        redirectTo: 'home'
    },

];

@NgModule({
    imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
