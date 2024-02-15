"use client";
import React, { FormEvent } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { DeleteRounded, EditOutlined } from "@mui/icons-material";
import { red } from "@mui/material/colors";
import { serverUrl } from "@/env";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

type Props = {
    title: string;
    task: Task;
    index: number;
    socket: any;
    setTaskDetail: any;
    userToken: string;
};
export default function Task({
    title,
    task,
    index,
    socket,
    setTaskDetail,
    userToken,
}: Props) {
    const { mutate: deleteTask } = useMutation({
        mutationFn: async (e: FormEvent<HTMLButtonElement>) => {
            e.preventDefault();

            return await axios.delete(`${serverUrl}/todos/${task.id}`, {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            });
        },
        onSuccess: () => {
            setTaskDetail();
            socket.emit("deleteTodo", userToken);
        },
    });

    const editTask = () => {
        setTaskDetail();
        setTaskDetail(task);
    };
    return (
        <Draggable key={task.id} draggableId={`${task.id}`} index={index}>
            {(provided, snapshot) => {
                return (
                    <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="relative flex flex-col items-start p-4 mt-3 bg-white rounded-lg cursor-pointer bg-opacity-90 group hover:bg-opacity-100"
                        draggable="true"
                    >
                        <button
                            onClick={deleteTask}
                            className="absolute top-0 right-0 flex items-center justify-center hidden w-5 h-5 mt-3 mr-2 text-gray-500 rounded hover:bg-gray-200 hover:text-gray-700 group-hover:flex"
                        >
                            <DeleteRounded sx={{ color: red[500] }} />
                        </button>
                        <span className="flex items-center h-6 px-3 text-xs font-semibold text-pink-500 bg-pink-100 rounded-full">
                            {task.title}
                        </span>
                        <h4 className="mt-3 text-sm font-medium">
                            {task.description}
                        </h4>
                        <div className="flex items-center w-full mt-3 text-xs font-medium text-gray-400">
                            <div className="flex items-center">
                                <button
                                    onClick={editTask}
                                    className="absolute bottom-1 right-0 flex items-center justify-center hidden w-5 h-5 mt-2 mr-3 text-gray-500 rounded hover:bg-gray-200 hover:text-gray-700 group-hover:flex"
                                >
                                    <EditOutlined sx={{ color: red[500] }} />
                                </button>
                            </div>
                        </div>
                    </div>
                );
            }}
        </Draggable>
    );
}
