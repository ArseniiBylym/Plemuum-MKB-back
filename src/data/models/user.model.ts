export interface Token {
  userId: string;
  token: string;
  token_expiry: Date;
  client_type: string;
  issued_at: Date;
}

export interface User {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    token: Token;
    pictureUrl: string;
    orgIds: string[]
}