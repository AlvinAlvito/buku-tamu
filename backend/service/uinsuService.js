require("dotenv").config();
const axios = require("axios");
const qs = require("qs"); // Untuk encode body form-urlencoded

async function getStudentAuth(nim, passwordMd5) {
  try {
    const url = `https://ws.uinsu.ac.id/portal/OtentikasiUser?UINSU-KEY=${process.env.UINSU_KEY}`;

    const data = qs.stringify({
      nim_mhs: nim,
      password: passwordMd5,
    });

    const response = await axios.post(url, data, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error calling API UINSU:", error.response?.status, error.response?.data);
    return { modelError: error.message || "API error" };
  }
}

const getAlumniData = async (nim) => {
  try {
    const response = await axios.post(
      "https://ws.uinsu.ac.id/portal/DataAlumni",
      {
        nim_mhs: nim,
      },
      {
        headers: {
          "UINSU-KEY": process.env.UINSU_KEY,
        },
      }
    );

    return response.data;
  } catch (err) {
    return { modelError: err.message };
  }
};

module.exports = { getStudentAuth, getAlumniData };
