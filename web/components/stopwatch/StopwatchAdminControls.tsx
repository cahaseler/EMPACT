'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Play, Pause, RotateCcw, Plus } from 'lucide-react';

interface StopwatchAdminControlsProps {
    isRunning: boolean;
    remainingTime: number | null;
    customDurationInput: string;
    onTogglePlayPause: () => Promise<void>;
    onReset: () => void;
    onAddMinute: () => void;
    onPresetDuration: (minutes: number) => void;
    onCustomDurationInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSetCustomDuration: () => void;
}

const StopwatchAdminControls: React.FC<StopwatchAdminControlsProps> = ({
    isRunning,
    remainingTime,
    customDurationInput,
    onTogglePlayPause,
    onReset,
    onAddMinute,
    onPresetDuration,
    onCustomDurationInputChange,
    onSetCustomDuration,
}) => {
    return (
        <div className="flex flex-col space-y-2 mt-1">
            <div className="flex justify-center items-center space-x-1">
                <Button onClick={onTogglePlayPause} size="icon" title={isRunning ? "Pause" : "Start"} disabled={!isRunning && (remainingTime ?? 0) <= 0}>
                    {isRunning ? <Pause size={20} /> : <Play size={20} />}
                </Button>
                <Button onClick={onReset} size="icon" title="Reset Timer">
                    <RotateCcw size={20} />
                </Button>
                <Button onClick={onAddMinute} size="icon" title="Add 1 Minute" className="font-mono text-sm">
                    +1
                </Button>
            </div>

            {!isRunning && (
                <>
                    {/* Row 2: Presets */}
                    <div className="flex justify-center space-x-2 items-center pt-2">
                        <Button onClick={() => onPresetDuration(2)} variant="outline" className="px-2 py-1 h-auto">2:00</Button>
                        <Button onClick={() => onPresetDuration(4)} variant="outline" className="px-2 py-1 h-auto">4:00</Button>
                        <Button onClick={() => onPresetDuration(6)} variant="outline" className="px-2 py-1 h-auto">6:00</Button>
                    </div>

                    {/* Row 3: Custom Input */}
                    <div className="flex justify-center space-x-2 pt-2">
                        <Input
                            type="text"
                            value={customDurationInput}
                            onChange={onCustomDurationInputChange}
                            className="w-20 h-7"
                            aria-label="Set custom duration (e.g., 5, 5.5, 5:20)"
                            placeholder="MM:SS or M.m"
                        />
                        <Button onClick={onSetCustomDuration} variant="ghost" className="px-2 py-1 h-auto">Set</Button>
                    </div>
                </>
            )}
        </div>
    );
};

export default StopwatchAdminControls;