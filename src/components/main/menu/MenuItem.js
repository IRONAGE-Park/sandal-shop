import React from 'react';
import { DBImageFormat, numberFormat } from '../../../lib/formatter';
import CoverImage from '../../assets/CoverImage';
import Toggle from '../assets/Toggle';
import styles from './Menu.module.scss';

const MenuItem = ({ item, handleChange }) => {
    const { item_name, item_img, soldout, item_price } = item;
    return (
        <li className={styles['item']}>
            <div className={styles['image']}>
                <CoverImage src={DBImageFormat(item_img)[0]} />
            </div>
            <div className={styles['text']}>
                <h3 className={styles['name']}>{item_name}</h3>
                <p className={styles['price']}>{numberFormat(item_price)}원 </p>
                <div className={styles['toggle']}>
                    <Toggle checked={!soldout} handleChange={handleChange} />
                </div>
            </div>
        </li>
    );
}

export default MenuItem;