'use client';
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Welcome to Ghana Next</h1>
      <div className="space-x-4">
        <Link href="/login" className="px-4 py-2 bg-primary text-white rounded">
          Login
        </Link>
        <Link href="/signup" className="px-4 py-2 bg-secondary text-white rounded">
          Sign Up
        </Link>
      </div>
    </div>
  );
}
