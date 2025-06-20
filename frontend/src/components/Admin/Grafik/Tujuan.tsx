import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DonutChart from '../../charts/DonutChart';
import { baseUrl } from "../../../lib/api";

interface ApiResponse {
  tujuan: string;
  total: number;
}

export default function GrafikTujuan() {
  const { namaProdi } = useParams();
  const [akademikData, setAkademikData] = useState<{ id: string; label: string; value: number }[]>([]);
  const [skripsiData, setSkripsiData] = useState<{ id: string; label: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!namaProdi) return;

    fetch(`${baseUrl}/api/admin/prodi/${encodeURIComponent(namaProdi)}/grafik-tujuan`)
      .then((res) => res.json())
      .then((data) => {
        const akademik: typeof akademikData = [];
        const skripsi: typeof skripsiData = [];

        data.grafik.forEach((item: ApiResponse) => {
          const entry = {
            id: item.tujuan,
            label: item.tujuan,
            value: item.total,
          };
          if (item.tujuan.startsWith("Bimbingan")) {
            skripsi.push(entry);
          } else {
            akademik.push(entry);
          }
        });

        setAkademikData(akademik);
        setSkripsiData(skripsi);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gagal memuat data:", err);
        setLoading(false);
      });
  }, [namaProdi]);

  function toTitleCase(str: string | undefined): string {
    if (!str) return "";
    return str
      .toLowerCase()
      .split(" ")
      .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }

  if (loading) return <p>Loading grafik...</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Grafik Akademik */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03]">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4 text-center">
          Grafik Tujuan Bimbingan Akademik <br /> Prodi {toTitleCase(namaProdi)}
        </h3>
        <div className="h-[400px]">
          {akademikData.length > 0 ? (
            <DonutChart data={akademikData} />
          ) : (
            <p className="text-center text-gray-500">Tidak ada data akademik.</p>
          )}
        </div>
      </div>

      {/* Grafik Skripsi */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03]">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4 text-center">
          Grafik Tujuan Bimbingan Skripsi <br /> Prodi {toTitleCase(namaProdi)}
        </h3>
        <div className="h-[400px]">
          {skripsiData.length > 0 ? (
            <DonutChart data={skripsiData} />
          ) : (
            <p className="text-center text-gray-500">Tidak ada data skripsi.</p>
          )}
        </div>
      </div>
    </div>
  );
}
