"use client";
import { Droppable } from "@hello-pangea/dnd";
import Task from "./Task";

type Props = {
    title: ColumnTitle;
    tasks: Task[];
    socket: any;
    setTaskDetail: any;
    userToken: string;
};
export default function Column({
    title,
    tasks = [],
    socket,
    setTaskDetail,
    userToken,
}: Props) {
    return (
        <div className="flex flex-col flex-shrink-0 w-72">
            <div className="flex items-center flex-shrink-0 h-10 px-2">
                <span className="block text-sm font-semibold">{title}</span>
                <span className="flex items-center justify-center w-5 h-5 ml-2 text-sm font-semibold text-indigo-500 bg-white rounded bg-opacity-30">
                    {tasks?.length}
                </span>
            </div>
            <Droppable droppableId={title}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        style={{
                            backgroundColor: snapshot.isDraggingOver
                                ? "blue"
                                : "grey",
                        }}
                        {...provided.droppableProps}
                        className="flex flex-col pb-2"
                    >
                        {tasks.map((task, id) => (
                            <Task
                                key={id}
                                title={title}
                                task={task}
                                index={id}
                                socket={socket}
                                setTaskDetail={setTaskDetail}
                                userToken={userToken}
                            />
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    );
}
