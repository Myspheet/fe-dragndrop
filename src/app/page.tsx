"use client";

import { useState } from "react";
import TodoForm from "@/components/TodoForm";
import TodoBoard from "@/components/TodoBoard";
import io from "socket.io-client";
import { serverUrl } from "@/env";
import { DragnDrop } from "@/components/DragnDrop";
import { accessToken } from "@/constant";
import UpdateTodoForm from "@/components/UpdateTodoForm";
import { useCookies } from "next-client-cookies";
import { useRouter } from "next/navigation";
import { organizeData } from "@/helper/functions";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function Home() {
    const router = useRouter();
    const [columns, setColumns] = useState<Column>({
        Todo: [],
        Doing: [],
        Done: [],
    });

    const [taskDetail, setTaskDetail] = useState<Task>();
    const cookies = useCookies();

    const userToken = cookies.get(accessToken) as string;
    const socket = io(serverUrl, {
        query: {
            "my-key": "my-value",
        },
        auth: { userToken },
    });

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["todos"],
        queryFn: async (): Promise<any> => {
            const res = await axios.get(`${serverUrl}/todos`, {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            });

            setColumns(organizeData(res.data));
            return res;
        },
    });

    if (isLoading) return <h2>Loading</h2>;
    if (isError) {
        const err = error as any;

        if (err.response.data.statusCode === 401) {
            cookies.remove(accessToken);
            router.push("/login");
        }
    }

    return (
        <main className="grid grid-flow-col auto-cols-max">
            {taskDetail ? (
                <UpdateTodoForm
                    socket={socket}
                    taskDetail={taskDetail}
                    setTaskDetail={setTaskDetail}
                    userToken={userToken}
                />
            ) : (
                <TodoForm
                    columns={columns}
                    socket={socket}
                    userToken={userToken}
                />
            )}
            <DragnDrop
                socket={socket}
                columns={columns}
                setColumns={setColumns}
                organizeData={organizeData}
                userToken={userToken}
            >
                <TodoBoard
                    columns={columns}
                    socket={socket}
                    setTaskDetail={setTaskDetail}
                    userToken={userToken}
                />
            </DragnDrop>
        </main>
    );
}
