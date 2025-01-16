import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { AuthState } from '../features/store/auth/auth.reducer';
import {take} from "rxjs";

export const AuthGuard = () => {
  const store = inject(Store<{ auth: AuthState }>);
  const router = inject(Router);

  return store.select(state => state.auth).pipe(
    take(1),
    map(authState => {
      console.log('Auth State in Guard:', authState); // Debug log
      if (authState.isAuthenticated) {
        return true;
      }

      router.navigate(['/login']);
      return false;
    })
  );
};
