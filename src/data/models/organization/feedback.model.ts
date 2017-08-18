import Tag from './tag.model';

export type TYPE = "CONSIDER" | "CONTINUE"

interface Feedback {
    senderId: string;
    recipientId: string;
    context: string;
    message: string;
    creationDate: string;
    privacy: string[];
    type: TYPE;
    requestId: string;
    tags: Tag[];
}

export default Feedback