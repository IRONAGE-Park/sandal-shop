import React from 'react';
/* Library */

import { Link } from '@material-ui/core';

import styles from "./Checkbox.module.scss";
/* Stylesheets */

import Check from '../svg/auth/Check';
/* Statics */

export default ({ checked, handleToggle, title, detail, text, bold }) => {
    return (
        <div className={styles['checkbox']}>
            <div className={styles['container']}>
                <span className={styles['content']} onClick={handleToggle}>
                    <Check checked={checked} />
                    <span className={styles['title']}>
                        <span className={styles[bold ? "bold" : ""]}>{title}</span>
                    </span>
                </span>
                {detail && <Link onClick={detail} className={styles['detail']}>보기</Link>}    
            </div>
            {text && <p className={styles['text']}>{text}</p>}
        </div>
    );
};