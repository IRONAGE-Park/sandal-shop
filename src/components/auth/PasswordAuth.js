import React, { useCallback, useState, useEffect, useReducer } from 'react';
import classnames from 'classnames/bind';
/* Library */

import { inputReducer } from '../../lib/reducer';
/* Custom Library */

import AuthInput from './AuthInput';
/* Components */

import styles from './PasswordAuth.module.scss';
/* Stylessheets */

const cn = classnames.bind(styles);

const SAME_TEXT = '비밀번호가 일치합니다.';
const DIFF_TEXT = '비밀번호가 일치하지 않습니다.';

export default ({ value, handleChange, setSame, reference, NEW }) => {

    const [firstState, dispatch] = useReducer(inputReducer, {
        pw: '', pw_chk: ''
    });
    const { pw, pw_chk } = firstState;

    const [checkValue, setCheckValue] = useState('');
    const [pwSame, setPwSame] = useState('');


    const onChangeCheckValue = useCallback(e => setCheckValue(e.target.value), []);

    const onChange = useCallback((e, setter) => {
        dispatch(e.target);
        setter(e);
    }, [])

    const onCheckTypingPassword = useCallback((v, check_v) => {
        const same = v && (v === check_v);
        
        setSame(same);
        setPwSame(same ? SAME_TEXT : DIFF_TEXT);
    }, [setSame]);

    useEffect(() => {
        onCheckTypingPassword(value, checkValue);
    }, [value, checkValue, onCheckTypingPassword]);

    return (
        <div className={styles['password-auth']}>
            <AuthInput
                type="password"
                name="pw"
                handleChange={e => onChange(e, handleChange)}
                value={value}
                label={NEW ? "새 비밀번호" : "비밀번호"}
                reference={reference}
            />
            <AuthInput
                type="password"
                name="pw_chk"
                handleChange={e => onChange(e, onChangeCheckValue)}
                value={checkValue}
                label={NEW ? "새 비밀번호 확인" : "비밀번호 확인"}
                responseLabel
            />
            <p
                className={cn('alert', {
                    open: pw && pw_chk,
                    same: pwSame === SAME_TEXT,
                })}
            >
                {pwSame}
            </p>
        </div>
    );
};
