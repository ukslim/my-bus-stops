import { useEffect, useState } from "react";
import DateComponent from "./date";
import { type Times, timesSchema } from "./schemas";

interface BusStopProps {
  busStopId: string;
}

const BusStop = (props: BusStopProps) => {
  const [stopData, setTimes] = useState<Times>({ times: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`api/busTimes/?id=${props.busStopId}`);
        const data = timesSchema.parse(await response.json());
        setTimes(data);
      } catch (error) {
        console.error("Error fetching bus stop data:", error);
      }
    };

    fetchData();
  }, [props.busStopId]);

  return (
    <div>
      <h2>Times for {props.busStopId}</h2>
      <div>
        <div className="grid grid-cols-2 gap-4 font-bold">
          <span>Aimed Departure</span>
          <span>Expected Arrival</span>
        </div>
        {stopData.times.map((time) => (
          <div key={time.id} className="grid grid-cols-2 gap-4">
            <span>
              <DateComponent date={time.aimed_departure_time} />
            </span>
            <span>
              <DateComponent date={time.expected_arrival_time} />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BusStop;
