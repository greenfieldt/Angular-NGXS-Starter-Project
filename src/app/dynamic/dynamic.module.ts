import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogpostComponent } from './blogpost/blogpost.component';
import { DynamicHomeComponent } from './dynamichome/dynamichome.component';
import { SharedModule } from '../shared/shared.module';
import { DynamicRoutingModule } from './dynamic-routing.module';

import { MarkdownModule } from 'ngx-markdown';
import { PlayingWithTechComponent } from './playing-with-tech/playing-with-tech.component';

@NgModule({
    declarations: [BlogpostComponent, DynamicHomeComponent, PlayingWithTechComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    imports: [
        SharedModule,
        DynamicRoutingModule,
        CommonModule,
        MarkdownModule.forRoot()
    ]
})
export class DynamicModule { }
