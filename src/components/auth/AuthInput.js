import React from 'react';
import classnames from 'classnames/bind';
/* Library */

import styles from "./AuthInput.module.scss";
/* Stylesheets */

const cn = classnames.bind(styles);

export default ({ type, name, handleChange, value, label, responseLabel, children, readOnly, disabled, onKeyDown, autoFocus, reference }) => {
    return (
        <div className={cn('input-area')}>
            {!responseLabel && <p className={cn('label', 'mobile')}>{label}</p>}
            <input
                type={type}
                name={name}
                className={cn('interaction', 'input', 'mobile')}
                onChange={handleChange}
                value={value}
                readOnly={readOnly}
                onKeyDown={onKeyDown}
                disabled={disabled}
                autoFocus={autoFocus}
                ref={reference}
            />
            <input
                type={type}
                name={name}
                className={cn('interaction', 'input')}
                onChange={handleChange}
                value={value}
                placeholder={label}
                readOnly={readOnly}
                onKeyDown={onKeyDown}
                disabled={disabled}
            />
            {children}
        </div>
    );
};
