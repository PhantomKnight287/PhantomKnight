export type userContext = {
    avatar: string;
    discriminator: string;
    email: string;
    id: string;
    username: string;
    guilds?: [];
};
export type BackendUserData = {
    accent_color: number;
    avatar: string;
    banner: null;
    banner_color: string;
    discriminator: string;
    email: string;
    flags: number;
    id: string;
    locale: string;
    mfa_enabled: boolean;
    public_flags: number;
    username: string;
    verified: boolean;
    refresh: string;
    guilds: [];
};

export type playlistArgs = {
    message: string | null;
    songs:
        | []
        | [
              {
                  id: string;
                  __v: number;
              }
          ];
};
export type guild = {
    id: string;
    name: string;
    icon: string | null;
    owner: boolean;
    permissions: number;
    features: string[];
    permissions_new: string;
    invited: boolean;
};

export type userData = {
    avatar: string;
    discriminator: string;
    username: string;
};

type song = {
    artist: string;
    duration: number;
    id: string;
    original_title: string;
    publishedAt: string;
    title: string;
};
export type Songs = song[];

export type autoModConfig = {
    enabled: boolean;
    guildId: string;
    id: string;
    v: number;
    words: string[];
};
