import React, { useState, useCallback, useReducer } from 'react';
/* Library */

import SignUp from '../../components/auth/signup/SignUp';
import Complete from '../../components/auth/signup/Complete';
import ConfirmButton from '../../components/auth/ConfirmButton';
/* Components */

import { useDialog } from '../../hooks/useDialog';
/* Hooks */

import styles from './SignUp.module.scss';
/* Stylesheets */

import Paths from '../../paths';
import { requestPOSTRegist } from '../../api/auth';
/* Paths */

const reducer = (state, action) => ({
    ...state,
    ...action
});

export default ({ history }) => {
    const openDialog = useDialog();

    const [shop, setShop] = useState(''); // 가맹점 명
    const [name, setName] = useState(''); // 사용자 명
    const [activeConfirm, setActiveConfirm] = useState(false); // 가입하기 버튼의 활성화 상태.
    const [complete, setComplete] = useState(false); // 가입 성공 유무.
    const [email, setEmail] = useState(''); // 이메일
    const [phone, setPhone] = useState(''); // 휴대폰 번호
    const [password, setPassword] = useState(''); // 비밀번호
    const [addrState, addrDispatch] = useReducer(reducer, {
        addr: '', post_num: '',
        detail_addr: '',
        shop_lat: '', shop_lng: ''
    }); // 주소, 상세 주소 값

    const { addr, detail_addr, post_num, shop_lat, shop_lng } = addrState;

    const onClickSignUpConfirm = useCallback(async () => {
        /* 가입하기 버튼을 누르면 가입 요청을 보내는 함수. */
        if (activeConfirm) {
            try {
                const res = await requestPOSTRegist({
                    email, name: name, shop_hp: phone,
                    password: password, password_confirm: password,
                    shop_name: shop, shop_post_num: post_num,
                    shop_addr1: addr, shop_addr2: detail_addr, shop_extra: '',
                    shop_lat, shop_lng
                });
                if (res.data.user) {
                    setComplete(true); // 가입 성공.
                    history.push(`${Paths.auth.signup}/complete`);
                } else if (res.data.msg === "이미 존재하는 이메일 주소이거나 소비자용 계정으로 가입을 시도하셔서 실패하셨습니다.") {
                    openDialog("이미 존재하는 계정입니다.", "가입하셨거나 소비자용 계정이 아닌지 확인해 주세요.");
                } else {
                    openDialog("가입할 수 없는 계정입니다.", "계정 정보를 다시 한 번 확인해 주세요.");
                }
            } catch (e) {
                openDialog("서버에 오류가 발생하였습니다", "잠시 후 다시 시도해 주세요.")
            }
        } else {
            /* confirm 버튼이 active가 되지 않았을 때 알림 창 킴. */
            openDialog("정보를 모두 입력해야 합니다.", "이메일과 비밀번호를 확인해 주세요.");
        }
    }, [activeConfirm, addr, detail_addr, email, history, name, openDialog, password, phone, post_num, shop, shop_lat, shop_lng])

    const onClickHyperLink = useCallback(() => {
        /* 로그인 페이지로 이동시키는 함수. */
        history.replace(Paths.auth.signin);
    }, [history]);
    /* Event Listener */

    return (
        <div className={styles['container']}>
            <div className={styles['signup']}>
                {complete ? <Complete name={name} />
                : <SignUp
                    shop={shop} setShop={setShop}
                    name={name} setName={setName}
                    password={password} setPassword={setPassword}
                    email={email} setEmail={setEmail}
                    phone={phone} setPhone={setPhone}
                    addrState={addrState} addrDispatch={addrDispatch}
                    setActiveConfirm={setActiveConfirm}
                />}
                <div className={styles['area']}>
                    <div className={styles['content']}>
                        <ConfirmButton
                            active={activeConfirm}
                            handleClick={
                                complete ?
                                onClickHyperLink : onClickSignUpConfirm
                            }
                        >
                            {complete ? '로그인' : '가입하기'}
                        </ConfirmButton>
                    </div>
                </div>
            </div>
        </div>
    );
};
