export type MessageType = {
    message: string;
    timestamp: string;
    user: string;
    avatarUrl: string;
}

export type AuthType = {
    username: string,
    password: string
}

export type AuthReturn = {
    username: string,
    token: string
}
