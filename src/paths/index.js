export const PROTOCOL_ENV = 'http://dev'

const Paths = {
    index: '/',
    auth: {
        index: '/auth',
        signin: '/auth/signin',
        signup: '/auth/signup',
        find: {
            index: '/auth/find',
            id: '/auth/find/id',
            pw: '/auth/find/pw'
        },
    },
    main: {
        index: '/main',
        account: '/main/account',
        secession: '/main/secession',
        operation: '/main/operation',
        menu: '/main/menu',
        order: '/main/order',
        calculate: {
            index: '/main/calculate',
            days: '/main/calculate/days',
            month: '/main/calculate/month',
            years: '/main/calculate/years'
        },
        support: {
            index: '/main/support',
            notice: '/main/support/notice',
            faq: '/main/support/faq',
            qna: '/main/support/qna'
        },
        logout: '/logout',
    },
    api: PROTOCOL_ENV + 'api.ajoonamu.com/api/',
    storage: PROTOCOL_ENV + 'api.ajoonamu.com/storage/'
};

export const PathsFormater = (path) => typeof path === "object" ? path.index : path;
export default Paths;