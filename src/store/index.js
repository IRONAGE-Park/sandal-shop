import { combineReducers } from "redux";
import { all } from "redux-saga/effects";

import user, { userSaga } from './user';
import operation, { operationSaga } from './operation';
import company, { company_saga } from './company';
import menu, { menuSaga } from './menu';
import notice from './notice';
import date from './date';
import dialog from './dialog';
import loading from './loading';

const rootReducer = combineReducers({
    loading,
    dialog,
    date,
    company,
    notice,
    operation,
    menu,
    user,
});

export function* rootSaga() {
    yield all([userSaga(), operationSaga(), menuSaga() ,company_saga()]);
}

export default rootReducer;
