import React from 'react';

interface StopwatchDisplayProps {
  displayTimeString: string;
}

const StopwatchDisplay: React.FC<StopwatchDisplayProps> = ({ displayTimeString }) => {
  return (
    <div className="text-center mb-3 pt-4">
      <span className="text-3xl font-mono font-semibold">
        {displayTimeString}
      </span>
    </div>
  );
};

export default StopwatchDisplay;