import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

import UserLayout from "@/components/layout/UserLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

/* ================= TYPES ================= */

type UserData = {
  id: string;
  name: string;
  email: string;
  phone: string;
  birthDate: string;
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

  const currentUser = data?.users.find(
    (user) => user.id === CURRENT_USER_ID
  );

  /* ================= STATE ================= */

  const [avatar, setAvatar] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    birthDate: "",
  });

  /* ================= EFFECT ================= */

  useEffect(() => {
    if (!currentUser) return;

    const [firstName, ...lastNameParts] = currentUser.name.split(" ");

    setForm({
      firstName,
      lastName: lastNameParts.join(" "),
      email: currentUser.email,
      phone: currentUser.phone,
      birthDate: currentUser.birthDate,
    });

    if (currentUser.avatarUrl) {
      setAvatar(currentUser.avatarUrl);
    }
  }, [currentUser]);

  /* ================= HANDLERS ================= */

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
      name: `${form.firstName} ${form.lastName}`,
      email: form.email,
      phone: form.phone,
      // birthDate: form.birthDate,
      avatar,
    };

    console.log("DATA DIKIRIM:", payload);
    alert("Profil berhasil disimpan (mock)");
  };

  /* ================= RENDER ================= */

  if (isLoading) {
    return (
      <UserLayout>
        <p className="text-gray-500">Loading...</p>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="max-w-4xl">
        <h2 className="mb-6 text-lg font-semibold text-gray-800">
          Informasi Personal
        </h2>

        <div className="rounded-lg bg-white p-6 shadow-sm">
          {/* Avatar */}
          <h3 className="mb-1 font-medium">Gambar Profil</h3>
          <p className="mb-6 text-sm text-muted-foreground">
            Avatar dan foto sampul adalah gambar pertama yang akan dilihat
            di akun profilmu.
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
                <span className="text-sm text-white">Ganti</span>
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

          {/* Form */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <Label className="mb-2">Nama Depan</Label>
              <Input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="Nama depan"
              />
            </div>

            <div>
              <Label className="mb-2">Nama Belakang</Label>
              <Input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Nama belakang"
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
              <Label className="mb-2">Nomor Ponsel</Label>
              <Input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="08xxxxxxxxxx"
              />
            </div>

            {/* <div>
              <Label className="mb-2">Tanggal Lahir</Label>
              <Input
                type="date"
                name="birthDate"
                value={form.birthDate}
                onChange={handleChange}
              />
            </div> */}
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
    </UserLayout>
  );
}
