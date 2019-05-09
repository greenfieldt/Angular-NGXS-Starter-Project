import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogpostComponent } from './blogpost/blogpost.component';
import { DynamicHomeComponent } from './dynamichome/dynamichome.component';

@NgModule({
    declarations: [BlogpostComponent, DynamicHomeComponent],
    imports: [
        CommonModule
    ]
})
export class DynamicModule { }
