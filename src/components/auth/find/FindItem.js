import React from 'react';
import { Link } from 'react-router-dom';
/* Library */

import { ButtonBase } from '@material-ui/core';
/* Components */

import styles from './FindItem.module.scss';
/* Stylesheets */

export default ({ src, title, text, href }) => (
    <ButtonBase component="div" className={styles['find']}>
        <div className={styles['area']}>
            <Link className={styles['container']} to={href}>
                <div className={styles['title']}>
                    <img className={styles['image']} src={src} alt="find_image" />
                    <h3 className={styles['content']}>{title}</h3>
                    <p className={styles['text']}>{text}</p>
                </div>
            </Link>
        </div>
    </ButtonBase>
);
