'use client';

import { useRouter } from "next/navigation";

export default function Home() {

  const router = useRouter();

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const fullName = formData.get("fullName") as string;
    const password = formData.get("password") as string;

    await fetch("/api/authenticate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fullName, password }),
    });

    router.push("/dashboard");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold">Welcome to the Classroom Redesign!</h1>
      <p className="mt-4 text-lg text-gray-600">Please enter your name and wait for further instructions.</p>
      <form onSubmit={handleSubmit} className="mt-6 flex flex-col items-center">
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          className="px-4 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="px-4 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Submit
        </button>
      </form>
    </div>
  )
}
