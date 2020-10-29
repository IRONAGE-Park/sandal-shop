import React, { useEffect, useState, useCallback } from 'react';
import styles from './NotificationContainer.module.scss';
import cn from 'classnames/bind';
import { useDispatch, useSelector } from 'react-redux';

//components
import NoticeList from '../../components/main/notice/NoticeList';
import { Button } from '@material-ui/core';

//api
import {
    // requestNotice,
    // reqNoticeReadAll,
    // reqNoticeList,
    // reqNoticeRead,
    // reqNoticeDelete,
} from '../../api/notification';

//store
import {
    // get_notice,
    remove_notice,
    read_notice,
    read_all_notice,
    read_check,
} from '../../store/notice';

//hooks
import { useStore } from '../../hooks/useStore';

const cx = cn.bind(styles);

const NotificationCantainer = () => {
    const user_token = useStore(false);

    const dispatch = useDispatch();
    const { notification } = useSelector((state) => state.notice);
    const [availableTotal, setAvailableTotal] = useState(false);
    //하나 체크
    const onChecked = useCallback(
        async (not_id) => {
            let today = new Date();

            let year = today.getFullYear(); // 년도
            let month = today.getMonth() + 1; // 월
            let date = today.getDate(); // 날짜
            let hours = today.getHours();
            let minutes = today.getMinutes();
            let seconds = today.getSeconds();
            const not_read_datetime = `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;

            if (user_token) {
                try {
                    // await reqNoticeRead(user_token, not_id);
                    dispatch(read_notice({ not_id, not_read_datetime }));
                } catch (e) {
                    console.error(e);
                }
            }
        },
        [dispatch, user_token],
    );

    //전체읽기
    const onAllChecked = useCallback(async () => {
        let today = new Date();

        let year = today.getFullYear(); // 년도
        let month = today.getMonth() + 1; // 월
        let date = today.getDate(); // 날짜
        let hours = today.getHours();
        let minutes = today.getMinutes();
        let seconds = today.getSeconds();

        const not_read_datetime = `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;

        if (user_token) {
            try {
                // await reqNoticeReadAll(user_token);
                dispatch(read_all_notice(not_read_datetime));
            } catch (e) {
                console.error(e);
            }
        }
    }, [dispatch, user_token]);

    //전체 체크됐는지.
    const confirmChecked = useCallback(() => {
        const index = notification.findIndex((item) => !item.not_read_datetime);
        setAvailableTotal(index === -1);
        dispatch(read_check(index === -1));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [notification]);

    //삭제
    const onRemove = useCallback(
        async (not_id) => {
            if (user_token) {
                try {
                    // await reqNoticeDelete(user_token, not_id);
                    // setList((list) => list.filter(item => item.not_id !== not_id));
                    dispatch(remove_notice(not_id));
                } catch (e) {
                    console.error(e);
                }
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [user_token],
    );

    useEffect(() => {
        confirmChecked();
    }, [confirmChecked]);

    return (
        <div className={styles['container']}>
                <Button
                    className={cx('read-btn', {
                        available: !availableTotal,
                    })}
                    onClick={onAllChecked}
                >
                    전체읽기
                </Button>

            <NoticeList
                onChecked={onChecked}
                listData={notification}
                onRemove={onRemove}
            />
        </div>
    );
};

export default NotificationCantainer;
