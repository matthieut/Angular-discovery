import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { definePreset } from '@primeuix/themes'

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    providePrimeNG({
            theme: {
                preset: definePreset(Aura, {
                  semantic: {
                    primary: {
                      50: '{indigo.50}',
                      100: '{indigo.100}',
                      200: '{indigo.200}',
                      300: '{indigo.300}',
                      400: '{indigo.400}',
                      500: '{indigo.500}',
                      600: '{indigo.600}',
                      700: '{indigo.700}',
                      800: '{indigo.800}',
                      900: '{indigo.900}',
                      950: '{indigo.950}',
                    },
                  }
                })
              },
              license: 'eyJpZCI6ImRhYTc3YmY3LTAyZTMtNDZmZC05Nzk4LTBmMGE4MWI1NTkwNyIsInByb2R1Y3QiOiJwcmltZXVpIiwidGllciI6ImNvbW11bml0eSIsInR5cGUiOiJkZXYiLCJpYXQiOjE3ODcwNTg0MTUsImV4cCI6MTgxODU5NDQxNX0.OzP3OPZnKF8BRBSGbEOSmOj1PZM62yR69L9Aq1DByPcklqrW2rKDwOhgEIQ8RQL8rnAF-YKWq1EyTwlMV_V7BQ'
            
        })
  ]
};
