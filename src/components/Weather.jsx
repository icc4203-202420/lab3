import useAxios from 'axios-hooks';
import { Typography } from '@mui/material';
import PropTypes from 'prop-types';

const Weather = ({ location }) => {
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

  // Paso 1: Obtener coordenadas de la ciudad proporcionada como prop
  const [{ data: geocodeData, loading: geocodeLoading, error: geocodeError }] = useAxios(
    `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(location)}&limit=1&appid=${apiKey}`
  );

  // Paso 2: Usar coordenadas para obtener el clima actual, solo si se han obtenido las coordenadas
  const lat = geocodeData ? geocodeData[0].lat : null;
  const lon = geocodeData ? geocodeData[0].lon : null;

  const [{ data: weatherData, loading: weatherLoading, error: weatherError }] = useAxios(
    lat && lon ? `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}` : null
  );

  if (geocodeLoading || weatherLoading) {
    return (
      <Typography variant="body1">
        Cargando datos del clima...
      </Typography>
    );
  }

  if (geocodeError || weatherError) {
    console.debug(`https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(location)}&limit=1&appid=${apiKey}`);
    console.error('Error al obtener los datos del clima:', geocodeError || weatherError);
    return (
      <Typography variant="body1" color="error">
        Error al cargar datos del clima.
      </Typography>
    );
  }

  const { temp, temp_min, temp_max } = weatherData.main;
  const weather = {
    temp: temp.toFixed(1),
    tempMin: temp_min.toFixed(1),
    tempMax: temp_max.toFixed(1)
  };

  return (
    <div>
      <Typography variant="h6">
        Clima en {location}
      </Typography>
      <Typography variant="body1">
        Actual: {weather.temp} °C
      </Typography>
      <Typography variant="body2">
        Mínima: {weather.tempMin} °C
      </Typography>
      <Typography variant="body2">
        Máxima: {weather.tempMax} °C
      </Typography>
    </div>
  );
};

Weather.propTypes = {
  location: PropTypes.string.isRequired,
};

export default Weather;
