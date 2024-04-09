import type React from "react";
import { useEffect, useState } from "react";

interface TimeUntilProps {
  date?: Date;
}

const TimeUntil: React.FC<TimeUntilProps> = ({ date }) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  if (!date) {
    return "-";
  }
  const milliseconds = date.getTime() - now.getTime();
  const minutes = Math.floor(milliseconds / 60_000);

  return <>{minutes}m</>;
};

export default TimeUntil;
