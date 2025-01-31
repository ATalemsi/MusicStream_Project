import { createReducer, on } from '@ngrx/store';
import { UserState, initialUserState } from './user.state';
import {
  loadUsers,
  loadUsersSuccess,
  loadUsersFailure,
  updateUserRolesSuccess,
  updateUserRolesFailure
} from './user.actions';

export const userReducer = createReducer(
  initialUserState,
  on(loadUsers, (state) => ({ ...state, loading: true, error: null })),
  on(loadUsersSuccess, (state, { users }) => ({
    ...state,
    users,
    loading: false,
  })),
  on(loadUsersFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(updateUserRolesSuccess, (state) => ({
    ...state,
    loading: false,
    error: null,
  })),
  on(updateUserRolesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
