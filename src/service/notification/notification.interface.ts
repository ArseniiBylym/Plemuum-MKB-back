interface NotificationInterface {
    sendNotification: (token: string, payload: Object) => Promise<any>;
};

export default NotificationInterface;

