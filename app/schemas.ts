import { z } from "zod";

export const configSchema = z.array(z.string());
export const timesSchema = z.object({
  times: z.array(
    z.object({
      id: z.number(),
      trip_id: z.number(),
      service: z.object({
        line_name: z.string(),
        operators: z.array(
          z.object({
            id: z.string(),
            name: z.string(),
            parent: z.string(),
            vehicle_mode: z.string(),
          }),
        ),
      }),
      destination: z.object({
        atco_code: z.string(),
        name: z.string(),
        locality: z.string(),
      }),
      aimed_arrival_time: z.coerce.date().optional(),
      aimed_departure_time: z.coerce.date().optional(),
      delay: z.string().optional(),
      expected_departure_time: z.coerce.date().optional(),
      expected_arrival_time: z.coerce.date().optional(),
    }),
  ),
});

export type Times = z.infer<typeof timesSchema>;
