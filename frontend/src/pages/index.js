import Link from "next/link";

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <h1 className="text-4xl font-extrabold text-blue-700">
                Welcome to the Bank App
            </h1>
            <p className="text-lg mt-4 text-gray-600">
                Manage your finances effortlessly.
            </p>
            <div className="mt-6">
                <Link
                    href="/create-user"
                    className="px-6 py-3 bg-blue-500 text-white text-lg rounded-lg shadow-md hover:bg-blue-600 transition"
                >
                    Create an Account
                </Link>
            </div>
        </div>
    );
}
