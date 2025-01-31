import {Injectable} from "@angular/core";
import {Actions, createEffect ,ofType} from "@ngrx/effects";
import {UserService} from "../../../core/services/user/user.service";
import {catchError, of, switchMap} from "rxjs";
import {map, mergeMap} from "rxjs/operators";
import {
  loadUsers,
  loadUsersFailure,
  loadUsersSuccess,
  updateUserRoles,
  updateUserRolesFailure,
  updateUserRolesSuccess
} from "./user.actions";

@Injectable()
export class UserEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly userService: UserService
  ) {}

  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadUsers),
      switchMap(() =>
        this.userService.getAllUsers().pipe(
          map((users) => loadUsersSuccess({ users })), // Dispatch success action with updated users
          catchError((error) => of(loadUsersFailure({ error: error.message })))
        )
      )
    )
  );

  updateUserRoles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateUserRoles),
      mergeMap((action) =>
        this.userService.updateUserRoles(action.id, action.roles).pipe(
          map(() => updateUserRolesSuccess()), // Dispatch success action
          catchError((error) => of(updateUserRolesFailure({ error: error.message }))) // Dispatch failure action
        )
      ),
      // Reload users after a successful role update
      switchMap(() => of(loadUsers()))
    )
  );
}
