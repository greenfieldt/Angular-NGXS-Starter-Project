import { OnInit, Directive, ViewContainerRef, Inject, TemplateRef, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';


@Directive({
    selector: '[appshellnorender]'
})
export class AppShellNoRenderDirective implements OnInit {

    constructor(
        private viewContainer: ViewContainerRef,
        private templateRef: TemplateRef<any>,
        @Inject(PLATFORM_ID) private platformId) {
        console.log("Inside AppShellNoRender");
    }

    ngOnInit() {
        if (isPlatformServer(this.platformId)) {
            console.log("App Shell No render -- Is Server");
            this.viewContainer.clear();
        }
        else {
            console.log("App Shell No render -- Is Browser");
            this.viewContainer.createEmbeddedView(this.templateRef);
        }
    }
}
