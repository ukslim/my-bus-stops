import { useEffect, useState } from "react";
import DateComponent from "./date-component";
import { type Stop, type Times, stopSchema, timesSchema } from "./schemas";
import TimeUntil from "./time-until";

interface BusStopProps {
  busStopId: string;
  refreshTrigger: number;
}

const BusStop = (props: BusStopProps) => {
  const [timesRsp, setTimesRsp] = useState<Times>({ times: [] });
  const [stopRsp, setStopRsp] = useState<Stop | undefined>(undefined);

  // biome-ignore lint/correctness/useExhaustiveDependencies: refreshTrigger is used to trigger a refresh
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`api/times/?id=${props.busStopId}`);
        const data = timesSchema.parse(await response.json());
        setTimesRsp(data);
      } catch (error) {
        console.error("Error fetching bus times data:", error);
      }
    };

    fetchData();
  }, [props.busStopId, props.refreshTrigger]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `api/stop-instance/?id=${props.busStopId}`,
        );
        const data = stopSchema.parse(await response.json());
        setStopRsp(data);
      } catch (error) {
        console.error("Error fetching bus stop data:", error);
      }
    };

    fetchData();
  }, [props.busStopId]);

  return (
    <div className="border p-4 bg-white">
      <h2>{stopRsp?.long_name ?? props.busStopId}</h2>
      <table className="border-collapse">
        <thead>
          <tr>
            <th className="border text-left">To</th>
            <th className="border text-left">Route</th>
            <th className="border text-left">Aimed Departure</th>
            <th className="border text-left">Expected Arrival</th>
            <th className="border text-left">Time Until</th>
          </tr>
        </thead>
        <tbody>
          {timesRsp.times.map((time) => (
            <tr key={time.id}>
              <td className="border">{time.destination.name}</td>
              <td className="border">{time.service.line_name}</td>
              <td className="border">
                <DateComponent date={time.aimed_departure_time} />
              </td>
              <td className="border">
                <DateComponent date={time.expected_arrival_time} />
              </td>
              <td className="border">
                <TimeUntil date={time.expected_arrival_time} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BusStop;
