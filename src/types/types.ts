type ColumnTitle = "Todo" | "Doing" | "Done";

type Task = {
    id: string;
    title: string;
    description: string;
    date: string;
    status: ColumnTitle;
    pos: number;
};

type Column = {
    Todo: Task[];
    Doing: Task[];
    Done: Task[];
};
