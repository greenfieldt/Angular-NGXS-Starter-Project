import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DynamicHomeComponent } from './dynamichome/dynamichome.component';
import { BlogpostComponent } from './blogpost/blogpost.component';

const routes: Routes = [
    {
        path: '',
        component: DynamicHomeComponent,
        children: [
            {
                path: '',
                redirectTo: 'blog',
                pathMatch: 'full'
            },
            {
                path: 'blog/:id',
                component: BlogpostComponent,
                pathMatch: 'full',
                data: { title: 'increate.menu.blog' }
            },

        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DynamicRoutingModule { }
