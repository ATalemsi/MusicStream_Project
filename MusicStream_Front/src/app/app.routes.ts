import { Routes } from '@angular/router';
import {AuthGuard} from "./guards/auth.guard";

export const routes: Routes = [
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./features/auth/register/register.component').then(m => m.RegisterComponent)
      }
    ]
  },
  {
    path: 'library',
    loadComponent: () =>
      import('./features/library/pages/library-page/library-page.component').then(m => m.LibraryPageComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'track/add',
    loadComponent: () =>
      import('./features/track/pages/add-track/add-track.component').then(m => m.AddTrackComponent),
  },
  {
    path: 'track/:id',
    loadComponent: () =>
      import('./features/track/components/track-detail/track-detail.component').then(m => m.TrackDetailComponent),
  },
  {
    path: 'track/edit/:id',
    loadComponent: () =>
      import('./features/track/pages/update-track/update-track.component').then(m => m.UpdateTrackComponent),
  },
  { path: '**', redirectTo: 'auth/login' },
  {
    path: '',
    redirectTo: 'library',
    pathMatch: 'full'
  }
];
