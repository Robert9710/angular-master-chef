import { createAction, props } from '@ngrx/store';

export const setUserName = createAction(
  '[User Component] SetUserName',
  props<{ userName: string }>()
);
