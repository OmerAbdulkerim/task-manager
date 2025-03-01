export const JWT_CONFIG = {
    SECRET: process.env.JWT_SECRET || 'NONE',
    EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
};
