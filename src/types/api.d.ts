// types.ts
export interface Launch {
  id: string;
  name: string;
  date_utc: string;
  success: boolean;
  flight_number: number;
  details: string | null;
  links: {
    patch: {
      small: string | null;
      large: string | null;
    };
    webcast: string | null;
    article: string | null;
  };
  rocket_id: string;
}

export interface Rocket {
  id: string;
  name: string;
  description: string;
  height: {
    meters: number;
  };
  mass: {
    kg: number;
  };
  success_rate_pct: number;
}

export interface EnrichedLaunch extends Launch {
  cores: Array<{
    serial: string;
    reuse_count: number;
    landing_success: boolean;
    landing_type: string;
    landing_vehicle: string;
  }>;
  crew: Array<any>;
  rocket_details: {
    name: string;
    type: string;
    description: string;
    success_rate: number;
  };
  rocket: {
    description: string;
    height: {
      meters: number;
    };
    mass: {
      kg: number;
    };
    success_rate_pct: number;
  };
}
