export class ClimateData {
  wind?: number;
  rain?: number;
  pressure?: number;
  temperature?: number;
  condition?: {
    text?: string;
    icon?: string;
  };
}

export class City {
  name?: string;
  cordinates?: string;
  climateData?: ClimateData;
}
