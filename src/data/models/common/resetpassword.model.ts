interface ResetPassword {
    userId: string;
    token: string;
    token_expiry: Date;
    reseted: Boolean;
}

export default ResetPassword;