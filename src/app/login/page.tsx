'use client';
import React, { FormEvent, useState } from 'react';

export default function Page() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }
    try {
      await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      window.location.href = '/admin';
    } catch (error: unknown) {
      if (error) {
        setError('Something went wrong try again with correct credentials');
      }
    }
  }
  return (
    <form
      onSubmit={handleSubmit}
      className="h-full w-full bg-appBg flex justify-center items-center flex-col"
    >
      {error && <p className="text-red-500">{error}</p>}
      <input
        type="email"
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit" className="bg-appMuted">
        Login
      </button>
    </form>
  );
}
