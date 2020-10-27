import React, { useCallback } from 'react';
import classnames from 'classnames/bind';
import styles from './SupportContainer.module.scss';
import Message from '../../../components/assets/Message';
import { ButtonBase } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import Paths from '../../../paths';


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

const NoticeContainer = ({ noticeList }) => {

    const history = useHistory();

    const onClickDetailView = useCallback(id => history.push(Paths.main.support + '/notice/view?id=' + id), [history]);

    return (
        <div className={styles['content']}>
            <div className={styles['table']}>
                <div className={styles['header']}>
                    <div className={cn('column', 'number')}>글번호</div>
                    <div className={cn('column', 'title')}>제목</div>
                    <div className={cn('column', 'created_at')}>작성날짜</div>
                </div>
                <div className={cn('body', { empty: noticeList.length === 0 })}>
                    {noticeList.length !== 0 ?
                    noticeList.map(({ id, title, created_at }) => (
                        <ButtonBase onClick={() => onClickDetailView(id)} component="div" className={styles['item']} key={id}>
                            <div className={cn('column', 'number')}>{numbering(id)}</div>
                            <div className={cn('column', 'title')}>{title}</div>
                            <div className={cn('column', 'created_at')}>{created_at}</div>
                        </ButtonBase>
                    ))
                    : <Message msg="공지사항이 존재하지 않습니다." />}
                </div>
            </div>
        </div>
    );
};

export default NoticeContainer;