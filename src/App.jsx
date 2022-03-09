import { CssBaseline, Grid } from '@material-ui/core';
import { useEffect, useState } from 'react';
import Header from './components/Header';
import List from './components/List';
import Map from './components/Map';
import { getPlacesData, getWeatherData } from './api';

function App() {
  const [places, setPlaces] = useState([]);
  const [weather, setWeather] = useState({});
  const [coordinates, setCoordinates] = useState({});
  const [bounds, setBounds] = useState({});
  const [childClicked, setChildClicked] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [type, setType] = useState('restaurants');
  const [rating, setRating] = useState('');
  const [filteredPlaces, setFilteredPlaces] = useState([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        setCoordinates({ lat: latitude, lng: longitude });
      }
    );
  }, []);

  useEffect(() => {
    if (bounds.ne && bounds.sw) {
      setIsLoading(true);
      getWeatherData(coordinates.lat, coordinates.lng).then((data) => {
        setWeather(data);
      });
      getPlacesData(type, bounds.ne, bounds.sw).then((data) => {
        setPlaces(data?.filter((place) => place.name && place.num_reviews > 0));
        setIsLoading(false);
      });
    }
  }, [bounds, type]);

  useEffect(() => {
    const filteredPlaces = places.filter((place) => place.rating > rating);
    setFilteredPlaces(filteredPlaces);
  }, [rating, places]);

  return (
    <>
      <CssBaseline />
      <Header setCoordinates={setCoordinates} />
      <Grid container spacing={3} style={{ width: '100%' }}>
        <Grid item xs={12} md={4}>
          <List
            places={filteredPlaces.length ? filteredPlaces : places}
            childClicked={childClicked}
            isLoading={isLoading}
            type={type}
            setType={setType}
            rating={rating}
            setRating={setRating}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <Map
            places={filteredPlaces.length ? filteredPlaces : places}
            weather={weather}
            coordinates={coordinates}
            setCoordinates={setCoordinates}
            setBounds={setBounds}
            setChildClicked={setChildClicked}
          />
        </Grid>
      </Grid>
    </>
  );
}

export default App;
