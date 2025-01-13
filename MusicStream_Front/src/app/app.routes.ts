import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'library',
    loadComponent: () =>
      import('./features/library/pages/library-page/library-page.component').then(m => m.LibraryPageComponent),
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
  {
    path: '',
    redirectTo: 'library',
    pathMatch: 'full',
  },
];
