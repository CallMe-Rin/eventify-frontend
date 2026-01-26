import React from "react";
import { Button } from "@/components/ui/button";
import { User as UserIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

/* ================= TYPES ================= */

type UserData = {
  id: string;
  name: string;
};

type MockDB = {
  users: UserData[];
};

const CURRENT_USER_ID = "user-001";

/* ================= FETCHER ================= */

const fetchMockDB = async (): Promise<MockDB> => {
  const { data } = await axios.get<MockDB>("/mock-db.json");
  return data;
};

/* ================= COMPONENT ================= */

export default function UserTopbar() {
  const { data, isLoading } = useQuery({
    queryKey: ["mock-db"],
    queryFn: fetchMockDB,
  });

  const currentUser = data?.users.find(
    (user) => user.id === CURRENT_USER_ID
  );

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-8">
      <h1 className="text-xl font-semibold text-gray-800">
        Profil Kamu
      </h1>

      <div className="flex items-center gap-3">
        <Button className="bg-gray-300 text-gray-700 hover:bg-gray-400">
          Buat Event
        </Button>

        <div className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1">
          <UserIcon className="h-4 w-4 text-gray-600" />

          {isLoading ? (
            <span className="text-sm text-gray-400">Loading...</span>
          ) : (
            <span className="text-sm text-gray-700">
              {currentUser?.name ?? "User"}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
