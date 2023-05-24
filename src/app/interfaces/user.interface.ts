export interface User {
    id: number;
    username: string;
    roles: string[];
    tokenType: string;
    accessToken: string;
}