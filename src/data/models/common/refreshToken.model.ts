interface RefreshToken {
    userId: string;
    accessToken: string;
    refreshToken: string;
    expiryDate: Date;
}

export default RefreshToken;