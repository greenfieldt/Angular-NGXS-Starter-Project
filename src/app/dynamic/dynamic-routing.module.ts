import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DynamicHomeComponent } from './dynamichome/dynamichome.component';

const routes: Routes = [
    {
        path: '',
        component: DynamicHomeComponent,
        children: [
            {
                path: '',
                redirectTo: 'todos',
                pathMatch: 'full'
            },
            {
                path: 'todos',
                component: TodosContainerComponent,
                data: { title: 'anms.examples.menu.todos' }
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DynamicRoutingModule { }
