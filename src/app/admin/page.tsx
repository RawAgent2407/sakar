"use client";
import dynamic from "next/dynamic";
import React from "react";

// Dynamically import the admin App to avoid SSR issues
const AdminApp = dynamic(() => import("./App"), { ssr: false });

export default function AdminPage() {
  return <AdminApp />;
} 