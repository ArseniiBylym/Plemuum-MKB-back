export interface Token {
  userId: string;
  token: string;
  token_expiry: Date;
  issued_at: Date;
}

export interface User {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    token: Token;
    pictureUrl: string;
    orgIds: string[];
    notificationToken: string[];
}