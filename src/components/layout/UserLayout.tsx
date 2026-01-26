import SidebarUser from "@/components/layout/SidebarUser";
import UserTopbar from "@/components/layout/UserTopbar";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarUser />

      <div className="flex flex-1 flex-col">
        <UserTopbar />

        <main className="flex-1 px-8 py-6">{children}</main>
      </div>
    </div>
  );
}
