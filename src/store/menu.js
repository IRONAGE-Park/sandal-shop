import { createAction, handleActions } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { requestGETCategoryList } from '../api/category';
import { requestGETMenuList, requestPUTUpdateMenu } from '../api/menu';
import { finishLoading, startLoading } from './loading';


const GET_CATEGORIES = 'menu/GET_CATEGORIES';
const GET_CATEGORIES_SUCCESS = 'menu/GET_CATEGORIES_SUCCESS';
const GET_CATEGORIES_FAILURE = 'menu/GET_CATEGORIES_FAILURE';

const GET_MENULIST = 'menu/GET_MENULIST';
const GET_MENULIST_SUCCESS = 'menu/GET_MENULIST_SUCCESS';
const GET_MENULIST_FAILURE = 'menu/GET_MENULIST_FAILURE';

const UPDATE_MENU = 'menu/UPDATE_MENU';
const UPDATE_MENU_SUCCESS = 'menu/UPDATE_MENU_SUCCESS';
const UPDATE_MENU_FAILURE = 'menu/UPDATE_MENU_FAILURE';

const DELETE_MENU = 'menu/DELETE_MENU';

export const getCategories = createAction(GET_CATEGORIES);
export const getMenuList = createAction(GET_MENULIST);
export const updateMenu = createAction(UPDATE_MENU);
export const deleteMenu = createAction(DELETE_MENU);

function *getCategoriesSaga(action) {
    yield put(startLoading(GET_CATEGORIES));
    try {
        const { payload: JWT_TOKEN } = action;
        const result = yield call(requestGETCategoryList, JWT_TOKEN);
        if (result.data.msg === "success") {
            yield put({
                type: GET_CATEGORIES_SUCCESS,
                payload: result.data.query.categorys
            });
        } else {
            yield put({
                type: GET_CATEGORIES_FAILURE,
                payload: result.data.msg,
                error: true
            });
        }
    } catch (e) {
        yield put({
            type: GET_CATEGORIES_FAILURE,
            payload: e,
            error: true
        });
    }
    yield put(finishLoading(GET_CATEGORIES));
}

function *getMenuListSaga(action) {
    yield put(startLoading(GET_MENULIST));
    try {
        const { JWT_TOKEN, ca_id, index } = action.payload;
        const result = yield call(requestGETMenuList, JWT_TOKEN, ca_id);
        if (result.data.msg === "success" || result.data.msg === "메뉴가 존재하지 않습니다.") {
            const payload = {
                items: result.data.query.items,
                index
            };
            yield put({
                type: GET_MENULIST_SUCCESS,
                payload
            });
        } else {    
            yield put({
                type: GET_MENULIST_FAILURE,
                payload: result.data.msg,
                error: true
            });
        }
    } catch (e) {
        yield put({
            type: GET_MENULIST_FAILURE,
            payload: e,
            error: true
        });
    }
    yield put(finishLoading(GET_MENULIST));
}

function *updateMenuSaga(action) {
    yield put(startLoading(UPDATE_MENU));
    try {
        const { JWT_TOKEN, item_id, ca_index } = action.payload;
        const result = yield call(requestPUTUpdateMenu, JWT_TOKEN, item_id);
        if (result.data.msg === "성공") {
            yield put({
                type: UPDATE_MENU_SUCCESS,
                payload: {
                    ca_index, item_id
                }
            });
        } else {
            yield put({
                type: UPDATE_MENU_FAILURE,
                payload: result.data.msg,
                error: true
            });
        }
    } catch (e) {
        yield put({
            type: UPDATE_MENU_FAILURE,
            payload: e,
            error: true
        });
    }
    yield put(finishLoading(UPDATE_MENU));
}

export function *menuSaga() {
    yield takeLatest(GET_CATEGORIES, getCategoriesSaga);
    yield takeLatest(GET_MENULIST, getMenuListSaga);
    yield takeLatest(UPDATE_MENU, updateMenuSaga);
}

const initialState = {
    categories: null,
    menus: []
};
const menu = handleActions(
    {
        [GET_CATEGORIES_SUCCESS]: (state, action) => ({
            ...state,
            categories: action.payload
        }),
        [GET_MENULIST_SUCCESS]: (state, action) => {
            const { index, items } = action.payload;
            const newMenus = state.menus.slice();
            newMenus[index] = items;
            return {
                ...state,
                menus: newMenus
            }
        },
        [UPDATE_MENU_SUCCESS]: (state, action) => {
            const { ca_index, item_id } = action.payload
            const newMenus = state.menus.slice();
            newMenus[ca_index] = newMenus[ca_index].map(item => item.item_id === item_id ? { ...item, soldout: !item.soldout } : item);
            return {
                ...state,
                menus: newMenus
            }
        },
        [DELETE_MENU]: (state, action) => initialState
    },
    initialState
)

export default menu;