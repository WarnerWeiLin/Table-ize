import { Action } from '@ngrx/store'
import { sortStatus } from '../model/sort'

export const ADD_SORTSTATUS       = '[sortStatus] Add'

export class AddSortStatus implements Action {
  readonly type = ADD_SORTSTATUS
  constructor(public payload: sortStatus) {}
}

export type Actions = AddSortStatus