import {createFeatureSelector, createSelector} from '@ngrx/store';
import { UserState } from './user.state';
import {TrackState} from "../track/track.selectors";

export const selectUserState = createFeatureSelector<UserState>('user');

export const selectUsers = createSelector(
  selectUserState,
  (state) => state.users
);

export const selectLoading = createSelector(
  selectUserState,
  (state) => state.loading
);

export const selectError = createSelector(
  selectUserState,
  (state) => state.error
);
