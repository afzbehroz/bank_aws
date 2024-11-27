import { useState, useEffect } from "react";

export default function Account() {
    const [balance, setBalance] = useState(null); // Current account balance
    const [depositAmount, setDepositAmount] = useState(""); // Deposit input value
    const [message, setMessage] = useState(""); // Feedback messages

    // Fetch account balance on component mount
    useEffect(() => {
        const fetchBalance = async () => {
            const token = localStorage.getItem("authToken");
            if (!token) {
                setMessage("You are not logged in!");
                return;
            }

            try {
                const response = await fetch(
                    "http://localhost:3001/me/accounts",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ token }),
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    setBalance(data.balance); // Update balance from backend
                } else {
                    const errorText = await response.text();
                    console.error("Error:", errorText);
                    setMessage("Failed to fetch account details.");
                }
            } catch (error) {
                console.error("Fetch error:", error);
                setMessage("Server error. Please try again later.");
            }
        };

        fetchBalance();
    }, []);

    // Handle deposit submission
    const handleDeposit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("authToken");
        if (!token) {
            setMessage("You are not logged in!");
            return;
        }

        if (!depositAmount || depositAmount <= 0) {
            setMessage("Please enter a valid deposit amount.");
            return;
        }

        try {
            const response = await fetch(
                "http://localhost:3001/me/accounts/transactions",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        token,
                        amount: parseFloat(depositAmount),
                    }),
                }
            );

            if (response.ok) {
                const data = await response.json();
                setBalance(data.balance); // Update balance after deposit
                setMessage("Deposit successful!");
                setDepositAmount(""); // Clear the deposit input field
            } else {
                const errorText = await response.text();
                console.error("Error:", errorText);
                setMessage("Failed to process deposit.");
            }
        } catch (error) {
            console.error("Deposit error:", error);
            setMessage("Server error. Please try again later.");
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <h1 className="text-2xl font-bold mb-4 text-gray-600">
                Account Details
            </h1>
            {message && <p className="text-lg text-red-500 mb-4">{message}</p>}
            {balance !== null && (
                <p className="text-lg text-black mb-6">
                    Your Balance: {balance} SEK
                </p>
            )}
            <form
                onSubmit={handleDeposit}
                className="bg-white p-6 rounded-md shadow-md w-full max-w-md"
            >
                <div className="mb-4">
                    <label
                        htmlFor="deposit"
                        className="block text-sm font-medium text-black"
                    >
                        Deposit Amount
                    </label>
                    <input
                        type="number"
                        id="deposit"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-black sm:text-sm"
                        placeholder="Enter deposit amount"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    Deposit
                </button>
            </form>
        </div>
    );
}
