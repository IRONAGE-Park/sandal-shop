import React from 'react';
import classnames from 'classnames/bind';

import styles from './BoxHeader.module.scss';
import Toggle from '../assets/Toggle';

const cn = classnames.bind(styles);

const BoxHeader = ({ title, checked, mode, handleChange }) => {

    return (
        <div className={cn('header', { checked })}>
            <h3 className={styles['content']}>
                <span className={styles['title']}>{title}</span>
                <span className={cn('toggle', { mode })}>
                    <Toggle checked={checked} handleChange={handleChange} />
                </span>
            </h3>
        </div>
    )
}

export default BoxHeader;