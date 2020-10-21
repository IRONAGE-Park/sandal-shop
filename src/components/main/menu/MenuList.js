import React from 'react';
import MenuItem from './MenuItem';
import styles from './Menu.module.scss';
import Message from '../../assets/Message';

const MenuList = ({ list, handleChange }) => {
    return (
        <div className={styles['content']}>
            <ul className={styles['list']}>
                {list.length ? list.map(item => <MenuItem key={item.item_id} item={item} handleChange={() => handleChange(item.item_id)} />)
                : <Message msg="조회된 결과가 없습니다." />}
            </ul>
        </div>
    );
};

export default MenuList;