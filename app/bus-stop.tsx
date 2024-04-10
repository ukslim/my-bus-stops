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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`api/times/?id=${props.busStopId}`);
        const data = timesSchema.parse(await response.json());
        setTimesRsp(data);
      } catch (error) {
        console.error(
          "Error fetching bus times data:",
          error,
          props.refreshTrigger,
        );
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
    <div className="border p-0 bg-white">
      <h2 className="text-white bg-blue-500">
        {stopRsp?.long_name ?? props.busStopId}
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-1 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rt
              </th>
              <th className="w-10 sm:w-20 px-1 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                To
              </th>
              <th className="px-1 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aimed Departure
              </th>
              <th className="px-1 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Expected Arrival
              </th>
              <th className="px-1 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time Until
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {timesRsp.times.map((time) => (
              <tr key={time.id}>
                <td className="px-1 py-1 whitespace-nowrap">
                  {time.service.line_name}
                </td>
                <td className="max-w-24 w-24 px-1 py-1 overflow-scroll no-scrollbar whitespace-nowrap">{time.destination.name}</td>
                <td className="px-1 py-1 whitespace-nowrap">
                  <DateComponent date={time.aimed_departure_time} />
                </td>
                <td className="px-1 py-1 whitespace-nowrap">
                  <DateComponent date={time.expected_arrival_time} />
                </td>
                <td className="px-1 py-1 whitespace-nowrap">
                  <TimeUntil date={time.expected_arrival_time} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BusStop;
