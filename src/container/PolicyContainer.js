import React from 'react';
import { useSelector } from 'react-redux';
import classnames from 'classnames/bind';
import styles from './PolicyContainer.module.scss';
import CustomTabs from '../components/main/assets/Tabs';
import { useHistory } from 'react-router-dom';


const cn = classnames.bind(styles);

const getPaths = ['privacy', 'tos'];

const PolicyContainer = ({ mode, url }) => {
    const history = useHistory();

    const { company } = useSelector(state => state.company);
    const index = getPaths.findIndex(path => path === mode); // 현재 보여줘야 할 내용 결정.
    return (
        <div className={cn('container')}>
            <div className={cn('tab')}>
                <CustomTabs
                    idx={index}
                    categories={[
                        { ca_name: '개인정보 처리방침' },
                        { ca_name: '이용 약관' },
                    ]}
                    onChange={(e, path) => history.push(url + getPaths[path])}
                />
            </div>
            <div className={styles['content']}>
                {mode === 'privacy' && company && (
                    <p dangerouslySetInnerHTML={{
                            __html: company.private_policy_shop,
                        }}
                    />
                )}
                {mode === 'tos' && company && (
                    <p dangerouslySetInnerHTML={{
                            __html: company.use_terms_shop,
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default PolicyContainer;