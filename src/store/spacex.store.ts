// store/spacex.store.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Launch, Rocket, EnrichedLaunch } from "../types/api";

interface SpaceXState {
  launches: Launch[];
  rockets: Rocket[];
  isLoading: boolean;
  error: string | null;
  fetchLaunches: () => Promise<void>;
  fetchRockets: () => Promise<void>;
  getLaunchById: (id: string) => Launch | undefined;
  getRocketById: (id: string) => Rocket | undefined;
  enrichedLaunches: Record<string, EnrichedLaunch>;
  fetchLaunchDetails: (id: string) => Promise<void>;
}

export const useSpaceXStore = create<SpaceXState>()(
  devtools((set, get) => ({
    launches: [],
    rockets: [],
    isLoading: false,
    error: null,
    enrichedLaunches: {},

    fetchLaunches: async () => {
      try {
        set({ isLoading: true });
        const response = await fetch(
          "https://api.spacexdata.com/v5/launches/query",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              query: {},
              options: {
                sort: {
                  date_utc: "desc",
                },
                limit: 100,
              },
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch launches");
        }

        const { docs } = await response.json();
        const cleanedData = docs.map((launch: any) => ({
          id: launch.id,
          name: launch.name,
          date_utc: launch.date_utc,
          success: launch.success ?? false,
          flight_number: launch.flight_number,
          details: launch.details,
          links: {
            patch: {
              small: launch.links?.patch?.small || null,
              large: launch.links?.patch?.large || null,
            },
            webcast: launch.links?.webcast || null,
            article: launch.links?.article || null,
          },
        }));

        set({ launches: cleanedData, isLoading: false });
      } catch (error) {
        set({ error: "Failed to fetch launches", isLoading: false });
        console.error("Error fetching launches:", error);
      }
    },

    fetchRockets: async () => {
      try {
        set({ isLoading: true });
        const response = await fetch("https://api.spacexdata.com/v4/rockets");

        if (!response.ok) {
          throw new Error("Failed to fetch rockets");
        }

        const data = await response.json();
        set({ rockets: data, isLoading: false });
      } catch (error) {
        set({ error: "Failed to fetch rockets", isLoading: false });
        console.error("Error fetching rockets:", error);
      }
    },

    getLaunchById: (id: string) => {
      return get().launches.find((launch) => launch.id === id);
    },

    getRocketById: (id: string) => {
      return get().rockets.find((rocket) => rocket.id === id);
    },

    fetchLaunchDetails: async (id: string) => {
      try {
        const launch = get().getLaunchById(id);
        if (!launch) return;

        const [launchResponse, rocketResponse] = await Promise.all([
          fetch(`https://api.spacexdata.com/v5/launches/${id}`),
          fetch(`https://api.spacexdata.com/v4/rockets/${launch.rocket_id}`),
        ]);

        const launchDetails = await launchResponse.json();
        const rocketDetails = await rocketResponse.json();

        const enrichedLaunch: EnrichedLaunch = {
          ...launch,
          cores: launchDetails.cores.map((core: any) => ({
            serial: core.core?.serial || "Unknown",
            reuse_count: core.core?.reuse_count || 0,
            landing_success: core.landing_success || false,
            landing_type: core.landing_type,
            landing_vehicle: core.landing_vehicle,
          })),
          crew: launchDetails.crew || [],
          rocket_details: {
            name: rocketDetails.name,
            type: rocketDetails.type,
            description: rocketDetails.description,
            success_rate: rocketDetails.success_rate_pct,
          },
          rocket: {
            description: rocketDetails.description,
            height: {
              meters: rocketDetails.height.meters,
            },
            mass: {
              kg: rocketDetails.mass.kg,
            },
            success_rate_pct: rocketDetails.success_rate_pct,
          },
        };

        set((state) => ({
          enrichedLaunches: {
            ...state.enrichedLaunches,
            [id]: enrichedLaunch,
          },
        }));
      } catch (error) {
        console.error("Error fetching launch details:", error);
      }
    },
  }))
);
