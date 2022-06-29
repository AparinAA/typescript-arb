export {};

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            api_key: string;
            passphrase: string;
            secret_key: string;
            TOKEN_BOT: string;
            ftx_api_key: string;
            ftx_api_secret: string;
            tgchatid: string;
            currency: string;
            amountArb: number;
            amountWith: number;
            delay: number;
            spread: number;
            ENV: 'test' | 'dev' | 'prod';
        }
    }
}