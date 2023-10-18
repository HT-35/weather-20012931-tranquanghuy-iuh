const express = require("express");
const app = express();
const path = require("path");

const pathPublic = path.join(__dirname, "KhoaHoc/public");

app.use(express.static(pathPublic));

const asyncRequest = require("async-request");

const port = 3000;

const getDataWeather = async (loca) => {
  const access_key = "a9c558863547976ae360014ece2c395d";

  const url = `http://api.weatherstack.com/current?access_key=${access_key}&query=${loca}`;

  try {
    const res = await asyncRequest(url);
    const data = JSON.parse(res.body);
    const weather = {
      region: data.location.region,
      country: data.location.country,
      temperature: data.current.temperature,
      wind_speed: data.current.wind_speed,
      precip: data.current.precip,
      cloudcover: data.current.cloudcover,
    };
    return weather;
  } catch (error) {
    console.log(error);
    return {
      isSucsess: false,
      error,
    };
  }
};

function handleRegion(region, loca) {
  if (region == "") {
    return loca;
  } else {
    return region;
  }
}

app.get("/", async (req, res) => {
  const params = req.query;
  const location = params.address;

  console.log(location);

  const weather = await getDataWeather(location);

  console.log(weather);

  try {
    if (location) {
      res.render("./weather.hbs", {
        status: true,
        region: handleRegion(weather.region, location),
        country: weather.country,
        temperature: weather.temperature,
        wind_speed: weather.wind_speed,
        precip: weather.precip,
        cloudcover: weather.cloudcover,
      });
    } else {
      res.render("./weather.hbs", {
        status: false,
      });
    }
  } catch (error) {
    res.render("./weather.hbs", {
      status: false,
    });
  }
});

app.set("view engine", "hbs");

app.listen(port, () => {
  console.log("my server port 3000: http://localhost:3000/  ");
});
