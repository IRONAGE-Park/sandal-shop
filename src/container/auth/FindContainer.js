import React from 'react';
import { Route, Switch } from 'react-router-dom';
/* Library */

import Paths from '../../paths';
/* Custom Library */

import Find from '../../components/auth/find/Find';
import FindID from '../../components/auth/find/FindID';
import FindPW from '../../components/auth/find/FindPW';
/* Components */

import styles from './Find.module.scss';
/* Stylesheets */

export default () => (
    <div className={styles['find']}>
        <div className={styles['container']}>
            <div className={styles['area']}>
                <div className={styles['content']}>
                    <Switch>
                        <Route path={Paths.auth.find.index} component={Find} exact />
                        <Route path={Paths.auth.find.id} component={FindID} />
                        <Route path={Paths.auth.find.pw} component={FindPW} />
                    </Switch>
                </div>
            </div>
        </div>
    </div>
);
