import { useEffect, useState } from "react";

import countriesService from "./services/countries";
import weatherService from "./services/weather";

const Weather = ({ weather, city }) => {
  return (
    <>
      <h2>Weather in {city}</h2>
      <p>temperature: {weather.temperature} Celsius</p>
      <img src={weather.icon} alt="weather icon" />
      <p>wind {weather.wind} m/s</p>
    </>
  );
};

const Country = ({ country }) => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    (async () => {
      const weather = await weatherService.get(country.capital);

      if (weather) {
        setWeather(weather);
      }
    })();
  }, [country.capital]);

  return (
    <>
      <h1>{country.name}</h1>
      <div>capital {country.capital}</div>
      <div>area {country.area}</div>
      <h3>languages:</h3>
      <ul>
        {country.languages.map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <img src={country.flag} alt="flag" width="100" />
      {weather !== null && <Weather weather={weather} city={country.capital} />}
    </>
  );
};

const CountryList = ({ countries, onSelected }) => {
  if (countries.length === 1) {
    return <Country country={countries[0]} />;
  }

  if (countries.length <= 10) {
    return countries.map((country, index) => (
      <div key={country.name}>
        <div>
          {country.name}
          <button onClick={() => onSelected(index)}>show</button>
        </div>
      </div>
    ));
  }

  return <div>Too many matches, specify another filter</div>;
};

const App = () => {
  const [countries, setCountries] = useState([]);
  const [input, setInput] = useState("");
  const [selected, setSelected] = useState(null);
  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(input.toLowerCase())
  );

  useEffect(() => {
    (async () => {
      const countries = await countriesService.getAll();

      if (countries) {
        setCountries(countries);
      }
    })();
  }, []);

  const onChange = (e) => {
    setInput(e.target.value);
    setSelected(null);
  };

  return (
    <div>
      <div>
        find countries
        <input value={input} onChange={onChange} />
      </div>
      {selected !== null ? (
        <Country country={filteredCountries[selected]} />
      ) : (
        input !== "" && (
          <CountryList countries={filteredCountries} onSelected={setSelected} />
        )
      )}
    </div>
  );
};

export default App;
