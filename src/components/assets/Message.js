import React from 'react';
import styles from './Message.module.scss';
import Empty from '../svg/empty.svg';

const Message = ({ msg }) => {
    return (
        <div className={styles['message']}>
            <img className={styles['image']} src={Empty} alt="empty" />
            <p className={styles['text']}>{msg}</p>
        </div>
    );
};

export default Message;