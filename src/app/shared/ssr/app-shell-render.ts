import { OnInit, Directive, ViewContainerRef, Inject, TemplateRef, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';

@Directive({
    selector: '[appShellRender]'
})
export class AppShellRenderDirective implements OnInit {

    constructor(
        private viewContainer: ViewContainerRef,
        private templateRef: TemplateRef<any>,
        @Inject(PLATFORM_ID) private platformId) { }

    ngOnInit() {
        if (isPlatformServer(this.platformId)) {
            this.viewContainer.createEmbeddedView(this.templateRef);
        }
        else {
            this.viewContainer.clear();
        }
    }
}
