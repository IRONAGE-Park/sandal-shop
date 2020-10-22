import { createAction, handleActions } from 'redux-actions';
import { calculateDate } from '../lib/calculateDate';

const SET = 'date/SET';

export const dateSet = createAction(SET, (type, start_date, end_date) => ({
    type, start_date, end_date
}));

const initialState = {
    // 주문 완료에서 사용할 일자
    order_complete: {
        start_date: calculateDate(new Date(), 7, 'DATE'), end_date: new Date()
    },
    // 주문 취소에서 사용할 일자
    order_cancel: {
        start_date: calculateDate(new Date(), 7, 'DATE'), end_date: new Date()
    },
    // 일일 매출 내역에서 사용할 일자
    calculate_daily: {
        start_date: calculateDate(new Date(), 1, 'MONTH'), end_date: new Date()
    },
    // 월간 매출 내역에서 사용할 일자
    calculate_monthly: {
        start_date: calculateDate(new Date(), 3, 'MONTH'), end_date: new Date()
    },
    // 연간 매출 내역에서 사용할 일자
    calculate_yearly: {
        start_date: calculateDate(new Date(), 3, 'YEAR'), end_date: new Date()
    }
};

const date = handleActions(
    {
        [SET]: (state, action) => {
            const { type, start_date, end_date } = action.payload;
            return {
                ...state,
                [type]: {
                    start_date, end_date
                }
            }
        }
    },
    initialState
);

export default date;