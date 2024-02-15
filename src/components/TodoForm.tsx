"use client";

import { serverUrl } from "@/env";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { FormEvent, useRef, useState } from "react";

type Prop = {
    columns: Column;
    socket: any;
    userToken: string;
};

type MyFormStatus = "Todo" | "Doing" | "Done";

export default function TodoForm({ columns, socket, userToken }: Prop) {
    const ref = useRef<HTMLFormElement>(null);

    const [title, setTitle] = useState<string>("");
    const [status, setStatus] = useState<string>("");
    const [description, setDescription] = useState<string>("");

    const defaultPos = 65536;
    const calculatePos = (columns: Column, status: MyFormStatus) => {
        const selectColumn = columns[status];
        if (selectColumn.length > 0) {
            const lastTodoPos = selectColumn[selectColumn.length - 1].pos;
            let currentPos = Math.floor(lastTodoPos / 65536);

            if (currentPos > 0) {
                currentPos = (currentPos + 1) * defaultPos;

                return currentPos;
            }

            return defaultPos;
        }

        return defaultPos;
    };

    const { mutate: createTodo } = useMutation({
        mutationFn: async (e: FormEvent<HTMLButtonElement>) => {
            e.preventDefault();
            const pos = calculatePos(columns, status as MyFormStatus);

            return await axios.post(
                `${serverUrl}/todos`,
                { title, status, description, pos },
                {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                }
            );
        },
        onSuccess: () => {
            socket.emit("createdTodo", userToken);
        },
    });

    return (
        <section className="bg-white dark:bg-gray-900">
            <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
                <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                    Add Todo
                </h2>
                <form>
                    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                placeholder="Title"
                                required={true}
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Status
                            </label>
                            <select
                                id="status"
                                name="status"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                required={true}
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <option>Select Status</option>
                                <option value="Todo">Todo</option>
                                <option value="Doing">Doing</option>
                                <option value="Done">Done</option>
                            </select>
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Description
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                name="description"
                                rows={8}
                                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                placeholder="Your description here"
                            ></textarea>
                        </div>
                    </div>
                    <button
                        onClick={(e) => createTodo(e)}
                        className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
                    >
                        Add Todo
                    </button>
                </form>
            </div>
        </section>
    );
}
