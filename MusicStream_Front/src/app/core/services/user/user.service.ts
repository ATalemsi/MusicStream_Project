import { Injectable } from '@angular/core';

import {environment} from "../../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";

import {UserResponseDTO} from "../../models/user.model";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiUrl = `${environment.apiUrl}/api/admin/users`;

  constructor(private readonly http: HttpClient) {}

  /**
   * Fetches all users from the backend.
   * @returns An observable of a list of UserResponseDTO objects.
   */
  getAllUsers(): Observable<UserResponseDTO[]> {
    return this.http.get<UserResponseDTO[]>(this.apiUrl);
  }

  /**
   * Updates the roles of a specific user.
   * @param id The ID of the user to update.
   * @param roles The new roles to assign to the user.
   * @returns An observable indicating the success of the operation.
   */
  updateUserRoles(id: string, roles: string[]): Observable<void> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' }); // Set the correct Content-Type
    return this.http.put<void>(`${this.apiUrl}/${id}/roles`, roles, { headers });
  }
}
