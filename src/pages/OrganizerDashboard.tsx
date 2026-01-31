import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

import AdminLayout from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

/* ================= TYPES ================= */

type UserData = {
  id: string;
  name: string;
  email: string;
  phone: string;
  bio: string;
  avatarUrl?: string;
};

type MockDB = {
  users: UserData[];
};

const CURRENT_USER_ID = "user-001";

/* ================= API ================= */

const fetchMockDB = async (): Promise<MockDB> => {
  const { data } = await axios.get<MockDB>("/mock-db.json");
  return data;
};

/* ================= COMPONENT ================= */

export default function EditProfileInformasi() {
  const { data, isLoading } = useQuery({
    queryKey: ["mock-db"],
    queryFn: fetchMockDB,
  });

  const currentUser = data?.users.find((user) => user.id === CURRENT_USER_ID);

  /* ================= STATE ================= */

  const [avatar, setAvatar] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    bio: "",
  });

  /* ================= EFFECT ================= */

  useEffect(() => {
    if (!currentUser) return;

    setForm({
      fullName: currentUser.name,
      email: currentUser.email,
      phone: currentUser.phone,
      bio: currentUser.bio,
    });

    if (currentUser.avatarUrl) {
      setAvatar(currentUser.avatarUrl);
    }
  }, [currentUser]);

  /* ================= HANDLERS ================= */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      alert("Ukuran gambar maksimal 1MB");
      return;
    }

    setAvatar(URL.createObjectURL(file));
  };

  const handleSubmit = () => {
    const payload = {
      id: CURRENT_USER_ID,
      name: form.fullName.trim(),
      email: form.email,
      phone: form.phone,
      bio: form.bio,
      avatar,
    };

    console.log("DATA DIKIRIM:", payload);
    alert("Profil berhasil disimpan (mock)");
  };

  /* ================= RENDER ================= */

  if (isLoading) {
    return (
      <AdminLayout>
        <p className="text-gray-500">Loading...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="w-full">
        <h2 className="mb-6 text-lg font-semibold text-gray-800">
          Organizer Information
        </h2>

        <div className="rounded-lg bg-white p-6 shadow-sm">
          {/* Avatar */}
          <h3 className="mb-1 font-medium">Profile Picture</h3>
          <p className="mb-6 text-sm text-muted-foreground">
            Your avatar is the first image people see on your profile.
          </p>

          <div className="mb-8 flex items-center gap-6">
            <div className="group relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={avatar ?? undefined} />
                <AvatarFallback>👤</AvatarFallback>
              </Avatar>

              <div
                onClick={() => inputRef.current?.click()}
                className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/40 opacity-0 transition group-hover:opacity-100"
              >
                <span className="text-sm text-white">Change</span>
              </div>
            </div>

            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleUpload}
            />
          </div>

          {/* Form (1 Column) */}
          <div className="flex flex-col gap-6">
            <div>
              <Label className="mb-2">Organizer Name</Label>
              <Input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Full name"
              />
            </div>

            <div>
              <Label className="mb-2">Email</Label>
              <Input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="email@example.com"
              />
            </div>

            <div>
              <Label className="mb-2">Mobile Number</Label>
              <Input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="08xxxxxxxxxx"
              />
            </div>

            <div>
              <Label className="mb-2">Bio</Label>
              <Textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                placeholder="Tell something about yourself..."
                rows={4}
              />
            </div>
          </div>

          {/* Submit */}
          <div className="mt-10 flex justify-end">
            <Button
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Simpan
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
