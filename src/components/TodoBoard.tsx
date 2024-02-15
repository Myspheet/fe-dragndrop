import Column from "@/components/Column";
import { accessToken } from "@/constant";
import { LogoutOutlined } from "@mui/icons-material";
import { red } from "@mui/material/colors";
import { useCookies } from "next-client-cookies";
import { redirect, useRouter } from "next/navigation";

type Prop = {
    columns: Column;
    socket: any;
    setTaskDetail: any;
};
export default function TodoBoard({ columns, socket, setTaskDetail }: Prop) {
    const cookies = useCookies();
    const router = useRouter();

    const logout = () => {
        cookies.remove(accessToken);

        router.push("/login");
    };
    return (
        <div className="flex flex-col w-screen h-screen overflow-auto text-gray-700 bg-gradient-to-tr from-blue-200 via-indigo-200 to-pink-200">
            <div className="flex items-center flex-shrink-0 w-full h-16 px-10 bg-white bg-opacity-75">
                <button onClick={logout}>
                    <LogoutOutlined sx={{ color: red[500] }} />
                    Logout
                </button>
            </div>
            <div className="px-10 mt-6">
                <h1 className="text-2xl font-bold">Team Project Board</h1>
            </div>
            <div className="flex flex-grow px-10 mt-4 space-x-6">
                {Object.keys(columns).map((column: string, id: any) => (
                    <Column
                        key={id}
                        title={column as ColumnTitle}
                        tasks={columns[column as ColumnTitle]}
                        socket={socket}
                        setTaskDetail={setTaskDetail}
                    />
                ))}
                <div className="flex-shrink-0 w-6"></div>
            </div>
        </div>
    );
}
