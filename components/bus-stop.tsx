import useSWR from "swr";
import DateComponent from "./date-component";
import { stopSchema, timesSchema } from "../utils/schemas";
import TimeUntil from "./time-until";

interface BusStopProps {
  busStopId: string;
}
const fetchStop = (url: string) =>
  fetch(url)
    .then((response) => response.json())
    .then((data) => stopSchema.parse(data));

const fetchTimes = (url: string) =>
  fetch(url)
    .then((response) => response.json())
    .then((data) => timesSchema.parse(data));

const BusStop = (props: BusStopProps) => {
  const { data: stopRsp, error: stopError } = useSWR(
    `/api/stop-instance/?id=${props.busStopId}`,
    fetchStop,
  );
  const { data: timesRsp, error: timesError } = useSWR(
    `/api/times/?id=${props.busStopId}`,
    fetchTimes,
    {
      refreshInterval: 60_000,
    },
  );

  return (
    <div className="border p-0 bg-white">
      <h2 className="text-white bg-blue-500">
        {stopError ? `Error naming stop ${props.busStopId}` : ""}
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
            {timesError ? (
              <tr>
                <td colSpan={5}>Error getting times</td>
              </tr>
            ) : (
              ""
            )}
            {timesRsp ? (
              timesRsp?.times?.map((time) => (
                <tr key={time.id}>
                  <td className="px-1 py-1 whitespace-nowrap">
                    {time.service.line_name}
                  </td>
                  <td className="max-w-24 w-24 px-1 py-1 overflow-scroll no-scrollbar whitespace-nowrap">
                    {time.destination.name}
                  </td>
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
              ))
            ) : (
              <tr>
                <td colSpan={5}>Loading</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BusStop;
