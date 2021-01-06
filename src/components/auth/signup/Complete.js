import React from 'react';
/* Library */

import styles from './Complete.module.scss';
/* Stylesheets */

import CompleteBox from '../../svg/auth/complete_box.svg';
/* Statics */

export default ({ name }) => (
    <div className={styles['complete']}>
        <div className={styles['area']}>
            <div className={styles['content']}>
                <img
                    className={styles['m-image']}
                    src={CompleteBox}
                    alt="completeBox"
                />
                <h2 className={styles['congratulations']}>
                    축하합니다! {name} 점주님!
                </h2>
                <h4 className={styles['sub']}>
                    샌달 가맹점 회원가입이 완료 되었습니다.
                </h4>
                <p className={styles['text']}>
                    샌달 가맹점 관리 앱은 승인 받은 가맹점주만
                    사용이 가능합니다. 본사에서 보다 빠르게 검토 후 가입을
                    승인하도록 하겠습니다. 서비스 이용은 가입 승인이 난 후
                    이용이 가능합니다.
                </p>
            </div>
        </div>
    </div>
);
