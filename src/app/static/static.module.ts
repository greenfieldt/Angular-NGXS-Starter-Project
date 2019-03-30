import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StaticRoutingModule } from './static-routing.module';
import { SharedModule } from '../shared/shared.module';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';

@NgModule({
    declarations: [HomeComponent, AboutComponent],
    imports: [
        SharedModule,
        StaticRoutingModule
    ]
})
export class StaticModule { }
