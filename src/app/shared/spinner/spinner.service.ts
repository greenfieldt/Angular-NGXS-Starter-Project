import { Injectable, ComponentRef, Injector, InjectionToken } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { SpinnerComponent } from './spinner.component';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { SPINNER_DATA, SpinnerConfig, SpinnerOverlayRef } from './spinner.overlay';


@Injectable({
    providedIn: 'root'
})
export class SpinnerService {

    OverlaySpinnerConfig = {
        hasBackdrop: true,
        backdropClass: 'dark-backdrop',
        panelClass: '',
        scrollStrategy: this.overlay.scrollStrategies.block(),
        positionStrategy: this.overlay.position()
            .global().centerHorizontally().centerVertically()
    };

    overlayRef: SpinnerOverlayRef;

    constructor(private injector: Injector, private overlay: Overlay) { }

    open(config: SpinnerConfig) {

        const _overlayRef = this.overlay.create(this.OverlaySpinnerConfig);

        this.overlayRef = new SpinnerOverlayRef(_overlayRef);

        const injector = this.createInjector(config, this.overlayRef);

        const spinnerPortal = new ComponentPortal(SpinnerComponent, null, injector);

        const containerRef: ComponentRef<SpinnerComponent> =
            _overlayRef.attach(spinnerPortal);

        return containerRef.instance;

    }


    private createInjector(config: SpinnerConfig, spinnerRef: SpinnerOverlayRef)
        : PortalInjector {
        const injectionTokens = new WeakMap();

        //add this one so we can close the spinner
        injectionTokens.set(SpinnerOverlayRef, spinnerRef);
        //add this one to pass the config
        injectionTokens.set(SPINNER_DATA, config);

        return new PortalInjector(this.injector, injectionTokens);
    }
}
