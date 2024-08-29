import { useEffect, useReducer } from 'react';
import axios from 'axios';
import { Typography } from '@mui/material';
import PropTypes from 'prop-types';

const Weather = ({ location }) => {
 
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

  // Estado inicial para el reducer
  const initialState = {
    weather: null,
    loading: true,
    error: null,
    dateTime: null,
  };

  function reducer(state, action) {
    switch (action.type) {
      case 'FETCH_INIT':
        return {
          ...state,
          loading: true,
          error: null,
        };
      case 'FETCH_SUCCESS':
        return {
          ...state,
          loading: false,
          weather: action.payload.weather,
          dateTime: action.payload.dateTime,
        };
      case 'FETCH_FAILURE':
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
      default:
        throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
  

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    let isMounted = true;

    const fetchWeather = async () => {
      dispatch({ type: 'FETCH_INIT' });

      try {
        // Paso 1: Obtener coordenadas de la ciudad proporcionada como prop
        const geocodeResponse = await axios.get('https://api.openweathermap.org/geo/1.0/direct', {
          params: {
            q: encodeURIComponent(location),
            limit: 1,
            appid: apiKey
          }
        });

        if (!isMounted) return;

        const { lat, lon } = geocodeResponse.data && geocodeResponse.data[0] ? 
          geocodeResponse.data[0] : { lat: null, lon: null };

        if (!lat || !lon) {
          throw new Error('No se pudieron obtener las coordenadas.');
        }

        // Paso 2: Usar coordenadas para obtener el clima actual
        const weatherResponse = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
          params: {
            lat,
            lon,
            units: 'metric',
            appid: apiKey
          }
        });

        if (isMounted) {
          const { timezone } = weatherResponse.data;
          
          const updateDateTime = () => {
            /*  Date.now() entrega la hora del computador, necesitamos la del meridiano de greenwich y
                a partir de ahí sumarle la zona horaria extraida de la API

                toGMTString() convierte la hora Greenwich Mean Time
            */
            const timezoneOffset = timezone * 1000; // Convertir de segundos a milisegundos
            const currentDateTime = new Date(Date.now() + timezoneOffset).toGMTString();
            
            dispatch({ 
              type: 'FETCH_SUCCESS', 
              payload: { 
                weather: {
                  temp: weatherResponse.data.main.temp.toFixed(1),
                  tempMin: weatherResponse.data.main.temp_min.toFixed(1),
                  tempMax: weatherResponse.data.main.temp_max.toFixed(1),
                  description: weatherResponse.data.weather[0].description
                },
                dateTime: currentDateTime.toLocaleString()
              }
            });
          };

          const intervalId = setInterval(updateDateTime, 1000); 
          /*    setInterval es una funcion que recibe 2 parametros, el primero es la función a ejecutar,
                y el segundo es el tiempo en milisegundos en el que la función se va a ir llamando.
          */
          return () => clearInterval(intervalId); // Limpia el intervalo cuando el componente se desmonta
        }
      } catch (err) {
        if (isMounted) {
          dispatch({ type: 'FETCH_FAILURE', payload: err });
        }
      }
    };

    fetchWeather();

    return () => {
      isMounted = false;
    };
  }, [location, apiKey]);

  const { weather, loading, error, dateTime } = state;

  if (loading) {
    return (
      <Typography variant="body1">
        Cargando datos del clima...
      </Typography>
    );
  }

  if (error) {
    console.error('Error al obtener los datos del clima:', error);
    return (
      <Typography variant="body1" color="error">
        Error al cargar datos del clima.
      </Typography>
    );
  }

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
      {dateTime && (
        <Typography variant="body2">
          Fecha y hora: {dateTime}
        </Typography>
      )}
      <Typography variant="body2">
        Estado: {weather.description}
      </Typography>
    </div>
  );
};

Weather.propTypes = {
  location: PropTypes.string.isRequired,
};

export default Weather;
