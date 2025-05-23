import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";
import { initSocket } from "../../utils/socket";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [nim, setNim] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("Mulai fetch login API");

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nim, password }),
      });

      console.log("Fetch selesai, status:", response.status);

      const now = Date.now();
      const data = await response.json();
      console.log("Response from login API:", data);

      if (!response.ok) {
        throw new Error(data.message || data.error || "Login gagal");
      }

      if (!data.token || !data.user) {
        throw new Error("Response API tidak lengkap");
      }


      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("loginTime", now.toString());
      localStorage.setItem("login-refresh", now.toString());
      window.dispatchEvent(new Event("token-change"));

      const socket = initSocket(data.token);
      console.log("Response data:", data);

      socket.on("connect", () => {
        console.log("Connected to Socket.IO server");
        socket.emit("user-join", data.user.role);
      });

      socket.on("connect_error", (err) => {
        console.error("Socket connection error:", err.message);
      });

      // Redirect berdasarkan role
      if (data.user.role === "mahasiswa") {
        navigate("/mahasiswa");
      } else if (data.user.role === "dosen") {
        navigate("/dosen");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }


  };


  return (
    <div className="flex flex-col flex-1">
      <div className="w-full max-w-md pt-5 mx-auto">
        <img
          width={131}
          height={58}
          src="/images/logo/logo.png"
          alt="Logo"
        />
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Masuk
            </h1>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Masukan NIM/NIP dan Password anda
            </p>
          </div>
          <div>
            <form onSubmit={handleLogin}>

              <div className="space-y-6">
                <div>
                  <Label>
                    NIM <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input
                    placeholder="0701212166"
                    value={nim}
                    onChange={(e) => setNim(e.target.value)}
                  />
                </div>
                <div>
                  <Label>
                    Password <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Masukan Password Anda"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox checked={isChecked} onChange={setIsChecked} />
                    <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                      Biarkan Saya Masuk
                    </span>
                  </div>
                  <Link
                    to="/reset-password"
                    className="text-sm text-green-500 hover:text-green-600 dark:text-green-400"
                  >
                    Lupa Password?
                  </Link>
                </div>
                <div>
                  {error && (
                    <div className="p-2 my-2 text-sm text-red-600 bg-red-100 border border-red-300 rounded">
                      {error}
                    </div>
                  )}

                  {loading && (
                    <div className="text-sm text-gray-500">Loading...</div>
                  )}

                  <Button className="w-full bg-green-700 hover:bg-green-800" size="sm">
                    Masuk
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
