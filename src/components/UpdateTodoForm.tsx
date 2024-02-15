"use client";

import { serverUrl } from "@/env";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { FormEvent, useState } from "react";

type Prop = {
    taskDetail: Task;
    socket: any;
    setTaskDetail: any;
    userToken: string;
};

export default function UpdateTodoForm({
    socket,
    taskDetail,
    setTaskDetail,
    userToken,
}: Prop) {
    const [title, setTitle] = useState<string>(taskDetail.title);
    const [status, setStatus] = useState<string>(taskDetail.status);
    const [description, setDescription] = useState<string>(
        taskDetail.description
    );

    const { mutate: updateTodo } = useMutation({
        mutationFn: async (e: FormEvent<HTMLButtonElement>) => {
            e.preventDefault();
            const pos = taskDetail.pos;

            return await axios.patch(
                `${serverUrl}/todos/${taskDetail.id}`,
                { title, status, description, pos },
                {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                }
            );
        },
        onSuccess: () => {
            setTaskDetail();
            socket.emit("todoUpdate", userToken);
        },
    });

    const clearTodo = (e: any) => {
        e.preventDefault();
        setTaskDetail();
    };

    return (
        <section className="bg-white dark:bg-gray-900">
            <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
                <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                    Update Todo
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
                                id="title"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                placeholder="Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
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
                                id="description"
                                name="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={8}
                                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                placeholder="Your description here"
                            ></textarea>
                        </div>
                    </div>
                    <button
                        onClick={(e) => updateTodo(e)}
                        className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
                    >
                        Update Todo
                    </button>
                    <button
                        onClick={clearTodo}
                        className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
                    >
                        Clear
                    </button>
                </form>
            </div>
        </section>
    );
}
