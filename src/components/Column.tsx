"use client";
import { Droppable } from "@hello-pangea/dnd";
import Task from "./Task";

type Props = {
    title: ColumnTitle;
    tasks: Task[];
    socket: any;
    setTaskDetail: any;
};
export default function Column({
    title,
    tasks = [],
    socket,
    setTaskDetail,
}: Props) {
    return (
        <div className="flex flex-col flex-shrink-0 w-72">
            <div className="flex items-center flex-shrink-0 h-10 px-2">
                <span className="block text-sm font-semibold">{title}</span>
                <span className="flex items-center justify-center w-5 h-5 ml-2 text-sm font-semibold text-indigo-500 bg-white rounded bg-opacity-30">
                    {tasks?.length}
                </span>
                <button className="flex items-center justify-center w-6 h-6 ml-auto text-indigo-500 rounded hover:bg-indigo-500 hover:text-indigo-100">
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        ></path>
                    </svg>
                </button>
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
                            />
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    );
}
