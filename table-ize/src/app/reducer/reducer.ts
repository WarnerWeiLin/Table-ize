import { Action } from '@ngrx/store'
import { sortStatus } from '../model/sort'
import * as SortActions from './../actions/sort.actions'

// Section 1
const preCache = {
    active: 'id',
    direction: 'desc'
}

const initialState: sortStatus = JSON.parse(localStorage.getItem('status')) || preCache

// Section 2
export function reducer(state: sortStatus[] = [initialState], action: SortActions.Actions) {


    // Section 3
    switch(action.type) {
        case SortActions.ADD_SORTSTATUS:
            var newState = [...state, action.payload];
            let  stringStatus = JSON.stringify(action.payload)
            localStorage.setItem('status', stringStatus)
            return newState;
        default:
            return state;
    }
}