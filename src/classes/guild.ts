export class responseGuild {
    public id: string;
    public name: string;
    public icon: string | null;
    public owner: boolean;
    public permissions: number;
    public features: string[];
    public permissions_new: string;
    public invited: boolean;
    constructor(
        guild: {
            id: string;
            name: string;
            icon: string;
            owner: boolean;
            permissions: number;
            features: string[];
            permissions_new: string;
        },
        invited: boolean
    ) {
        this.id = guild.id;
        this.name = guild.name;
        this.icon = guild.icon;
        this.owner = guild.owner;
        this.permissions = guild.permissions;
        this.features = guild.features;
        this.permissions_new = guild.permissions_new;
        this.invited = invited;
    }
}
