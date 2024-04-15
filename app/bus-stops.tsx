import BusStop from "./bus-stop";

type BusStopProps = {
  config: string[];
};

export default function BusStops(props: BusStopProps) {
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
}
