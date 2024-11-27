import { useState } from "react";

export default function CreateUser() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:3001/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const data = await response.json();
                setMessage("User created successfully!");
            } else {
                setMessage("Error creating user. Try again.");
            }
        } catch (error) {
            setMessage("Server error. Please try again later.");
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <h1 className="text-3xl font-bold text-blue-700 mb-6">
                Create a New Account
            </h1>
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-md shadow-lg w-full max-w-md"
            >
                <div className="mb-4">
                    <label
                        htmlFor="username"
                        className="block text-lg font-medium text-gray-800"
                    >
                        Username
                    </label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="mt-2 block w-full px-4 py-2 border border-gray-400 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-lg"
                        placeholder="Enter your username"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label
                        htmlFor="password"
                        className="block text-lg font-medium text-gray-800"
                    >
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-2 block w-full px-4 py-2 border border-gray-400 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-lg"
                        placeholder="Enter your password"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full px-6 py-2 bg-blue-600 text-white text-lg rounded-md hover:bg-blue-700 transition font-semibold"
                >
                    Create Account
                </button>
            </form>
            {message && (
                <p className="mt-4 text-center text-lg text-gray-800">
                    {message}
                </p>
            )}
        </div>
    );
}
