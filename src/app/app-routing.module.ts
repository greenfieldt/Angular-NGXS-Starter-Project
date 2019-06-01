import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from './static/not-found/not-found.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'blog',
        loadChildren: './dynamic/dynamic.module#DynamicModule'
    },
    {
        path: 'blog.html',
        loadChildren: './dynamic/dynamic.module#DynamicModule'
    },
    {
        path: '**',
        component: NotFoundComponent,
        data: { title: 'increate.title.notfound' },

    },

];

@NgModule({
    imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
