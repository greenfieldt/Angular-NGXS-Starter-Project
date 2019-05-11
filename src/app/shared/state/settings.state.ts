import { State, Action, StateContext } from '@ngxs/store';
import {
    ChangeLanguage,
    ChangePageAnimationsDisabled,
    ChangeTheme,
    ChangeStickyHeader,
    ChangePageAnimations,
    ChangeElementAnimations,
    InitializeSettings
} from './setting.actions';
import { TranslateService } from '@ngx-translate/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { AnimationService } from '../animations/animation.service';
import { Router, ActivationEnd } from '@angular/router';
import { tap, filter, take } from 'rxjs/operators'
import { TitleService } from '../title/title.service';

export const DEFAULT_THEME = 'default-theme';


export type Theme = 'default-theme' | 'dark-theme';
export const themes: any = //['default-theme', 'dark-theme'];
    [
        {
            primary: '#283593',
            accent: '#03a9f4',
            name: 'default-theme',
            isDark: false,
        },
        {
            primary: '#212529',
            accent: '#303030',
            name: 'dark-theme',
            isDark: true,
        }
    ];

export type Language = 'en' | 'es';
export const languages: Language[] = ['en', 'es'];

export interface SettingsStateModel {
    language: Language;
    theme: string;
    stickyHeader: boolean;
    pageAnimations: boolean;
    pageAnimationsDisabled: boolean;
    elementsAnimations: boolean;
}


@State<SettingsStateModel>({
    name: 'settings',
    defaults: {
        language: 'en',
        theme: DEFAULT_THEME,
        stickyHeader: true,
        pageAnimations: true,
        pageAnimationsDisabled: false,
        elementsAnimations: true,
    }
})
export class SettingState {
    constructor(private translate: TranslateService,
        private title: TitleService,
        private overlayContainer: OverlayContainer,
        private animationService: AnimationService,
        private router: Router) {


        //        console.log("SettingState starting");

    }

    @Action(InitializeSettings)
    initializeSettings(ctx: StateContext<SettingsStateModel>) {
        this.translate.setDefaultLang('en');
        this.translate.use(ctx.getState().language);

        //Set the default theme during the initial page load
        const classList = this.overlayContainer.getContainerElement().classList;
        const toRemove = Array.from(classList)
            .filter((item: string) => item.includes('-theme'));

        if (toRemove.length) {
            classList.remove(...toRemove);
        }
        classList.add(ctx.getState().theme);


    }

    @Action(ChangeLanguage)
    changeLanguage(ctx: StateContext<SettingsStateModel>, action: ChangeLanguage) {
        this.translate.use(action.payload);
        this.title.setTitle(
            this.router.routerState.snapshot.root,
            this.translate
        );
        ctx.patchState({ language: action.payload });
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
            .filter((item: string) => item.includes('-skin'));

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
