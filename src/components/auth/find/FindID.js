import React, { useCallback, useState } from 'react';
import classnames from 'classnames/bind';
/* Library */

import { requestPOSTFindID } from '../../../api/auth';
import Paths from '../../../paths';
/* Custom Library */

import { ButtonBase } from '@material-ui/core';
import AuthInput from '../AuthInput';
import ConfirmButton from '../ConfirmButton';
import PhoneAuth from '../PhoneAuth';
/* Components */

import { useDialog } from '../../../hooks/useDialog';
/* Hooks */

import styles from './FindInput.module.scss';
/* Stylesheets */

const cn = classnames.bind(styles);

export default ({ history }) => {
    const openDialog = useDialog();

    const [name, setName] = useState(''); // 유저 명
    const [phone, setPhone] = useState(''); // 휴대폰 번호
    const [phoneAuth, setPhoneAuth] = useState(false); // 휴대폰 인증 여부

    const [email, setEmail] = useState('') // 아이디 찾기 결과

    const onClickFindID = useCallback(async () => {
        const { data: result } = await requestPOSTFindID({ name, hp: phone });
        const { msg, query } = result;
        if (query.user) {
            setEmail(query.user.email);
            history.push(`${Paths.auth.find.id}/complete`);
        } else {
            openDialog(msg, '정보를 다시 확인해 주세요.');
        }
    }, [name, phone, history, openDialog]);

    return (
        <div className={styles['find-input']}>
            {email === '' ?
            <>
                <div className={styles['content']}>
                    <h3 className={styles['title']}>
                        아이디를 찾기 위한 정보를 입력해 주세요.
                    </h3>
                </div>
                <div className={styles['domain']}>
                    <AuthInput
                        type="text"
                        name="name"
                        handleChange={(e) => setName(e.target.value)}
                        value={name}
                        label="이름"
                    />
                </div>
                <div className={styles['domain']}>
                    <PhoneAuth phone={phone} setPhone={setPhone} setAuth={setPhoneAuth} />
                </div>
                <div className={styles['content']}>
                    <ConfirmButton
                        handleClick={name !== '' && phoneAuth ? onClickFindID : () => openDialog('정보를 똑바로 입력하세요.', '다시 입력하세요.')}
                        active={name !== '' && phoneAuth}
                    >
                        확인
                    </ConfirmButton>
                </div>
            </> :
            <div className={styles['complete-id']}>
                <h2 className={styles['introduce']}>
                    안녕하세요, {name} 점주님!
                </h2>
                <h4 className={styles['content']}>
                    찾으시려는 이메일 주소는 <b>{email}</b> 입니다.
                </h4>
                <div className={styles['m-content']}>
                    <p className={styles['text']}>찾으시려는 이메일 주소입니다.</p>
                    <h2 className={styles['result']}>{email}</h2>
                </div>
                <div className={styles['interaction']}>
                    <ButtonBase
                        onClick={() => history.replace(Paths.auth.signin)}
                        className={cn('button', 'to-login')}>
                        로그인
                    </ButtonBase>
                    <ButtonBase
                        onClick={() => history.replace(Paths.auth.find.pw)}
                        className={cn('button', 'to-find-pw')}>
                        비밀번호 찾기
                    </ButtonBase>
                </div>
            </div>}
        </div>
    );
};
