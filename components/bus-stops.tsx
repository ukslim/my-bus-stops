import type React from "react";
import BusStop from "./bus-stop";

type BusStopProps = {
  config: string[];
};

const BusStops: React.FC<BusStopProps> = (props) => {
  const { config } = props;
  if (!config || config.length === 0) {
    return <div>No bus stops configured</div>;
  }
  return (
    <div className="w-full text-sm sm:text-base">
      {config.map((id) => (
        <BusStop key={id} busStopId={id} />
      ))}
    </div>
  );
};

export default BusStops;
