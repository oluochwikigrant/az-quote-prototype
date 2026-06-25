"use client";

import React, { FC } from "react";
import { useRouter } from "next/navigation";

export interface UserDetails {
  id: string;
  firstName: string;
  lastName: string;
  userName?: string;
  email: string;
  role: string;
}

interface UserViewProps {
  data: UserDetails;
}

const UserView: FC<UserViewProps> = ({ data }) => {
  const router = useRouter();

  const goBack = () => {
    router.back();
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md max-w-xl mx-auto">
      <button
        onClick={goBack}
        className="mb-4 text-sm font-medium text-blue-600 hover:underline"
      >
        &larr; Back to All Users
      </button>
      <div>
        <h2 className="text-2xl font-semibold mb-2">
          First Name: {data.firstName}
        </h2>
        <h2 className="text-2xl font-semibold mb-2">
          Second Name: {data.lastName}
        </h2>
      </div>
      <div className="space-y-3">
        <div>
          <span className="font-medium">username:</span> {data.userName}
        </div>
        <div>
          <span className="font-medium">Email:</span> {data.email}
        </div>
        <div>
          <span className="font-medium">Role:</span> {data.role}
        </div>
      </div>
    </div>
  );
};

export default UserView;
