import { createSelector } from '@ngrx/store';
import { AppState } from '../app/app.state';

export const selectUserState = (state: AppState) => state.user;
export const selectUsername = createSelector(
  selectUserState,
  (state) => state.userName
);
