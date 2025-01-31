import {UserResponseDTO} from "../../../core/models/user.model";

export interface UserState {
  users: UserResponseDTO[];
  loading: boolean;
  error: string | null;
}

export const initialUserState: UserState = {
  users: [],
  loading: false,
  error: null,
};
