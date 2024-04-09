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
			<ul>
				{stopData.times.map((time) => (
					<li key={time.id}>
						<DateComponent date={time.expected_arrival_time} />
					</li>
				))}
			</ul>
		</div>
	);
};

export default BusStop;
