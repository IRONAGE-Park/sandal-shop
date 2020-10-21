import React, { useCallback, useState } from 'react';
import classnames from 'classnames/bind';
/* Library */

import { ButtonBase, IconButton } from '@material-ui/core';

import styles from './AccountInput.module.scss';
import Back from '../../svg/header/back.svg';
import Direction from '../../svg/Direction';

const cn = classnames.bind(styles);

const AccountInput = ({ title, text, children, handleClick = () => {}, possible }) => {

    const [mode, setMode] = useState(false);
    const [transition, setTransition] = useState(false);

    const onOpen = useCallback(() => {
        setMode(true);
        setTimeout(() => {
            setTransition(true);
        }, 0);
    }, []);
    const onClose = useCallback(() => {
        setTransition(false);
        setTimeout(() => {
            setMode(false);
        }, 150);
    }, []);
    const onClick = useCallback(() => {
        handleClick();
        onClose();
    }, [handleClick, onClose]);

    return (
        <div className={styles['input-area']}>
            <div className={styles['title']}>{title}</div>
            <div className={styles['content']}>
                <div className={styles['collocate']}>
                {mode ? (
                    <div className={cn('mobile-modal', { transition })}>
                        <div className={styles['header']}>
                            <IconButton className={styles['back']} onClick={onClose}>
                                <img src={Back} alt="back" />
                            </IconButton>
                            <h1 className={styles['mobile-title']}>{title} 수정</h1>
                        </div>
                        {children}
                        <ButtonBase disabled={!possible} disableRipple={!possible} className={cn('modal-button', { possible })} onClick={onClick}>
                            변경
                        </ButtonBase>
                    </div>
                )
                : (text && <p className={styles['text']}>{text}</p>)}
                {(!mode && children) && <ButtonBase className={styles['button']} onClick={onOpen}>변경하기</ButtonBase>}
                </div>
            </div>
            {(!mode && children) && <div className={styles['right']}>
                <Direction vector={"RIGHT"} fill="#777" />
            </div>}
        </div>
    );
};

export default AccountInput;