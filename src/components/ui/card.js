"use client";
import React from "react";

// Card container
export function Card({ className = "", children }) {
  return (
    <div
      className={`rounded-xl border border-gray-200 bg-white shadow-sm p-6 ${className}`}
    >
      {children}
    </div>
  );
}

// Header section
export function CardHeader({ className = "", children }) {
  return <div className={`mb-4 ${className}`}>{children}</div>;
}

// Title
export function CardTitle({ className = "", children }) {
  return (
    <h3
      className={`text-lg font-semibold leading-none tracking-tight ${className}`}
    >
      {children}
    </h3>
  );
}

// Description
export function CardDescription({ className = "", children }) {
  return (
    <p className={`text-sm text-gray-500 mt-1 ${className}`}>{children}</p>
  );
}

// Content (body)
export function CardContent({ className = "", children }) {
  return <div className={`mt-2 ${className}`}>{children}</div>;
}
