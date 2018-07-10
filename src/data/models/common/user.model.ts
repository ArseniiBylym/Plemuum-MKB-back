export interface User {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    passwordUpdatedAt: Date;
    lastActive: Date;
    admin: boolean;
    pictureUrl: string;
    orgId: string;
    notificationToken: string[];
}