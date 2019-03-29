import { State, Action, StateContext } from '@ngxs/store';
import { tap, map, scan, first, mergeMap, distinctUntilChanged } from 'rxjs/operators';
import { pipe, Observable, of, Subscription } from 'rxjs';
import {
    ChangeLanguage,
    ChangePageAnimationsDisabled,
    ChangeTheme,
    ChangeStickyHeader
} from './setting.actions';
import { TranslateService } from '@ngx-translate/core';
import { produce } from 'immer';
import { OverlayContainer } from '@angular/cdk/overlay';



export const NIGHT_MODE_THEME = 'BLACK-THEME';
export const DAY_MODE_THEME = 'default-theme';

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
        theme: DAY_MODE_THEME,
        autoNightMode: false,
        nightTheme: NIGHT_MODE_THEME,
        stickyHeader: true,
        pageAnimations: true,
        pageAnimationsDisabled: true,
        elementsAnimations: true,
        hour: 1,
    }
})
export class SettingState {
    constructor(private translate: TranslateService, private overlayContainer: OverlayContainer) {
        console.log("SettingState starting");
    }

    @Action(ChangeLanguage)
    changeLanguage(ctx: StateContext<SettingsStateModel>, action: ChangeLanguage) {
        this.translate.setDefaultLang('en');
        this.translate.use(action.payload);
    }

    @Action(ChangePageAnimationsDisabled)
    changePageAnimationss(ctx: StateContext<SettingsStateModel>, action: ChangePageAnimationsDisabled) {
        ctx.patchState({ pageAnimationsDisabled: action.payload });
    }

    @Action(ChangeTheme)
    changeTheme(ctx: StateContext<SettingsStateModel>, action: ChangeTheme) {
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
}
