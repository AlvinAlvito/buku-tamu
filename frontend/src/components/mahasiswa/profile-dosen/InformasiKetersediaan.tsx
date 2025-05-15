
import Badge from "../../ui/badge/Badge";
import { MapPin } from "lucide-react";
export default function InformasiKetersediaan() {


  const coordinate = {
    lat: -3.597031,
    lng: 98.678513
  };
  const gmapsUrl = `https://www.google.com/maps?q=${coordinate.lat},${coordinate.lng}`;
  const gmapsImage = `https://maps.googleapis.com/maps/api/staticmap?center=${coordinate.lat},${coordinate.lng}&zoom=15&size=600x300&markers=color:red%7C${coordinate.lat},${coordinate.lng}&key=YOUR_GOOGLE_MAPS_API_KEY`; // ganti dengan API key

  return (
    <>


      <div className="p-5 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="grid grid-cols-2 gap-6  lg:items-start lg:justify-between">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
              Informasi Ketersediaan
            </h4>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Lokasi Kampus
                </p>
                <p className="text-xl font-medium text-gray-800 dark:text-white/90">
                  Kampus 1 UINSU Sutomo
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Gedung/Ruangan
                </p>
                <p className="text-xl font-medium text-gray-800 dark:text-white/90">
                  Gedung A Ruang 101
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Jadwal Libur
                </p>
                <p className="text-xl font-medium text-gray-800 dark:text-white/90">
                  Sabtu
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Status Ketersediaan
                </p>
                <p className="text-xl font-medium text-gray-800 dark:text-white/90">

                  <Badge variant="light" color="success">
                    Tersedia
                  </Badge>

                </p>
              </div>

            </div>
          </div>

          <div>
            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
              Titik Kordinat
            </p>
            <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <a href={gmapsUrl} target="_blank" rel="noopener noreferrer" className="block rounded-xl overflow-hidden border border-gray-300 dark:border-gray-700">
                <iframe
                  width="100%"
                  height="200"
                  loading="lazy"
                  allowFullScreen
                  className="rounded-xl"
                  // src={`https://www.google.com/maps?q=${coordinate.lat},${coordinate.lng}&hl=es;z=14&output=embed`}
                  src={`https://www.google.com/maps?q=-3.597031,98.678513&hl=es;z=14&output=embed`}
                ></iframe>
              </a>

              <div className="px-4 py-2 bg-white dark:bg-gray-900 text-sm text-gray-800 dark:text-white/90">
                Koordinat: <span className="font-medium">{coordinate.lat}, {coordinate.lng}</span>
              </div>
            </div>
          </div>
        </div>

      </div>


    </>
  );
}
