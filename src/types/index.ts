export interface command {
    command: {
        name: string;
        description: string;
        options: Array<Record<string, any>>;
        default_permission: boolean | undefined;
    };
    run: Function;
}
export type warningRecords = {
    guildId: string;
    warnings: Array<Record<string, any>>;
};
export type autoModWords = Array<string>;

export type args = {
    token: string;
    redirectUrl: string;
};
export type serverArgs = {
    id: string;
    userId: string;
};
