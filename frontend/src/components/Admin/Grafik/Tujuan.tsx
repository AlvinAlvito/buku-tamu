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
    const [chartData, setChartData] = useState<{ id: string; label: string; value: number }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!namaProdi) return;

        fetch(`${baseUrl}/api/admin/prodi/${encodeURIComponent(namaProdi)}/grafik-tujuan`)
            .then((res) => res.json())
            .then((data) => {
                const formattedData = data.grafik.map((item: ApiResponse) => ({
                    id: item.tujuan,
                    label: item.tujuan,
                    value: item.total,
                }));
                setChartData(formattedData);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Gagal memuat data:', err);
                setLoading(false);
            });
    }, [namaProdi]);

    function toTitleCase(str: string | undefined): string {
        if (!str) return '';
        return str
            .toLowerCase()
            .split(' ')
            .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' ');
    }

    if (loading) return <p>Loading grafik...</p>;

    return (
        <div className="overflow-hidden h-[600px] rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 w-full max-w-full mx-auto">
            <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 text-center sm:text-left  sm:w-auto">
                    Grafik Tujuan Bimbingan Prodi {toTitleCase(namaProdi)}
                </h3>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-6 h-full">
                <div className="flex-shrink-0 w-full sm:w-3/5 h-[400px]  mx-auto">
                    <DonutChart data={chartData} />
                </div>
            </div>
        </div>



    );
}
