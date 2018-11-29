export class RawSample {
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
}
