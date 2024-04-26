import { z } from "zod";

export const configSchema = z.array(z.string());

export const querySchema = z.object({
  locationId: z.string().optional(),
});

export const timesSchema = z.object({
  // Unused fields are commented
  times: z.array(
    z.object({
      id: z.number(),
      //   trip_id: z.number(),
      service: z.object({
        // biome-ignore lint/style/useNamingConvention: external API
        line_name: z.string(),
        // operators: z.array(
        //   z.object({
        //     id: z.string(),
        //     name: z.string(),
        //     parent: z.string(),
        //     vehicle_mode: z.string(),
        //   }),
        // ),
      }),
      destination: z.object({
        // atco_code: z.string(),
        name: z.string(),
        // locality: z.string(),
      }),
      // biome-ignore lint/style/useNamingConvention: <explanation>
      aimed_arrival_time: z.coerce.date().optional(),
      // biome-ignore lint/style/useNamingConvention: <explanation>
      aimed_departure_time: z.coerce.date().optional(),
      //   delay: z.string().optional(),
      // biome-ignore lint/style/useNamingConvention: <explanation>
      expected_departure_time: z.coerce.date().optional(),
      // biome-ignore lint/style/useNamingConvention: <explanation>
      expected_arrival_time: z.coerce.date().optional(),
    }),
  ),
});

export const stopSchema = z.object({
  // Unused fields are commented
  //   atco_code: z.string(),
  //   naptan_code: z.string(),
  // biome-ignore lint/style/useNamingConvention: <explanation>
  common_name: z.string(),
  // biome-ignore lint/style/useNamingConvention: <explanation>
  long_name: z.string(),
  // "location": z.array(z.number()),
  // "indicator": "Opp",
  // "icon": null,
  // "bearing": "SE",
  // "heading": null,
  // "stop_type": "BCT",
  // "bus_stop_type": "MKD",
  // "created_at": "2003-01-28T00:00:00Z",
  // "modified_at": "2007-03-22T00:00:00Z",
  // "active": true
});

export type Stop = z.infer<typeof stopSchema>;
export type Times = z.infer<typeof timesSchema>;
export type Query = z.infer<typeof querySchema>;
