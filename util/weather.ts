class Weather {
  private apiKey: string;

  public constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  public async getWeather(location: string): Promise<any> {
    const data = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${this.apiKey}`,
    );
    const json = await data.json();
    return json;
  }
}

export { Weather };
