import Tag from './tag.model';

export enum TYPE {
    CONSIDER = "CONSIDER",
    CONTINUE = "CONTINUE"
}

export enum PRIVACY {
    PRIVATE = "PRIVATE",
    ANONYMOUS = "ANONYMOUS"
}

interface Feedback {
    senderId: string;
    recipientId: string;
    message: string;
    privacy?: string[];
    type: string;
    requestId?: string;
    tags?: Tag[];
}

export default Feedback