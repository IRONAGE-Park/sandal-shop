import { ButtonBase } from '@material-ui/core';
import React from 'react';
import styles from './PcDatePicker.module.scss';
import SelectBox from './SelectBox';

const PcDatePicker = ({ dateRange, type, handleChange, handleClick }) => {
    const { start_date, end_date } = dateRange;

    return (
        <div className={styles['pc-date-picker']}>
            <div className={styles['date-box']}>
                <p className={styles['label']}>기간입력</p>
                <SelectBox
                    value={start_date.getFullYear()}
                    handleChange={e =>
                        handleChange(
                            `${e.target.value}/${start_date.getMonth() + 1}/${start_date.getDate()}`,
                            end_date,
                        )
                    }
                    list={Array.from({ length: 60 }).map((v, i) => i + 1970)}
                    name={Array.from({ length: 60 }).map((v, i) => i + 1970 + '년')}
                />
                {(type === 'MONTH' || type === 'DAY') && (
                    <SelectBox
                        value={start_date.getMonth() + 1}
                        handleChange={e =>
                            handleChange(
                                `${start_date.getFullYear()}/${e.target.value}/${start_date.getDate()}`,
                                end_date,
                            )
                        }
                        list={Array.from({ length: 12 }).map((v, i) => i + 1)}
                        name={Array.from({ length: 12 }).map((v, i) => i + 1 + '월')}
                    />
                )}
                {type === 'DAY' && (
                    <SelectBox
                        value={start_date.getDate()}
                        handleChange={e =>
                            handleChange(
                                `${start_date.getFullYear()}/${start_date.getMonth() + 1}/${e.target.value}`,
                                end_date,
                            )
                        }
                        list={Array.from({ length: 31 }).map((v, i) => i + 1)}
                        name={Array.from({ length: 31 }).map((v, i) => i + 1 + '일')}
                    />
                )}
                <div className={styles['line']} />
                <SelectBox
                    value={end_date.getFullYear()}
                    handleChange={e =>
                        handleChange(
                            start_date,
                            `${e.target.value}/${end_date.getMonth() + 1}/${end_date.getDate()}`,
                        )
                    }
                    list={Array.from({ length: 60 }).map((v, i) => i + 1970)}
                    name={Array.from({ length: 60 }).map((v, i) => i + 1970 + '년')}
                />
                {(type === 'MONTH' || type === 'DAY') && (
                    <SelectBox
                        value={end_date.getMonth() + 1}
                        handleChange={e =>
                            handleChange(
                                start_date,
                                `${end_date.getFullYear()}/${e.target.value}/${end_date.getDate()}`,
                            )
                        }
                        list={Array.from({ length: 12 }).map((v, i) => i + 1)}
                        name={Array.from({ length: 12 }).map((v, i) => i + 1 + '월')}
                    />
                )}
                {type === 'DAY' && (
                    <SelectBox
                        value={end_date.getDate()}
                        handleChange={e =>
                            handleChange(
                                start_date,
                                `${end_date.getFullYear()}/${end_date.getMonth() + 1}/${e.target.value}`,
                            )
                        }
                        list={Array.from({ length: 31 }).map((v, i) => i + 1)}
                        name={Array.from({ length: 31 }).map((v, i) => i + 1 + '일')}
                    />
                )}
                <ButtonBase className={styles['search-btn']} onClick={handleClick}>조회</ButtonBase>
            </div>
        </div>
    );
};

export default PcDatePicker;