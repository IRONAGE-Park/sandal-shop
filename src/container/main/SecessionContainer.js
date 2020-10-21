import React, { useCallback, useState } from 'react';
import classnames from 'classnames/bind';
import { useHistory } from 'react-router-dom';
/* Library */

import { requestPUTSuccession } from '../../api/mypage';
/* API */

import Check from '../../components/svg/auth/Check';
import { ButtonBase } from '@material-ui/core';
/* Components */

import { useStore } from '../../hooks/useStore';
import { useDialog } from '../../hooks/useDialog';
/* Hooks */

import styles from './SecessionContainer.module.scss';
/* Stylessheets */

import Paths from '../../paths';
/* Paths */

const cn = classnames.bind(styles);

const SecessionContainer = () => {
    const USER_TOKEN = useStore();
    const openDialog = useDialog();
    const history = useHistory();
    const [secession, setSecession] = useState(false);

    const onToggle = useCallback(() => setSecession(!secession), [secession]);

    const onSecession = useCallback(() => {
        if (secession) {
            openDialog('정말로 탈퇴하시겠습니까?', '탈퇴를 신청하시면 취소할 수 없습니다.', async () => {
                try {
                    const res = await requestPUTSuccession(USER_TOKEN, secession);
                    if (res.data.msg) {
                        openDialog('정상적으로 회원탈퇴 되셨습니다!', '다음에도 저희 아주나무를 이용해 주시기 바랍니다.');
                        history.push(Paths.ajoonamu.logout);
                    }
                } catch (e) {
                    openDialog('잘못된 접근입니다.', '잠시 후 재시도 해주세요.');
                }
            }, true);
        } else {
            openDialog('확인 요소에 동의하셔야 합니다.', '위 글을 읽고 다시 신청해 주세요.');
        }
    }, [USER_TOKEN, secession, openDialog, history]);

    return (
        <div className={styles['container']}>
            <div className={styles['content']}>
                <h2 className={styles['title']}>회원 탈퇴를 신청하기 전에 먼저 확인해 주세요.</h2>
            </div>
            <div className={styles['content']}>
                <div className={styles['warning']}>
                    <p className={styles['text']}>탈퇴 후 회원정보 및 이용기록은 모두 삭제되며 다시 복구가 불가합니다.</p>
                    <p className={styles['text']}>주문내역 및 결제 내용은 이용약관과 관련법에 의하여 보관됩니다.</p>
                    <p className={styles['text']}>동일한 SNS계정과 이메일을 사용한 재가입은 24시간 이내에 불가합니다.</p>
                </div>
            </div>
            <div className={styles['divide']} />
            <div className={styles['content']}>
                <h3 className={styles['question']}>회원 탈퇴를 신청하시겠습니까?</h3>
                <div className={styles['put']}>
                    <span className={styles['interaction']} onClick={onToggle}>
                        <Check checked={secession} size={24} />
                        <span className={styles['confirm']}>예. 탈퇴를 신청합니다.</span>
                    </span>
                </div>
            </div>
            <ButtonBase onClick={onSecession} className={cn('button', { enabled: secession })} disabled={!secession} disableRipple={!secession}>
                회원 탈퇴하기
            </ButtonBase>
        </div>
    );
};

export default SecessionContainer;