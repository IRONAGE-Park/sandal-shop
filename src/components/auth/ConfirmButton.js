import React from 'react';
import classnames from 'classnames/bind';
/* Library */

import { ButtonBase } from '@material-ui/core';
/* Components */

import styles from './ConfirmButton.module.scss';
/* Stylesheets */

const cn = classnames.bind(styles);

export default ({ handleClick, children, active }) => (
    <div className={styles['confirm']}>
        <ButtonBase
            className={cn('button', { active })}
            onClick={handleClick}
        >
            {children}
        </ButtonBase>
    </div>
);
