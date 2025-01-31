import {Component, OnInit} from '@angular/core';
import {selectError, selectLoading} from "../../store/album/album.selectors";
import {Store} from "@ngrx/store";
import {selectUsers} from "../../store/user/user.selectors";
import {AsyncPipe, CommonModule, NgIf} from "@angular/common";
import {Observable} from "rxjs";
import {UserResponseDTO} from "../../../core/models/user.model";
import {loadUsers, updateUserRoles} from "../../store/user/user.actions";
import {UserService} from "../../../core/services/user/user.service";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    CommonModule
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit {
  private readonly apiUrl = `${environment.apiUrl}/api/admin/users`;
  users$: Observable<UserResponseDTO[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  constructor(private readonly store: Store ,private readonly userService: UserService ) {
    this.users$ = this.store.select(selectUsers);
    this.loading$ = this.store.select(selectLoading);
    this.error$ = this.store.select(selectError);
  }

  ngOnInit() {
    this.store.dispatch(loadUsers());
  }

  onUpdateRoles(id: string, roles: string[]): void {
    console.log('Updating roles for user:', id);
    console.log('New roles:', roles);
    console.log('Request URL:', `${this.apiUrl}/${id}/roles`);

    // Dispatch the updateUserRoles action
    this.store.dispatch(updateUserRoles({ id, roles }));

    // Optionally, reload users after updating roles
    this.store.dispatch(loadUsers());
  }

}
