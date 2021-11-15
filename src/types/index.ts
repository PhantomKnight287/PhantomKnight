
export type command={
    name:string,
    description:string,
    options:Array<Record<string,any>>,
    default_permission:boolean|undefined|any,
}
export type warningRecords={
    guildId:string,
    warnings:Array<Record<string,any>>
}