
import Badge from "../../ui/badge/Badge";

export default function InformasiKetersediaan() {

  


  return (
    <>


      <div className="p-5 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
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

          
        </div>
      </div>

     
    </>
  );
}
