import React, { useCallback, useState } from 'react';
/* Library */

import { requestPOSTChangePW, requestPOSTFindPW } from '../../../api/auth';
import Paths from '../../../paths';
/* Custom Library */

import AuthInput from '../AuthInput';
import ConfirmButton from '../ConfirmButton';
import PasswordAuth from '../PasswordAuth';
import PhoneAuth from '../PhoneAuth';
/* Components */

import { useDialog } from '../../../hooks/useDialog';
/* Hooks */

import styles from './FindInput.module.scss';
/* Stylesheets */

export default ({ history }) => {
    const openDialog = useDialog();

    const [name, setName] = useState(''); // 유저 명
    const [email, setEmail] = useState(''); // 가맹점 명
    const [phone, setPhone] = useState(''); // 휴대폰 번호
    const [phoneAuth, setPhoneAuth] = useState(false); // 휴대폰 인증 여부

    const [success, setSuccess] = useState(false); // 비밀번호 찾기 성공 여부
    const [newPassword, setNewPassword ] = useState(''); // 재설정할 비밀번호
    const [pwSame, setPwSame] = useState(false); // 재설정할 비밀번호 일치 여부


    const onClickFindPW = useCallback(async () => {
        const { data: result } = await requestPOSTFindPW({ name, email, hp: phone });
        const { msg } = result;
        if (result.msg === "성공") {
            setSuccess(true);
            history.push(`${Paths.auth.find.pw}/complete`);
        } else {
            openDialog(msg, '정보를 다시 확인해 주세요.');
        }
    }, [name, email, phone, history, openDialog]);

    const onClickChangePW = useCallback(async () => {
        const { data: result } = await requestPOSTChangePW({ name, email, hp: phone, pw: newPassword, pw_C: newPassword })
        if (result.msg === "성공") {
            openDialog('비밀번호가 성공적으로 변경되었습니다!');
            history.replace(Paths.auth.signin);
        } else {
            openDialog('Error!', '');
        }
    }, [name, email, phone, newPassword, history, openDialog])

    return (
        <div className={styles['find-input']}>
            {success ?
            <div className={styles['complete-pw']}>
                <h2 className={styles['introduce']}>
                    안녕하세요, {name} 점주님!
                </h2>
                <h4 className={styles['content']}>
                    인증이 완료되어 비밀번호를 재설정 합니다.<br />
                    비밀번호를 잊어버리지 않게 주의하세요!
                </h4>

                <PasswordAuth value={newPassword} handleChange={e => setNewPassword(e.target.value)} setSame={setPwSame} NEW />
                <div className={styles['button']}>
                    <ConfirmButton
                        handleClick={pwSame ? onClickChangePW : () => openDialog('정보를 똑바로 입력하세요.', '다시 입력하세요.')}
                        active={pwSame}
                    >
                        비밀번호 변경 후 로그인
                    </ConfirmButton>
                </div>
            </div>
            : <>
                <div className={styles['content']}>
                    <h3 className={styles['title']}>
                        비밀번호를 찾기 위한 정보를 입력해 주세요.
                    </h3>
                </div>
                <div className={styles['responsive']}>
                    <AuthInput
                        type="text"
                        name="name"
                        handleChange={(e) => setName(e.target.value)}
                        value={name}
                        label="이름"
                    />
                </div>
                <div className={styles['domain']}>
                    <AuthInput
                        type="text"
                        name="email"
                        handleChange={(e) => setEmail(e.target.value)}
                        value={email}
                        label="이메일"
                    />
                </div>
                <div className={styles['domain']}>
                    <PhoneAuth phone={phone} setPhone={setPhone} setAuth={setPhoneAuth} />
                </div>
                <div className={styles['content']}>
                    <ConfirmButton
                        handleClick={
                            name !== '' && email !== '' && phoneAuth
                            ? onClickFindPW : () => openDialog('정보를 똑바로 입력하세요.', '다시 입력하세요.')
                        }
                        active={name !== '' && phoneAuth}
                    >
                        확인
                    </ConfirmButton>
                </div>
            </>}
        </div>
    );
};
