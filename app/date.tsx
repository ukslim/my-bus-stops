import type React from "react";

interface DateProps {
	date?: Date;
}

const DateComponent: React.FC<DateProps> = ({ date }) => {
	if (!date) {
		return "-";
	}
	const formattedDate = date.toLocaleTimeString([], {
		hour12: true,
		hour: "2-digit",
		minute: "2-digit",
	});

	return <>{formattedDate}</>;
};

export default DateComponent;
