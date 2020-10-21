import React from 'react';
import classnames from 'classnames/bind';
import styles from './SelectBox.module.scss';

const cn = classnames.bind(styles);

const SelectBox = ({ className, value, handleChange, disabled, list, name }) => (
    <select
        className={cn('select', { disabled }) + ' ' + className}
        value={value} onChange={handleChange}
        disabled={disabled}
    >
        {list.map((item, index) => <option key={item} value={item}>{name[index]}</option>)}
    </select>
);

export default SelectBox;