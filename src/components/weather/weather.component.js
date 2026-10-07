class Weather extends Component {
  refs = {
    temperature: ".weather-temperature-value",
    condition: ".weather-condition-icon",
    scale: ".weather-temperature-scale",
  };

  forecasts = [
    {
      conditions: ["clouds", "mist", "haze", "smoke"],
      icon: "cloud_queue",
      color: "cloudy",
    },
    {
      conditions: ["drizzle", "snow", "rain"],
      icon: "opacity",
      color: "cloudy",
    },
    {
      conditions: ["clear"],
      icon: "wb_sunny",
      color: "sunny",
    },
    {
      conditions: ["thunderstorm"],
      icon: "bolt",
      color: "cloudy",
    },
  ];

  location;

  constructor() {
    super();

    this.setDependencies();
    this.setEvents();
  }

  setEvents() {
    this.onclick = this.swapScale;
  }

  setDependencies() {
    this.location = CONFIG.temperature.location;
    this.temperatureScale = CONFIG.temperature.scale;
    this.weatherForecast = new WeatherForecastClient(this.location);
  }

  imports() {
    return [this.resources.icons.material, this.resources.fonts.roboto];
  }

  style() {
    return `
      :host { display: flex; align-items: center; }
      .weather-temperature {
          display: flex;
          align-items: center;
          gap: 3px;
          font: var(--status-font-weight) var(--status-font-size) / 1 var(--status-font-family);
          color: var(--text);
          white-space: nowrap;
      }
      .weather-icon { display: flex; align-items: center; margin-right: 6px; }
      .weather-condition-icon { font-size: 17px; }
      .weather-condition-icon.sunny { color: var(--accent); }
      .weather-condition-icon.cloudy { color: #b2c5b7; }
      .weather-temperature-location {
          display: inline-block;
          max-width: 0;
          overflow: hidden;
          margin-right: 0;
          opacity: 0;
          color: var(--muted);
          transition: max-width 220ms var(--ease), margin-right 220ms var(--ease), opacity 140ms ease;
      }
      .weather-temperature:hover .weather-temperature-location { max-width: 16em; margin-right: 7px; opacity: 1; }
      @media (max-width: 800px) {
          .weather-temperature-location { display: none; }
      }
      @media (prefers-reduced-motion: reduce) {
          .weather-temperature-location { transition: none; }
      }
      @media (max-width: 540px) {
          .weather-icon { margin-right: 2px; }
          .weather-temperature { gap: 1px; }
      }
    `;
  }

  async template() {
    return `
        <p class="+ weather-temperature">
            <span class="weather-icon" class="+"><i class="material-icons weather-condition-icon sunny">wb_sunny</i></span>
            <span class="weather-temperature-location">${this.location}</span>
            <span class="weather-temperature-value">1</span>
            º<span class="weather-temperature-scale">${this.temperatureScale}</span>
        </p>`;
  }

  toC(f) {
    return Math.round(((f - 32) * 5) / 9);
  }

  toF(c) {
    return Math.round((c * 9) / 5 + 32);
  }

  swapScale() {
    this.temperatureScale = this.temperatureScale === "C" ? "F" : "C";

    CONFIG.temperature = {
      ...CONFIG.temperature,
      scale: this.temperatureScale,
    };

    this.setTemperature();
  }

  convertScale(temperature) {
    if (this.temperatureScale === "F") return this.toF(temperature);

    return temperature;
  }

  async setWeather() {
    this.weather = await this.weatherForecast.getWeather();
    this.setTemperature();
  }

  setTemperature() {
    const { temperature, condition } = this.weather;
    const { icon, color } = this.getForecast(condition);

    this.refs.temperature = this.convertScale(temperature);
    this.refs.condition = icon;
    this.refs.scale = this.temperatureScale;
    this.refs.condition.classList.add(color);
  }

  getForecast(condition) {
    for (const forecast of this.forecasts)
      if (forecast.conditions.includes(condition)) return forecast;

    return this.forecasts[0];
  }

  async connectedCallback() {
    await this.render();
    await this.setWeather();
  }
}
