export interface WeatherAPI {
    current_condition: CurrentCondition[];
    nearest_area: NearestArea[];
    request: Request[];
    weather: Weather[];
}

export interface CurrentCondition {
    FeelsLikeC: string;
    FeelsLikeF: string;
    cloudcover: string;
    humidity: string;
    localObsDateTime: string;
    observation_time: string;
    precipInches: string;
    precipMM: string;
    pressure: string;
    pressureInches: string;
    temp_C: string;
    temp_F: string;
    uvIndex: string;
    visibility: string;
    visibilityMiles: string;
    weatherCode: string;
    weatherDesc: WeatherDesc[];
    weatherIconUrl: WeatherDesc[];
    winddir16Point: string;
    winddirDegree: string;
    windspeedKmph: string;
    windspeedMiles: string;
}

export interface WeatherDesc {
    value: string;
}

export interface NearestArea {
    areaName: WeatherDesc[];
    country: WeatherDesc[];
    latitude: string;
    longitude: string;
    population: string;
    region: WeatherDesc[];
    weatherUrl: WeatherDesc[];
}

export interface Request {
    query: string;
    type: string;
}

export interface Weather {
    astronomy: Astronomy[];
    avgtempC: string;
    avgtempF: string;
    date: Date;
    hourly: Hourly[];
    maxtempC: string;
    maxtempF: string;
    mintempC: string;
    mintempF: string;
    sunHour: string;
    totalSnow_cm: string;
    uvIndex: string;
}

export interface Astronomy {
    moon_illumination: string;
    moon_phase: string;
    moonrise: string;
    moonset: string;
    sunrise: string;
    sunset: string;
}

export interface Hourly {
    DewPointC: string;
    DewPointF: string;
    FeelsLikeC: string;
    FeelsLikeF: string;
    HeatIndexC: string;
    HeatIndexF: string;
    WindChillC: string;
    WindChillF: string;
    WindGustKmph: string;
    WindGustMiles: string;
    chanceoffog: string;
    chanceoffrost: string;
    chanceofhightemp: string;
    chanceofovercast: string;
    chanceofrain: string;
    chanceofremdry: string;
    chanceofsnow: string;
    chanceofsunshine: string;
    chanceofthunder: string;
    chanceofwindy: string;
    cloudcover: string;
    humidity: string;
    precipInches: string;
    precipMM: string;
    pressure: string;
    pressureInches: string;
    tempC: string;
    tempF: string;
    time: string;
    uvIndex: string;
    visibility: string;
    visibilityMiles: string;
    weatherCode: string;
    weatherDesc: WeatherDesc[];
    weatherIconUrl: WeatherDesc[];
    winddir16Point: string;
    winddirDegree: string;
    windspeedKmph: string;
    windspeedMiles: string;
}
