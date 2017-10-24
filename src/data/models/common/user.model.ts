export interface User {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    passwordUpdatedAt: Date;
    admin: boolean;
    pictureUrl: string;
    orgIds: string[];
    notificationToken: string[];
}