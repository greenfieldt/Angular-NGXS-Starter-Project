import { OnInit, Directive, ViewContainerRef, Inject, TemplateRef, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';

@Directive({
    selector: '[appShellRender]'
})
export class AppShellRenderDirective implements OnInit {

    constructor(
        private viewContainer: ViewContainerRef,
        private templateRef: TemplateRef<any>,
        @Inject(PLATFORM_ID) private platformId) {
        console.log("App Shell Render contructor");
    }

    ngOnInit() {
        if (isPlatformServer(this.platformId)) {
            console.log("App Shell Render is server");
            this.viewContainer.createEmbeddedView(this.templateRef);
        }
        else {
            console.log("App Shell Render is browser");
            this.viewContainer.clear();
        }
    }
}
