import { Menu, Plus, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

/* ===== types ===== */
type UserData = {
  id: string;
  name: string;
};

type MockDB = {
  users: UserData[];
};

const CURRENT_USER_ID = "user-001";

/* ===== fetcher ===== */
const fetchMockDB = async (): Promise<MockDB> => {
  const { data } = await axios.get("/mock-db.json");
  return data;
};

/* ===== component ===== */
export default function AdminTopbar({
  onMenuClick,
}: {
  onMenuClick?: () => void;
}) {
  const { data, isLoading } = useQuery({
    queryKey: ["mock-db"],
    queryFn: fetchMockDB,
  });

  const currentUser = data?.users.find((u) => u.id === CURRENT_USER_ID);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-4 md:px-8">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-md p-2 hover:bg-gray-100 md:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <h1 className="text-lg font-semibold text-gray-800 md:text-xl">
          Dashboard
        </h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 md:gap-3">
        <Button className="hidden bg-gray-200 text-gray-700 hover:bg-gray-300 md:flex">
          Create Event
        </Button>

        <Button
          size="icon"
          className="bg-gray-200 text-gray-700 hover:bg-gray-300 md:hidden"
        >
          <Plus className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1">
          <UserIcon className="h-4 w-4 text-gray-600" />
          <span className="hidden text-sm text-gray-700 md:inline">
            {isLoading ? "Loading..." : (currentUser?.name ?? "User")}
          </span>
        </div>
      </div>
    </header>
  );
}
