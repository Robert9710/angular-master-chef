import { createSelector } from '@ngrx/store';
import { AppState } from '../app/appState';

export const selectUserState = (state: AppState) => state.user;
export const selectUser = createSelector(
  selectUserState,
  (state) => state.userName
);
