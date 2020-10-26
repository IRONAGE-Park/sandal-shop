import React, { useCallback } from 'react';
import styles from './BottomModal.module.scss';
import classnames from 'classnames/bind';
import DatePicker from './DatePicker';
import { Backdrop, ButtonBase } from '@material-ui/core';

const cn = classnames.bind(styles);

const BottomModal = ({ open, handleClose, dateRange, type, handleChange, handleClick }) => {
    const { start_date, end_date } = dateRange;

    const onClick = useCallback(() => {
        handleClick();
        handleClose();
    }, [handleClick, handleClose]);
    
    return (
        <>
            <div className={cn('bottom-modal', { on: open })}>
                <div className={styles['table']}>
                    <div className={styles['title']}>조회기간</div>
                    <div className={styles['date-cell']}>
                        <div className={styles['box']}>
                            <DatePicker
                                maxDate={end_date}
                                type={type}
                                date={start_date} setDate={date => handleChange(date, end_date)}
                                position="top-start"
                            />
                        </div>
                        <div className={styles['line']}></div>

                        <div className={styles['box']}>
                            <DatePicker
                                minDate={start_date}
                                maxDate={new Date()}
                                type={type}
                                date={end_date} setDate={date => handleChange(start_date, date)}
                                position="bottom-end"
                            />
                        </div>
                    </div>
                    <ButtonBase className={styles['btn-box']}>
                        <div className={styles['link-btn']} onClick={onClick}>조회</div>
                    </ButtonBase>
                </div>
            </div>
            <Backdrop open={open} className={styles['dim']} onClick={handleClose} />
        </>
    );
};

export default BottomModal;
