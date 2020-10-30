import React from 'react';
import classnames from 'classnames/bind';
import { Link, useHistory } from 'react-router-dom';
/* Library */

import { IconButton } from '@material-ui/core';
/* Components */

import styles from './MobileHeader.module.scss';
/* Stylesheets */

import Back from '../svg/header/back.svg';
import { useSelector } from 'react-redux';
/* Static */

const cn = classnames.bind(styles);

export default ({ title, back, defaultIcon }) => {
    const history = useHistory();
    const { close } = useSelector(state => state.header);
    return (
        <div className={cn('mobile-header', { close })}>
            <div className={styles['area']}>
                <div className={styles['container']}>
                    {back && (back !== "goBack" ?
                        <Link to={back}>
                            <IconButton component="div" className={styles['back']}>
                                <img src={Back} alt="back" />
                            </IconButton>
                        </Link>
                        : <IconButton className={styles['back']} onClick={() => history.goBack()}>
                            <img src={Back} alt={"back"} />
                        </IconButton>)}
                    {!back && defaultIcon}
                    <h1 className={styles['title']}>{title}</h1>
                </div>
            </div>
        </div>
    );
};
