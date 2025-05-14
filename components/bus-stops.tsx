import type React from "react";
import BusStop from "./bus-stop";

type BusStopProps = {
  config: string[];
  isFiltered: boolean;
  routes: string[];
};

const BusStops: React.FC<BusStopProps> = (props) => {
  const { config, isFiltered, routes } = props;
  if (!config || config.length === 0) {
    return <div>No bus stops configured</div>;
  }
  return (
    <div className="w-full text-sm sm:text-base">
      {config.map((id) => (
        <BusStop key={id} busStopId={id} isFiltered={isFiltered} routes={routes} />
      ))}
    </div>
  );
};

export default BusStops;
