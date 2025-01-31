import {createAction, props} from "@ngrx/store";
import {UserResponseDTO} from "../../../core/models/user.model";


export const loadUsers = createAction('[User] Load Users');
export const loadUsersSuccess = createAction(
  '[User] Load Users Success',
  props<{ users: UserResponseDTO[] }>()
);
export const loadUsersFailure = createAction(
  '[User] Load Users Failure',
  props<{ error: string }>()
);

export const updateUserRoles = createAction(
  '[User] Update User Roles',
  props<{ id: string; roles: string[] }>()
);

// Action to indicate successful update of user roles
export const updateUserRolesSuccess = createAction(
  '[User] Update User Roles Success'
);

// Action to indicate failure in updating user roles
export const updateUserRolesFailure = createAction(
  '[User] Update User Roles Failure',
  props<{ error: string }>()
);
