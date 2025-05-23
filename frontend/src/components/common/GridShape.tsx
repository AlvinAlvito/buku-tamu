import { useTheme } from "../../context/ThemeContext";

export default function GridShape() {
  const { theme } = useTheme();

  // Filter untuk buat gambar jadi hijau, bisa kamu adjust sesuai kebutuhan
  const lightModeFilter = "invert(39%) sepia(89%) saturate(459%) hue-rotate(82deg) brightness(88%) contrast(90%)";

  return (
    <>
      <div className="absolute right-0 top-0 -z-1 w-full max-w-[250px] xl:max-w-[450px]">
        <img
          src="/images/shape/grid-01.svg"
          alt="grid"
          style={{ filter: theme === "light" ? lightModeFilter : "none" }}
        />
      </div>
      <div className="absolute bottom-0 left-0 -z-1 w-full max-w-[250px] rotate-180 xl:max-w-[450px]">
        <img
          src="/images/shape/grid-01.svg"
          alt="grid"
          style={{ filter: theme === "light" ? lightModeFilter : "none" }}
        />
      </div>
    </>
  );
}
