type Emoji = {
    name: string;
    names: string[];
    surrogate: string;
    svg: string;
    category: string;
};

type Data = {
    categories: string[],
    emojis: Emoji[]
};

export default Data;