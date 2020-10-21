import React from 'react';
import { Link } from 'react-router-dom';
/* Library */

import { IconButton } from '@material-ui/core';
/* Components */

import styles from './MobileHeader.module.scss';
/* Stylesheets */

import Back from '../svg/header/back.svg';
/* Static */

export default ({ title, back }) => (
    <div className={styles['mobile-header']}>
        <div className={styles['area']}>
            <div className={styles['container']}>
                {back && 
                    <Link to={back}>
                        <IconButton component="div" className={styles['back']}>
                                <img src={Back} alt="back" />
                        </IconButton>
                    </Link>}
                <h1 className={styles['title']}>{title}</h1>
            </div>
        </div>
    </div>
);