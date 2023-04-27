import axios from "axios";

const baseUrl = "https://restcountries.com/v3.1/all";
const params = {
  fields: ["name", "capital", "languages", "area", "flags"].join(","),
};

const getAll = async () => {
  try {
    const result = await axios.get(baseUrl, { params });

    return result.data.map((country) => ({
      name: country.name.common,
      capital: country.capital[0],
      languages: Object.values(country.languages),
      area: country.area,
      flag: country.flags.png,
    }));
  } catch (e) {
    console.error(e);
  }

  return null;
};

const service = { getAll };

export default service;
