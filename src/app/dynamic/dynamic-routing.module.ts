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
            {   //sometimes I put the blog post in assests/blogs and just
                //pass the file name
                path: 'blog/:file',
                component: BlogpostComponent,
                data: { title: 'increate.menu.blog' }
            },
            {   //but mostly I put them at the root level of public github repos
                //and access them with the raw url
                path: 'blog/:repo/:branch/:file',
                component: BlogpostComponent,
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
