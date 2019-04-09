import {
    animate,
    query,
    style,
    transition,
    trigger,
    stagger,
    sequence
} from '@angular/animations';
import { AnimationService } from './animation.service';

export const ROUTE_ANIMATIONS_ELEMENTS = 'route-animations-elements';

const STEPS_ALL: any[] = [
    query(':enter > *', style({ opacity: 0, position: 'unset' }), {
        optional: true
    }),
    query(':enter .' + ROUTE_ANIMATIONS_ELEMENTS, style({ opacity: 0 }), {
        optional: true
    }),
    sequence([
        query(
            ':leave > *',
            [
                style({ transform: 'translateY(0%)', opacity: 1 }),
                animate(
                    '0.2s ease-in-out',
                    style({ transform: 'translateY(-3%)', opacity: 0 })
                ),
                style({ position: 'unset' })
            ],
            { optional: true }
        ),
        query(
            ':enter > *',
            [
                style({
                    transform: 'translateY(-3%)',
                    opacity: 0,
                    position: 'static'
                }),
                animate(
                    '0.5s ease-in-out',
                    style({ transform: 'translateY(0%)', opacity: 1 })
                )
            ],
            { optional: true }
        )
    ]),
    query(
        ':enter .' + ROUTE_ANIMATIONS_ELEMENTS,
        stagger(75, [
            style({ transform: 'translateY(10%)', opacity: 0 }),
            animate(
                '0.5s ease-in-out',
                style({ transform: 'translateY(0%)', opacity: 1 })
            )
        ]),
        { optional: true }
    )
];
const STEPS_NONE = [];
const STEPS_PAGE = [STEPS_ALL[0], STEPS_ALL[2]];
const STEPS_ELEMENTS = [STEPS_ALL[1], STEPS_ALL[3]];

export const routeAnimations = trigger('routeAnimations', [
    transition(isRouteAnimationsAll, STEPS_ALL),
    transition(isRouteAnimationsNone, STEPS_NONE),
    transition(isRouteAnimationsPage, STEPS_PAGE),
    transition(isRouteAnimationsElements, STEPS_ELEMENTS)
]);

export function isRouteAnimationsAll() {
    return AnimationService.isRouteAnimationsType('ALL');
}

export function isRouteAnimationsNone() {
    return AnimationService.isRouteAnimationsType('NONE');
}

export function isRouteAnimationsPage() {
    return AnimationService.isRouteAnimationsType('PAGE');
}

export function isRouteAnimationsElements() {
    return AnimationService.isRouteAnimationsType('ELEMENTS');
}
