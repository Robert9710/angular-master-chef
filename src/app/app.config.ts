import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideState, provideStore } from '@ngrx/store';
import { userReducer } from '../store/user.reducer';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideStore(),
    provideState({ name: 'user', reducer: userReducer }),
  ],
};
