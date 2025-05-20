import { useEffect, useState } from "react";
import { useModal } from "../../../hooks/useModal";
import { Modal } from "../../ui/modal";
import Button from "../../ui/button/Button";
import Input from "../../form/input/InputField";
import Label from "../../form/Label";
import Switch from "../../form/switch/Switch";
import Badge from "../../ui/badge/Badge";
import Select from "../../form/Select";

export default function InformasiKetersediaan() {
  const coordinate = {
    lat: -3.597031,
    lng: 98.678513
  };
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
    fetch(`http://localhost:3000/api/ketersediaan/${user.id}`)
      .then((r) => r.json())
      .then((d) => {
        if (!d) return;
        setKetersediaanId(d.id);
        setForm({
          lokasi: d.lokasi_kampus ?? "",
          gedung: d.gedung_ruangan ?? "",
          jadwal: d.jadwal_libur ?? "",
          maps: d.link_maps ?? "",
          status: d.status_ketersediaan === "Tersedia",
          waktu_mulai: d.waktu_mulai ?? "",
          waktu_selesai: d.waktu_selesai ?? "",
        });
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
    if (!ketersediaanId) {
      console.error("ID ketersediaan tidak ditemukan.");
      return;
    }

    fetch(`/api/ketersediaan/${ketersediaanId}`, {
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
                Informasi Ketersediaan
              </h4>

              <button
                onClick={openModal}
                className="flex w-full mb-3 items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:w-auto"
              >
                <svg
                  className="fill-current"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                    fill=""
                  />
                </svg>
                Update Informasi Ketersediaan
              </button>
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
                  Jadwal Libur
                </p>
                <p className="text-xl font-medium text-gray-800 dark:text-white/90">
                  {form.jadwal}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Status Ketersediaan
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

              <div className="grid grid-cols-1 gap-1">
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Waktu Tersedia
                </p>
                <p className="text-xl font-medium text-gray-800 dark:text-white/90">
                  {form.waktu_mulai && form.waktu_selesai
                    ? `${form.waktu_mulai.slice(0, 5)} - ${form.waktu_selesai.slice(0, 5)}`
                    : "-"}
                </p>

              </div>

            </div>


          </div>
          <div>
            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
              Lokasi Goggle Maps
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
              Edit Informasi Ketersediaan
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Perbaharui Informasi Ketersediaan anda dengan tepat, agar dapat mudah ditemukan oleh mahasiswa/tamu anda
            </p>
          </div>
          <form className="flex flex-col">
            <div className="px-2 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">

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

                <div>
                  <Label>Gedung/Ruangan</Label>
                  <Input name="gedung" type="text" value={form.gedung} onChange={handleChange} />
                </div>

                <div>
                  <Label>Jadwal Libur</Label>
                  <Input name="jadwal" type="text" value={form.jadwal} onChange={handleChange} />
                </div>

                <div>
                  <Label>Status Ketersediaan</Label>
                  <div className="flex items-center gap-3">
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

                <div>
                  <Label>Masukan Titik Kordinat Link Google Maps</Label>
                  <Input name="maps" value={form.maps} type="text" onChange={handleChange} />
                </div>

                <div>
                  <Label>Waktu Mulai</Label>
                  <Input
                    name="waktu_mulai"
                    type="time"
                    value={form.waktu_mulai || ""}
                    onChangeTime24={(val) => setForm(prev => ({ ...prev, waktu_mulai: val }))}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Label>Waktu Selesai</Label>
                  <Input
                    name="waktu_selesai"
                    type="time"
                    value={form.waktu_selesai || ""}
                    onChangeTime24={(val) => setForm(prev => ({ ...prev, waktu_selesai: val }))}
                    onChange={handleChange}
                  />
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
