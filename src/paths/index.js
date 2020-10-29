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
        policy: '/auth/policy'
    },
    main: {
        index: '/main',
        account: '/main/account',
        secession: '/main/secession',
        operation: '/main/operation',
        menu: '/main/menu',
        order: '/main/order',
        calculate: '/main/calculate',
        support: '/main/support',
        policy: '/main/policy',
        notification: '/main/notification',
        logout: '/logout',
    },
    api: PROTOCOL_ENV + 'api.ajoonamu.com/api/',
    storage: PROTOCOL_ENV + 'api.ajoonamu.com/storage/'
};

export const PathsFormater = (path) => typeof path === "object" ? path.index : path;
export default Paths;