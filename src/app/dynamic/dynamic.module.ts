import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogpostComponent } from './blogpost/blogpost.component';
import { DynamicHomeComponent } from './dynamichome/dynamichome.component';
import { SharedModule } from '../shared/shared.module';
import { DynamicRoutingModule } from './dynamic-routing.module';

import { MarkdownModule } from 'ngx-markdown';

@NgModule({
    declarations: [BlogpostComponent, DynamicHomeComponent],
    imports: [
        SharedModule,
        DynamicRoutingModule,
        CommonModule,
        MarkdownModule.forRoot()
    ]
})
export class DynamicModule { }
