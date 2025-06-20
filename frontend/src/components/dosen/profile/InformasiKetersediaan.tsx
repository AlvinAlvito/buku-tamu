import { useEffect, useState } from "react";
import { useModal } from "../../../hooks/useModal";
import { Modal } from "../../ui/modal";
import Button from "../../ui/button/Button";
import Input from "../../form/input/InputField";
import Label from "../../form/Label";
import Switch from "../../form/switch/Switch";
import Badge from "../../ui/badge/Badge";
import Select from "../../form/Select";
import { PenBoxIcon } from "lucide-react";
import { baseUrl } from "../../../lib/api";

export default function InformasiKetersediaan() {
  const coordinate = {
    lat: -3.597031,
    lng: 98.678513
  };

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const mapsLink = `https://www.google.com/maps?q=${lat},${lon}`;
          setForm((prev) => ({ ...prev, maps: mapsLink }));
        },
        (error) => {
          console.error("Gagal mendapatkan lokasi:", error.message);
        }
      );
    } else {
      console.error("Geolocation tidak didukung oleh browser ini.");
    }
  }, []);
  const getEmbedUrl = (url: string | undefined): string => {
    const defaultLocation = "3.600840,98.681326";


    if (!url || url.trim() === "") {
      return `https://www.google.com/maps?q=${defaultLocation}&hl=es;z=14&output=embed`;
    }

    try {
      const urlObj = new URL(url);

      if (urlObj.hostname.includes("google.com") && urlObj.pathname.includes("/maps")) {
        const q = urlObj.searchParams.get("q");
        if (q) {
          return `https://www.google.com/maps?q=${encodeURIComponent(q)}&hl=es;z=14&output=embed`;
        } else {
          return `https://www.google.com/maps?q=${encodeURIComponent(url)}&hl=es;z=14&output=embed`;
        }
      }
    } catch {
      // Kalau url bukan URL valid, anggap itu koordinat langsung
      return `https://www.google.com/maps?q=${encodeURIComponent(url)}&hl=es;z=14&output=embed`;
    }

    // fallback
    return `https://www.google.com/maps?q=${defaultLocation}&hl=es;z=14&output=embed`;
  };


  const { isOpen, openModal, closeModal } = useModal();
  const [form, setForm] = useState({
    lokasi: "",
    gedung: "",
    jadwal: "",
    maps: "",
    status: true,
    waktu_mulai: "",
    waktu_selesai: "",
  });
  const [ketersediaanId, setKetersediaanId] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (!user?.id) return;

    fetch(`${baseUrl}/api/ketersediaan/${user.id}`)
      .then((r) => r.json())
      .then((d) => {
        if (!d) return;

        const baseForm = {
          lokasi: d.lokasi_kampus ?? "",
          gedung: d.gedung_ruangan ?? "",
          jadwal: d.jadwal_libur ?? "",
          maps: d.link_maps ?? "",
          status: d.status_ketersediaan === "Tersedia",
          waktu_mulai: d.waktu_mulai ?? "",
          waktu_selesai: d.waktu_selesai ?? "",
        };

        // Kalau belum ada maps (lokasi kosong), ambil lokasi baru
        if (!d.link_maps) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
              setForm({
                ...baseForm,
                maps: mapsLink,
              });
            },
            (error) => {
              console.error("Gagal ambil lokasi:", error);
              setForm(baseForm);
            },
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 0,
            }
          );

        } else {
          setForm(baseForm);
        }

        setKetersediaanId(d.id);
      })
      .catch(console.error);
  }, [user]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = () => {
    if (!form.lokasi || form.lokasi.trim() === "") {
      alert("Lokasi kampus wajib diisi!");
      return;
    }
    if (!ketersediaanId) {
      console.error("ID ketersediaan tidak ditemukan.");
      return;
    }

    fetch(`${baseUrl}/api/ketersediaan/${ketersediaanId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lokasi_kampus: form.lokasi,
        gedung_ruangan: form.gedung,
        jadwal_libur: form.jadwal,
        link_maps: form.maps,
        status_ketersediaan: form.status ? "Tersedia" : "Tidak Tersedia",
        waktu_mulai: form.waktu_mulai,
        waktu_selesai: form.waktu_selesai,
      }),
    })
      .then(async (r) => {
        if (!r.ok) throw new Error(await r.text());
        return r.json();
      })
      .then(() => {
        closeModal();
      })
      .catch((err) => console.error("Gagal menyimpan:", err));
  };

  const kampusOptions = [
    { value: "Kampus 1 UINSU Sutomo", label: "Kampus 1 UINSU Sutomo" },
    { value: "Kampus 2 UINSU Pancing", label: "Kampus 2 UINSU Pancing" },
    { value: "Kampus 3 UINSU Helvetia", label: "Kampus 3 UINSU Helvetia" },
    { value: "Kampus 4 UINSU Tuntungan", label: "Kampus 4 UINSU Tuntungan" },
    { value: "Lainnya", label: "Lainnya" }
  ];
  return (
    <>
      <div className="p-5 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-start lg:justify-between">
          <div>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:mb-6">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Informasi Lokasi & Ketersediaan Anda
              </h4>
              <Button
                size="sm"
                onClick={openModal}
                variant="primary"
                className=" flex items-center gap-2 justify-center m-2"
              >
                <PenBoxIcon size={16} />
                Update Informasi Lokasi & Ketersediaan Anda
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 lg:gap-7 2xl:gap-x-32">
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Lokasi Kampus
                </p>
                <p className="text-xl font-medium text-gray-800 dark:text-white/90">
                  {form.lokasi}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Gedung/Ruangan
                </p>
                <p className="text-xl font-medium text-gray-800 dark:text-white/90">
                  {form.gedung}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Jadwal Tetap Dosen
                </p>
                <p className="text-xl font-medium text-gray-800 dark:text-white/90">
                  Hari: {form.jadwal}
                </p>
                <p className="text-xl font-medium text-gray-800 dark:text-white/90">
                  {form.waktu_mulai && form.waktu_selesai
                    ? `${form.waktu_mulai.slice(0, 5)} - ${form.waktu_selesai.slice(0, 5)}`
                    : "-"}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Status Ketersediaan Saat ini
                </p>
                <p className="text-xl font-medium text-gray-800 dark:text-white/90">
                  {form.status ? (
                    <Badge variant="light" color="success">
                      Tersedia
                    </Badge>
                  ) : (
                    <Badge variant="light" color="error">
                      Tidak Tersedia
                    </Badge>
                  )}
                </p>
              </div>



            </div>


          </div>
          <div>
            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
              Lokasi Anda di Goggle Maps
            </p>
            <div className="relative rounded-xl overflow-hidden border border-gray-300 dark:border-gray-700" style={{ height: 200 }}>
              <iframe
                width="100%"
                height="200"
                loading="lazy"
                allowFullScreen
                className="rounded-xl pointer-events-none"
                src={getEmbedUrl(form.maps)}
              ></iframe>

              <a
                href={form.maps || "https://www.google.com/maps?q=3.5952,98.6722"}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 z-10"
                style={{ cursor: "pointer" }}
              ></a>
            </div>
            <div className="px-4 py-2 bg-white dark:bg-gray-900 text-sm text-gray-800 dark:text-white/90">
              Koordinat: <span className="font-medium">{coordinate.lat}, {coordinate.lng}</span>
            </div>

          </div>

        </div>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Update Informasi Ketersediaan anda Saat ini
            </h4>
          </div>
          <form className="flex flex-col">
            <div className="px-2 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Lokasi Kampus */}
                <div>
                  <Label>Pilih Lokasi Kampus</Label>
                  <Select
                    options={kampusOptions}
                    placeholder="Pilih lokasi kampus"
                    value={form.lokasi}
                    onChange={(value: string) =>
                      setForm((prev) => ({ ...prev, lokasi: value }))
                    }
                  />
                </div>

                {/* Gedung / Ruangan */}
                <div>
                  <Label>Gedung/Ruangan</Label>
                  <Input
                    name="gedung"
                    type="text"
                    value={form.gedung}
                    onChange={handleChange}
                  />
                </div>

                {/* Status Ketersediaan */}
                <div>
                  <Label>Status Ketersediaan Saat ini</Label>
                  <div className="flex items-center gap-3 mt-1">
                    <Switch
                      label=""
                      checked={form.status}
                      onChange={(checked) =>
                        setForm((prev) => ({ ...prev, status: checked }))
                      }
                      color="blue"
                    />
                    {form.status ? (
                      <Badge variant="light" color="success">
                        Tersedia
                      </Badge>
                    ) : (
                      <Badge variant="light" color="error">
                        Tidak Tersedia
                      </Badge>
                    )}
                  </div>
                </div>
                {/* Lokasi Maps */}
                <div >
                  <Label>Lokasi Maps Anda terisi secara otomatis</Label>
                  <Input
                    name="maps"
                    value={form.maps}
                    type="text"
                    onChange={handleChange}
                    disabled
                  />
                </div>

                {/* Header Jadwal Tetap Dosen */}
                <div className="lg:col-span-2">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                    Jadwal Tetap Anda
                  </h3>
                </div>

                {/* Hari */}
                <div>
                  <Label>Hari</Label>
                  <Input
                    name="jadwal"
                    placeholder="Senin s/d Jum'at"
                    type="text"
                    value={form.jadwal}
                    onChange={handleChange}
                  />
                </div>

                {/* Jam Tersedia & Jam Pulang dalam 1 row */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label>Jam Tersedia</Label>
                    <Input
                      name="waktu_mulai"
                      type="time"
                      value={form.waktu_mulai || ""}
                      onChangeTime24={(val) =>
                        setForm((prev) => ({ ...prev, waktu_mulai: val }))
                      }
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <Label>Jam Tidak Tesedia</Label>
                    <Input
                      name="waktu_selesai"
                      type="time"
                      value={form.waktu_selesai || ""}
                      onChangeTime24={(val) =>
                        setForm((prev) => ({ ...prev, waktu_selesai: val }))
                      }
                      onChange={handleChange}
                    />
                  </div>
                </div>



              </div>

            </div>

            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Tutup
              </Button>
              <Button size="sm" onClick={handleSave}>
                Simpan
              </Button>
            </div>
          </form>

        </div>
      </Modal>
    </>
  );
}
