import { Injectable } from '@angular/core';

@Injectable()
export class AnimationService {
    constructor() {
        AnimationService.routeAnimationType = 'NONE';
    }

    private static routeAnimationType: RouteAnimationType = 'NONE';

    static isRouteAnimationsType(type: RouteAnimationType) {
        return AnimationService.routeAnimationType === type;
    }

    updateRouteAnimationType(
        pageAnimations: boolean,
        elementsAnimations: boolean
    ) {
        AnimationService.routeAnimationType =
            pageAnimations && elementsAnimations
                ? 'ALL'
                : pageAnimations
                    ? 'PAGE'
                    : elementsAnimations
                        ? 'ELEMENTS'
                        : 'NONE';
    }
}

export type RouteAnimationType = 'ALL' | 'PAGE' | 'ELEMENTS' | 'NONE';
