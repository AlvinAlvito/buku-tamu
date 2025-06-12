
import {  ArrowUp, GraduationCap, UserRoundCheck } from "lucide-react";
import { useOnline } from "../../utils/OnlineContext";
import Badge from "../ui/badge/Badge";


export default function UserAktif() {
  const { online } = useOnline();
  return (


    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:gap-6">
      {/* Mahasiswa Online */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GraduationCap className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Mahasiswa Online Saat ini</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {online.mahasiswa}
            </h4>
          </div>
          <Badge color="success">
            <ArrowUp className="size-4" />
            {online.mahasiswa}
          </Badge>
        </div>
      </div>

      {/* Dosen Aktif */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <UserRoundCheck className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Dosen Online Saat ini</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {online.dosen}
            </h4>
          </div>
          <Badge color="success">
            <ArrowUp className="size-4" />
            {online.dosen}
          </Badge>
        </div>
      </div>
    </div>
  );
}
