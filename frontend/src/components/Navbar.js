import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="flex justify-around py-4 bg-blue-500 text-white">
            <Link href="/">Home</Link>
            <Link href="/create-user">Create User</Link>
            <Link href="/login">Login</Link>
        </nav>
    );
}
