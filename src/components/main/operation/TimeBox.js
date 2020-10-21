import React from 'react';
import classnames from 'classnames/bind';
import BoxHeader from './BoxHeader';
import styles from './TimeBox.module.scss';
import SelectBox from '../../assets/SelectBox';

const cn = classnames.bind(styles);

const hours_data = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23
];
const minutes_data = [
    0, 10, 20, 30, 40, 50
];

const getAMPM = hours => hours <= 12 ? "오전 " : "오후 ";
const getHours = hours => hours > 12 ? hours - 12 : hours;
const getMinutes = minutes => minutes < 10 ? ("0" + minutes) : minutes;

const TimeBox = ({ title, data, type, updateForm, handleChange, handleDirectChange }) => {
    const { flag, start, end } = data;
    const [startHours, startMinutes] = start.split(':').map(time => parseInt(time));
    const [endHours, endMinutes] = end.split(':').map(time => parseInt(time));

    return (
        <div className={styles['box']}>
            <BoxHeader
                title={title}
                checked={flag}
                mode={updateForm}
                handleChange={
                    updateForm
                        ? () => handleChange(type + '_flag', !flag)
                        : handleDirectChange
                }
            />
            <div className={cn('time', { updateForm, disabled: !flag })}>
                <div
                    className={cn('content', 'start', {
                        updateForm,
                        disabled: !flag,
                    })}
                >
                    {updateForm ? (
                        <>
                            <p className={styles['m-label']}>시작</p>
                            <SelectBox
                                value={startHours}
                                handleChange={(e) =>
                                    handleChange(
                                        type + '_start',
                                        `${e.target.value}:${startMinutes}:00`,
                                    )
                                }
                                list={hours_data}
                                name={hours_data.map(d => getAMPM(d) + getHours(d) + '시')}
                                disabled={!flag}
                            />
                            <SelectBox
                                value={startMinutes}
                                handleChange={(e) =>
                                    handleChange(
                                        type + '_start',
                                        `${startHours}:${e.target.value}:00`,
                                    )
                                }
                                list={minutes_data}
                                name={minutes_data.map(d => d + '분')}
                                disabled={!flag}
                            />
                        </>
                    ) : (
                        getAMPM(startHours) +
                        getHours(startHours) +
                        ':' +
                        getMinutes(startMinutes)
                    )}
                </div>
                <div
                    className={cn('content', 'end', {
                        updateForm,
                        disabled: !flag,
                    })}
                >
                    {updateForm ? (
                        <>
                            <p className={styles['m-label']}>종료</p>
                            <SelectBox
                                value={endHours}
                                handleChange={(e) =>
                                    handleChange(
                                        type + '_end',
                                        `${e.target.value}:${endMinutes}:00`,
                                    )
                                }
                                list={hours_data}
                                name={hours_data.map(d => getAMPM(d) + getHours(d) + '시')}
                                disabled={!flag}
                            />
                            <SelectBox
                                value={endMinutes}
                                handleChange={(e) =>
                                    handleChange(
                                        type + '_end',
                                        `${endHours}:${e.target.value}:00`,
                                    )
                                }
                                list={minutes_data}
                                name={minutes_data.map(d => d + '분')}
                                disabled={!flag}
                            />
                        </>
                    ) : (
                        getAMPM(endHours) +
                        getHours(endHours) +
                        ':' +
                        getMinutes(endMinutes)
                    )}
                </div>
            </div>
        </div>
    );
};

export default TimeBox;
