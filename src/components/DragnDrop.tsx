"use client";

import { serverUrl } from "@/env";
import { DragDropContext } from "@hello-pangea/dnd";
import { useMutation } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";

type mutateType = {
    task: Task;
    userToken: string;
    destinationTitle: string;
    taskPos: number;
};

type Prop = {
    children: React.ReactNode;
    columns: Column;
    setColumns: (...args: any[]) => void;
    organizeData: (...args: any[]) => any;
    socket: any;
    userToken: string;
};

export function DragnDrop({
    children,
    columns,
    setColumns,
    organizeData,
    socket,
    userToken,
}: Prop) {
    useEffect(() => {
        socket.on("updatedTodo", (res: Task[]) => {
            console.log("updated", res);
            setColumns(organizeData(res));
        });

        socket.on("createdTodo", (res: Task[]) => {
            setColumns(organizeData(res));
        });
    }, []);

    const calculatePosition = (
        tasks: Task[],
        dropIndex: number,
        isSameColumn: boolean
    ) => {
        const defaultValue = 65536;

        if (tasks.length === 0) {
            return defaultValue;
        }

        if (dropIndex === 0) {
            return tasks[0].pos / 2;
        }

        const taskLength = isSameColumn ? tasks.length : tasks.length - 1;
        if (dropIndex > 0 && dropIndex < taskLength) {
            return (+tasks[dropIndex - 1].pos + +tasks[dropIndex].pos) / 2;
        }

        if (dropIndex === tasks.length) {
            const lastPos = Math.floor(
                +tasks[tasks.length - 1].pos / defaultValue
            );

            if (lastPos < 1) {
                return defaultValue;
            }

            return defaultValue * (lastPos + 1);
        }

        return defaultValue;
    };

    const mutation = useMutation({
        mutationFn: async (variables: mutateType) => {
            return await fetch(`${serverUrl}/todos/${variables.task.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${variables.userToken}`,
                },
                body: JSON.stringify({
                    status: variables.destinationTitle,
                    pos: variables.taskPos,
                }),
            });
        },
        onSuccess: () => {
            socket.emit("updateTodos", userToken);
        },
    });

    const onDragEnd = useCallback(
        async (result: { destination: any; source: any }) => {
            const { destination, source } = result;
            if (!destination) {
                return;
            }

            const sourceTitle: ColumnTitle = source.droppableId;
            const destinationTitle: ColumnTitle = destination.droppableId;

            const tasks: Task[] = [...columns[sourceTitle]];
            const task = tasks.splice(source.index, 1)[0];
            let updateColumns: Column = { Todo: [], Doing: [], Done: [] };
            let taskPos;

            if (sourceTitle === destinationTitle) {
                // delete item from array
                taskPos = calculatePosition(tasks, destination.index, true);
                task.pos = taskPos;

                tasks.splice(destination.index, 0, task);
                // columns[source.droppableId] = tasks;
                const title = sourceTitle;
                updateColumns = { ...columns, [title]: tasks };
                setColumns(updateColumns);
                // });
            } else {
                const destinationTasks = [...columns[destinationTitle]];
                task.status = destinationTitle;

                taskPos = calculatePosition(
                    destinationTasks,
                    destination.index,
                    false
                );
                task.pos = taskPos;

                destinationTasks.splice(destination.index, 0, task);

                updateColumns = {
                    ...columns,
                    [sourceTitle]: tasks,
                    [destinationTitle]: destinationTasks,
                };
                setColumns(updateColumns);
            }

            mutation.mutate({
                task,
                userToken,
                destinationTitle,
                taskPos,
            });
        },
        [columns]
    );

    return <DragDropContext onDragEnd={onDragEnd}>{children}</DragDropContext>;
}
