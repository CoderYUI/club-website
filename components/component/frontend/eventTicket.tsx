"use client";
import { useState } from "react";

export default function TicketForm() {
  const API_URL = "http://linpack.vercel.app/api";
  console.log("API URL:", API_URL); 

  const [name, setName] = useState("");
  const [regNo, setRegNo] = useState("");
  const [error, setError] = useState("");
  console.log("name:", name, "regNo:", regNo, "error:", error);

  const generateTicket = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`${API_URL}/py/generate-ticket`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ name, reg_no: regNo }),
      });
      const blob = await response.blob();
      const href = URL.createObjectURL(blob);
      const a = document.createElement("a");
      document.body.appendChild(a);
      // @ts-ignore
      a.style = "display: none";
      // @ts-ignore
      a.href = href;
      // @ts-ignore
      a.download = `${regNo}_ticket.png`;
      a.click();

    } catch (err) {
      console.error("Ticket generation error:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-xl font-bold mb-4">Generate Ticket</h2>
      <form onSubmit={generateTicket} className="space-y-4">
        <input
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
        <input
          type="text"
          placeholder="Enter Reg No"
          value={regNo}
          onChange={(e) => setRegNo(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Generate Ticket
        </button>
      </form>

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
