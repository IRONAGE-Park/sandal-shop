import React from 'react';
import classnames from 'classnames/bind';
import styles from './Toggle.module.scss';

const cn = classnames.bind(styles);

const Toggle = ({ checked, handleChange }) => (
    <div className={cn('toggle', { checked })} onClick={handleChange}>
        <div className={styles['ground']} />
        <div className={styles['circle']} />
    </div>
);

export default Toggle;