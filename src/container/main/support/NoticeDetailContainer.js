import React, { useCallback, useEffect, useState } from 'react';
import classnames from 'classnames/bind';
import styles from './SupportContainer.module.scss';
import { ButtonBase } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import Paths from '../../../paths';
import { useDialog } from '../../../hooks/useDialog';
import { requestGETNoticeView } from '../../../api/support';
import Loading from '../../../components/assets/Loading';


const cn = classnames.bind(styles);

const numbering = (number) => {
    let result = number;
    if (number < 100) {
        result = "0" + result;
    } if (number < 10) {
        result = "0" + result;
    }
    return result;
}

const NoticeDetailContainer = ({ viewId }) => {

    const history = useHistory();
    const openDialog = useDialog();

    const [loading, setLoading] = useState(false);
    const [notice, setNotice] = useState({});

    const { created_at, title, body } = notice;

    const onClickViewList = useCallback(() => {
        history.push(Paths.main.support + '/notice');
    }, [history]);

    const callGETNoticeDetail = useCallback(async () => {
        const JWT_TOKEN = localStorage.getItem('user_token');
        if (JWT_TOKEN) {
            setLoading(true);
            try {
                const res = await requestGETNoticeView(JWT_TOKEN, viewId);
                if (res.data.msg === "성공") {
                    if (res.data.query.notice) {
                        setNotice(res.data.query.notice);
                    } else {
                        openDialog("삭제되거나 없는 게시물입니다.", "게시물 번호를 확인해 주세요.");
                        history.goBack();
                    }
                } else {
                    openDialog("공지사항을 조회하는데 실패하였습니다", "잠시 후 다시 시도해 주세요.");
                }
            } catch (e) {
                openDialog("공지사항을 조회하는데 실패하였습니다", "잠시 후 다시 시도해 주세요.");
            }
            setLoading(false);
        }
    }, [viewId, history, openDialog]);

    useEffect(() => {
        callGETNoticeDetail();
    }, [callGETNoticeDetail]);
    
    return (
        <div className={styles['content']}>
            <div className={styles['table']}>
                <div className={cn('header', 'mobile-view')}>
                    {!loading && <>
                    <div className={cn('column', 'number')}>{numbering(viewId)}</div>
                    <div className={cn('column', 'title')}>{title}</div>
                    <div className={cn('column', 'created_at')}>{created_at}</div>
                    </>}
                </div>
                <div className={styles['text']} dangerouslySetInnerHTML={{ __html: body }} />
            </div>
            <div className={styles['button-area']}>
                <ButtonBase className={styles['button']} onClick={onClickViewList}>
                    목록
                </ButtonBase>
            </div>
            <Loading open={loading} />
        </div>
    );
};

export default NoticeDetailContainer;