import { Component, OnInit, Inject } from '@angular/core';
import { OverlayRef } from '@angular/cdk/overlay';
import { SPINNER_DATA, SpinnerConfig, SpinnerOverlayRef } from './spinner.overlay';
import { timer } from 'rxjs';
import { tap, take } from 'rxjs/operators';

@Component({
    selector: 'app-spinner',
    templateUrl: './spinner.component.html',
    styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnInit {

    color = 'primary';
    mode = 'determinate';
    value = 50;
    diameter = 50;
    strokeWidth = 10;

    constructor(public spinnerRef: SpinnerOverlayRef,
        @Inject(SPINNER_DATA) public config: SpinnerConfig) {

        console.log(config);

        if (config.defaultTimeOut) {
            this.setTimeOut(config.defaultTimeOut);
        }

        this.mode = config.mode
        this.color = config.color;

        if (config.value) {
            this.value = config.value;
        }

        if (config.diameter) {
            this.diameter = config.diameter;
        }

        if (config.strokeWidth) {
            this.strokeWidth = config.strokeWidth;
        }

    }

    ngOnInit() {
    }

    setTimeOut(timeout: number) {
        timer(timeout).pipe(
            tap(_ => this.spinnerRef.close()),
            take(1),
        ).subscribe();
    }

}
