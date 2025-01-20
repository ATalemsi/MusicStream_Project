import {ApplicationConfig} from '@angular/core';
import {provideRouter, withViewTransitions} from '@angular/router';

import {routes} from './app.routes';
import {provideStore} from '@ngrx/store';
import {provideEffects} from '@ngrx/effects';
import {TrackEffects} from "./features/store/track/track.effects";
import {trackReducer} from "./features/store/track/track.reducer";
import {provideAnimations} from "@angular/platform-browser/animations";
import {provideImageKitLoader} from "@angular/common";
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {authInterceptor} from "./interceptors/auth.interceptors";
import {authReducer} from "./features/store/auth/auth.reducer";
import {AuthEffects} from "./features/store/auth/auth.effects";
import {albumReducer} from "./features/store/album/album.reducer";
import {AlbumEffects} from "./features/store/album/album.effects";
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes , withViewTransitions()),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideStore({tracks: trackReducer, auth: authReducer  , albums: albumReducer}),
    provideEffects([TrackEffects , AuthEffects , AlbumEffects ]),
    provideAnimations(),
    provideImageKitLoader('https://res.cloudinary.com/dz4pww2qv')]
};
