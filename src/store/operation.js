import { createAction, handleActions } from 'redux-actions';
import { call, put, takeLatest} from 'redux-saga/effects';
import { requestGETManageInfo, requestPUTManageHoliday, requestPUTManageTime } from '../api/manage';
import { finishLoading, startLoading } from './loading';

const GET_OPERATION = 'operation/GET_OPERATION';
const GET_OPERATION_SUCCESS = 'operation/GET_OPERATION_SUCCESS';
const GET_OPERATION_FAILURE = 'operation/GET_OPERATION_FAILURE';

const UPDATE_OPERATION_TIME = 'operation/UPDATE_OPERATION_TIME';
const UPDATE_OPERATION_TIME_SUCCESS = 'operation/UPDATE_OPERATION_TIME_SUCCESS';
const UPDATE_OPERATION_TIME_FAILURE = 'operation/UPDATE_OPERATION_TIME_FAILURE';

const UPDATE_OPERATION_HOLI = 'operation/UPDATE_OPERATION_HOLI';
const UPDATE_OPERATION_HOLI_SUCCESS = 'operation/UPDATE_OPERATION_HOLI_SUCCESS';
const UPDATE_OPERATION_HOLI_FAILURE = 'operation/UPDATE_OPERATION_HOLI_FAILURE';

export const getOperation = createAction(GET_OPERATION);
export const updateOperationTime = createAction(UPDATE_OPERATION_TIME);
export const updateOperationHoli = createAction(UPDATE_OPERATION_HOLI)

function *getOperationSaga(action) {
    yield put(startLoading(GET_OPERATION));
    try {
        const { payload: JWT_TOKEN } = action;
        const result = yield call(requestGETManageInfo, JWT_TOKEN);
        if (result.data.msg === "성공") {
            yield put({
                type: GET_OPERATION_SUCCESS,
                payload: result.data.query
            });
        } else {
            yield put({
                type: GET_OPERATION_FAILURE,
                payload: result.data.msg,
                error: true
            });
        }
    } catch (e) {
        yield put({
            type: GET_OPERATION_FAILURE,
            payload: e,
            error: true
        });
    }
    yield put(finishLoading(GET_OPERATION));
}

function *updateOperationTimeSaga(action) {
    yield put(startLoading(UPDATE_OPERATION_TIME));
    try {
        const {
            JWT_TOKEN,
            timeObject
        } = action.payload;
        const result = yield call(requestPUTManageTime, JWT_TOKEN, timeObject);
        if (result.data.msg === "성공") {
            yield put({
                type: UPDATE_OPERATION_TIME_SUCCESS,
                payload: timeObject
            });
        } else {
            yield put({
                type: UPDATE_OPERATION_TIME_FAILURE,
                payload: result.data.msg,
                error: true
            });
        }
    } catch (e) {
        yield put({
            type: UPDATE_OPERATION_TIME_FAILURE,
            payload: e,
            error: true
        });
    }
    yield put(finishLoading(UPDATE_OPERATION_TIME));
}

function *updateOperationHoliSaga(action) {
    yield put(startLoading(UPDATE_OPERATION_HOLI));
    try {
        const {
            JWT_TOKEN,
            holiObject
        } = action.payload;
        console.log(holiObject)
        const result = yield call(requestPUTManageHoliday, JWT_TOKEN, holiObject);
        console.log(result);
        if (result.data.msg === "성공") {
            yield put({
                type: UPDATE_OPERATION_HOLI_SUCCESS,
                payload: holiObject
            });
        } else {
            yield put({
                type: UPDATE_OPERATION_HOLI_FAILURE,
                payload: result.data.msg,
                error: true
            });
        }
    } catch (e) {
        yield put({
            type: UPDATE_OPERATION_HOLI_FAILURE,
            payload: e,
            error: true
        });
    }
    yield put(finishLoading(UPDATE_OPERATION_HOLI));
}

export function *operationSaga() {
    yield takeLatest(GET_OPERATION, getOperationSaga);
    yield takeLatest(UPDATE_OPERATION_TIME, updateOperationTimeSaga);
    yield takeLatest(UPDATE_OPERATION_HOLI, updateOperationHoliSaga);
}

const initialState = {};
const operation = handleActions(
    {
        [GET_OPERATION_SUCCESS]: (state, action) => ({
            ...state,
            ...action.payload
        }),
        [UPDATE_OPERATION_TIME_SUCCESS]: (state, action) => ({
            ...state,
            ...action.payload
        }),
        [UPDATE_OPERATION_HOLI_SUCCESS]: (state, action) => ({
            ...state,
            ...action.payload
        })
    },
    initialState
);

export default operation;