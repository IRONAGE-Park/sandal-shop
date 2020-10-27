import React, { Fragment, useCallback, useState } from 'react';
import classnames from 'classnames/bind';
import Message from '../../../components/assets/Message';
import styles from './SupportContainer.module.scss';
import { ButtonBase } from '@material-ui/core';
import { dateToYYYYMMDD } from '../../../lib/formatter';
import Direction from '../../../components/svg/Direction';
import WriteModal from '../../../components/main/support/WriteModal';
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

const QNAContainer = ({ qnaList, modal }) => {
    const history = useHistory();
    const [selectedItem, setSelectedItem] = useState(-1);

    const onOpenModal = useCallback(() => history.push(Paths.main.support + '/qna/write'), [history]);
    const onCloseModal = useCallback(() => history.goBack(), [history]);
    const onClickDetailView = useCallback(id => {
        if (selectedItem === id) {
            setSelectedItem(-1);
        } else {
            setSelectedItem(id);
        }
    }, [selectedItem]);

    console.log(qnaList);

    return (
        <div className={styles['content']}>
            <div className={styles['write-area']}>
                <ButtonBase className={styles['button']} onClick={onOpenModal}>
                    문의 작성
                </ButtonBase>
            </div>
            <div className={styles['table']}>
                <div className={styles['header']}>
                    <div className={cn('column', 'number')}>글번호</div>
                    <div className={cn('column', 'subject')}>제목</div>
                    <div className={cn('column', 'state')}>상태</div>
                    <div className={cn('column', 'created_at')}>작성날짜</div>
                    <div className={cn('column', 'direction')}/>
                </div>
                <div className={cn('body', { empty: qnaList.length === 0 })}>
                    {qnaList.length !== 0 ?
                    qnaList.map(({ id, question, name, subject, status, answer, q_datetime }) => (
                        <Fragment key={id}>
                            <ButtonBase onClick={() => onClickDetailView(id)} component="div" className={cn('item', { selected: selectedItem === id })} key={id}>
                                <div className={cn('column', 'number')}>{numbering(id)}</div>
                                <div className={cn('column', 'subject')}>{subject}</div>
                                <div className={cn('column', 'state')} style={{ color: status === 1 ? "#008762" : "#555"}}>{status === 1 ? "답변 완료" : "답변 대기"}</div>
                                <div className={cn('column', 'created_at')}>{dateToYYYYMMDD(q_datetime)}</div>
                                <div className={cn('column', 'direction', 'only_mobile')}><Direction vector={selectedItem === id ? "TOP" : "BOTTOM"} /></div>
                            </ButtonBase>
                            {id === selectedItem &&
                            <>
                                <div className={styles['q-question']}>{question}</div> 
                                {answer && <div className={styles['q-answer']} dangerouslySetInnerHTML={{ __html: answer }} />}
                            </>}
                        </Fragment>
                    ))
                    : <Message msg="1:1 문의 내역이 존재하지 않습니다." />}
                </div>
            </div>
            <WriteModal open={modal === 'write'} handleClose={onCloseModal} />
        </div>
    );
};

export default QNAContainer;