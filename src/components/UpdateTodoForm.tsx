"use client";

import { serverUrl } from "@/env";

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
    const updateTodo = async (formData: FormData) => {
        try {
            const title = formData.get("title");
            const status = formData.get("status");
            const description = formData.get("description");
            const pos = taskDetail.pos;

            const formFields = { title, status, description, pos };
            await fetch(`${serverUrl}/todos/${taskDetail.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userToken}`,
                },
                body: JSON.stringify(formFields),
            });

            setTaskDetail();
            socket.emit("todoUpdate", userToken);
        } catch (error: any) {
            console.log(error.message);
        }
    };

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
                <form action={updateTodo}>
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
                                defaultValue={taskDetail.title}
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
                                defaultValue={taskDetail.status}
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
                                defaultValue={taskDetail.description}
                                rows={8}
                                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                placeholder="Your description here"
                            ></textarea>
                        </div>
                    </div>
                    <button
                        type="submit"
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
