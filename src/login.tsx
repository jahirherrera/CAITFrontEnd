import { useState } from "react";
import type { UserLogin } from "./assets/type";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const login = async () => {

        if(username === "" || password === ""){
            setErrorMessage("Please fill in both username and password");
            return;
        }


        const userLogin: UserLogin = {
            username: username,
            password: password
        }

        try {
            const response = await fetch("http://localhost:8080/login", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userLogin)
            });

            if (!response.ok) {
                throw new Error("Could not login. Please check your credentials.");
            }

            navigate("/main");
            localStorage.setItem("username", username);
        }

        catch (error) {
            console.error("Login failed", error);
        }
    }



    return (
        <>
            <div className="grid grid-rows-[20%_80%] items-center justify-center h-screen w-full bg-gray-200 gap-5">
                <h1 className="text-5xl font-bold flex items-center justify-center ">C<p className="flex  place-items-end text-2xl h-12 mr-2">ontinuous</p> A<p className="flex  place-items-end text-2xl h-12 mr-2">daptive</p> I<p className="flex  place-items-end text-2xl h-12 mr-2">nterval</p> T<p className="flex  place-items-end text-2xl h-12 mr-2">raining</p></h1>
                <div className="flex flex-col items-center justify-around border-2 max-w-120 min-w-100 min-h-100 border-gray-300 p-4 rounded-lg shadow-2xl ">
                    <div>
                        <label htmlFor="username" className="mr-3 text-lg font-medium text-gray-700">
                            Username:
                        </label>
                        <input id="username" type="text" placeholder="Username" value={username} className="border-b border-black  hover:cursor-pointer" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)} />
                    </div>
                    <div>
                        <label htmlFor="password" className="mr-3 text-lg font-medium text-gray-700">
                            Password:
                        </label>
                        <input id="password" type="password" placeholder="Password" value={password} className="border-b border-black  hover:cursor-pointer" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-background text-foreground text-sm font-medium border border-border hover:shadow-md transition-all duration-200 active:scale-95 hover:cursor-pointer" onClick={login}>
                        Login
                    </button>
                    <div className="flex flex-col items-center justify-center gap-2">
                        <h2 className="text-sm">Don't have an account? <a >Sign up</a></h2>
                        <h2 className="text-md">Forgot your password? <a >Reset it</a></h2>
                    </div>
                    <h2 className="text-sm text-red-500 min-h-5">{errorMessage}</h2>
                </div>
            </div>

        </>
    )
}