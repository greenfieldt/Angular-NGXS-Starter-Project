import { State, Action, StateContext } from '@ngxs/store';
import {
    ChangeLanguage,
    ChangePageAnimationsDisabled,
    ChangeTheme,
    ChangeStickyHeader,
    ChangePageAnimations,
    ChangeElementAnimations
} from './setting.actions';
import { TranslateService } from '@ngx-translate/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { AnimationService } from '../animations/animation.service';
import { Router, ActivationEnd } from '@angular/router';
import { tap, filter, take } from 'rxjs/operators'
import { TitleService } from '../title/title.service';


export const NIGHT_MODE_THEME = 'dark-theme';
export const DEFAULT_THEME = 'default-theme';

export type Theme = 'default-theme' | 'dark-theme';
export const themes: Theme[] = ['default-theme', 'dark-theme'];


export type Language = 'en' | 'es';
export const languages: Language[] = ['en', 'es'];

export interface SettingsStateModel {
    language: Language;
    theme: string;
    autoNightMode: boolean;
    nightTheme: string;
    stickyHeader: boolean;
    pageAnimations: boolean;
    pageAnimationsDisabled: boolean;
    elementsAnimations: boolean;
    hour: number;
}


@State<SettingsStateModel>({
    name: 'settings',
    defaults: {
        language: 'en',
        theme: DEFAULT_THEME,
        autoNightMode: false,
        nightTheme: NIGHT_MODE_THEME,
        stickyHeader: true,
        pageAnimations: true,
        pageAnimationsDisabled: false,
        elementsAnimations: true,
        hour: 1,
    }
})
export class SettingState {
    constructor(private translate: TranslateService,
        private title: TitleService,
        private overlayContainer: OverlayContainer,
        private animationService: AnimationService,
        private router: Router) {
        console.log("SettingState starting");
    }

    @Action(ChangeLanguage)
    changeLanguage(ctx: StateContext<SettingsStateModel>, action: ChangeLanguage) {
        this.translate.setDefaultLang('en');
        this.translate.use(action.payload);

        this.router.events.pipe(
            filter(event => event instanceof ActivationEnd),
            tap(() => {
                this.title.setTitle(
                    this.router.routerState.snapshot.root,
                    this.translate
                );
            }),
            take(1)
        ).subscribe();

    }

    @Action(ChangePageAnimationsDisabled)
    changePageAnimationsDisabled(ctx: StateContext<SettingsStateModel>, action: ChangePageAnimationsDisabled) {
        ctx.patchState({ pageAnimationsDisabled: action.payload });
    }

    @Action(ChangeTheme)
    changeTheme(ctx: StateContext<SettingsStateModel>, action: ChangeTheme) {

        ctx.patchState({ theme: action.payload });

        const classList = this.overlayContainer.getContainerElement().classList;
        const toRemove = Array.from(classList)
            .filter((item: string) => item.includes('-theme'));

        if (toRemove.length) {
            classList.remove(...toRemove);
        }

        classList.add(ctx.getState().theme);
    }

    @Action(ChangeStickyHeader)
    changeStickyHeader(ctx: StateContext<SettingsStateModel>, action: ChangeStickyHeader) {
        ctx.patchState({ stickyHeader: action.payload });
    }

    @Action(ChangePageAnimations)
    changePageAnimations(ctx: StateContext<SettingsStateModel>, action: ChangePageAnimations) {
        ctx.patchState({ pageAnimations: action.payload });
        this.animationService.updateRouteAnimationType(
            ctx.getState().pageAnimations,
            ctx.getState().elementsAnimations);

    }


    @Action(ChangeElementAnimations)
    changeElementAnimations(ctx: StateContext<SettingsStateModel>, action: ChangeElementAnimations) {
        ctx.patchState({ elementsAnimations: action.payload });
        this.animationService.updateRouteAnimationType(
            ctx.getState().pageAnimations,
            ctx.getState().elementsAnimations);

    }

}
