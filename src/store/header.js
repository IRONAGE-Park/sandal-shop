import { createAction, handleActions } from 'redux-actions';

const SET_HEADER = 'scroll/SET_HEADER';

export const setHeader = createAction(
    SET_HEADER,
    state => state
);

const initialState = {
    close: false
};

const header = handleActions(
    {
        [SET_HEADER]: (state, action) => ({
            close: action.payload
        })
    },
    initialState
);

export default header;