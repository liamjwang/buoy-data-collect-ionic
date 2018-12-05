export class RawSample { // TODO: Move unit conversions from the liveview page into this class
  constructor(salinity: number, turbidity: number, ph: number, temperature: number) {
    this.salinity = salinity;
    this.turbidity = turbidity;
    this.ph = ph;
    this.temperature = temperature;
  }
  salinity: number;
  turbidity: number;
  ph: number;
  temperature: number;

  salinityString: string;
  turbidityString: string;
  phString: string;
  temperatureString: string;

  public generateStrings() {
    this.salinityString = this.salinity.toFixed(1);
    this.turbidityString = this.turbidity.toFixed(0);
    this.phString = this.ph.toFixed(1);
    this.temperatureString = this.temperature.toFixed(1);
  }
}

// export class SensorReading {
//   value: number;
//   fractionDigits: number;
//   public toString(): string {
//     return this.value.toFixed(this.fractionDigits)
//   }
//   public getCharacterCount()
// }
