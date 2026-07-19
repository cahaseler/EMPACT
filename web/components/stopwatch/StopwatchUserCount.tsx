import React from 'react';
import { Users } from 'lucide-react';

interface StopwatchUserCountProps {
  count: number;
}

const StopwatchUserCount: React.FC<StopwatchUserCountProps> = ({ count }) => {
  return (
    <div className="text-xs text-muted-foreground text-center mt-3 flex items-center justify-center space-x-1">
      <Users size={12} />
      <span>{count} {count === 1 ? 'user' : 'users'} connected</span>
    </div>
  );
};

export default StopwatchUserCount;