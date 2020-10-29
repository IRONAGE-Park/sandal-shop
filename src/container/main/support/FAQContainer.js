import React, { Fragment, useCallback, useState } from 'react';
import classnames from 'classnames/bind';
import Message from '../../../components/assets/Message';
import styles from './SupportContainer.module.scss';
import { ButtonBase } from '@material-ui/core';
import { dateToYYYYMMDD } from '../../../lib/formatter';
import Direction from '../../../components/svg/Direction';

const cn = classnames.bind(styles);

const FAQContainer = ({ faqList, faqType }) => {

    const [selectedItem, setSelectedItem] = useState(-1);

    const onClickDetailView = useCallback(id => {
        if (selectedItem === id) {
            setSelectedItem(-1);
        } else {
            setSelectedItem(id);
        }
    }, [selectedItem]);

    return (
        <>
            <div className={styles['content']}>
                <div className={styles['m-label']}>{faqType}</div>
                <div className={styles['table']}>
                    <div className={cn('body', { empty: faqList.length === 0 })}>
                        {faqList.length !== 0 ?
                        faqList.map(({ id, question, answer, created_at }) => (
                            <Fragment key={id}>
                                <ButtonBase onClick={() => onClickDetailView(id)} component="div" className={styles['item']} key={id}>
                                    <div className={cn('column', 'question')}>{question}</div>
                                    <div className={cn('column', 'created_at')}>{dateToYYYYMMDD(created_at)}</div>
                                    <div className={cn('column', 'direction')}><Direction vector={selectedItem === id ? "TOP" : "BOTTOM"} /></div>
                                </ButtonBase>
                                {id === selectedItem &&
                                <div className={styles['answer']} dangerouslySetInnerHTML={{ __html: answer }} />}
                            </Fragment>
                        ))
                        : <Message msg="자주 묻는 질문이 존재하지 않습니다." />}
                    </div>
                </div>
            </div>
        </>
    );
};

export default FAQContainer;