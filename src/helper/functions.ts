export const organizeData = (todos: Task[]) => {
    const columnObj: Column = {
        Todo: [],
        Doing: [],
        Done: [],
    };

    todos.forEach((todo) => {
        if (todo.status in columnObj) {
            columnObj[todo.status] = [...columnObj[todo.status], todo];
        } else {
            columnObj[todo.status] = [todo];
        }
    });

    return columnObj;
};
