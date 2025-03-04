export const JWT_CONFIG = {
    ACCESS_TOKEN: {
        SECRET: process.env.JWT_ACCESS_SECRET || 'access_secret',
        EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    },
    REFRESH_TOKEN: {
        SECRET: process.env.JWT_REFRESH_SECRET || 'refresh_secret',
        EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    },
};
