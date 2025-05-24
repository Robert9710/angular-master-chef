import { createReducer, on } from '@ngrx/store';
import { setUserName } from './user.actions';

export interface UserState {
  userName: string;
}

export const initialUserState: UserState = {
  userName: sessionStorage.getItem('userName') || '',
};

export const userReducer = createReducer(
  initialUserState,
  on(setUserName, (state, { userName }) => ({ ...state, userName: userName }))
);
