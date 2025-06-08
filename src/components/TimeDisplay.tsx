
import React, { useState, useEffect } from 'react';

const TimeDisplay = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: true,
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="text-left">
      <div className="text-3xl font-light text-white mb-1">
        {formatTime(currentTime)}
      </div>
      <div className="text-sm text-gray-400">
        {formatDate(currentTime)}
      </div>
    </div>
  );
};

export default TimeDisplay;
