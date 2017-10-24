import Sentence from "./sentence.model";

interface Skill {
    name: string;
    sentences: Sentence[],
    inactiveSentences: Sentence[]
}

export default Skill