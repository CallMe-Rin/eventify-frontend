import { useState } from "react";
import { Tent } from "lucide-react";
import AdminLayout from "@/components/layout/AdminLayout";
import CreateEvent from "@/components/layout/CreateEvent";

type TabKey = "aktif" | "draft" | "lalu";

export default function DashboardEvent() {
  const [activeTab, setActiveTab] = useState<TabKey>("aktif");
  const [openCreateEvent, setOpenCreateEvent] = useState(false); // 👈 modal state

  const tabs: { key: TabKey; label: string }[] = [
    { key: "aktif", label: "EVENT AKTIF" },
    { key: "draft", label: "EVENT DRAFT" },
    { key: "lalu", label: "EVENT LALU" },
  ];

  return (
    <AdminLayout>
      <div className="w-full">
        {/* Tabs */}
        <div className="border-b">
          <div className="flex gap-12">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative py-4 text-sm font-medium transition ${
                  activeTab === tab.key
                    ? "text-black"
                    : "text-muted-foreground hover:text-black"
                }`}
              >
                {tab.label}

                {activeTab === tab.key && (
                  <span className="absolute bottom-0 left-0 h-0.5 w-full bg-blue-600" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
          <Tent className="mb-6 h-28 w-28 text-muted-foreground/30" />

          {/* 👇 OPEN MODAL */}
          <button
            onClick={() => setOpenCreateEvent(true)}
            className="mb-6 cursor-pointer rounded-lg bg-emerald-500 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Create Event
          </button>

          <p className="text-base font-semibold">
            Hi, thank you for using EVENTIFY service.
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Please create your event by clicking the &quot;Create Eventt&quot;
            in on.
          </p>
        </div>
      </div>

      {/* ================= MODAL ================= */}
      <CreateEvent open={openCreateEvent} onOpenChange={setOpenCreateEvent} />
    </AdminLayout>
  );
}
