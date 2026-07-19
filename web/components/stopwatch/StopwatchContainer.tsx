'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Settings, Minimize2, Timer } from 'lucide-react';

interface StopwatchContainerProps {
    isMinimized: boolean;
    canControl: boolean;
    showAdminControls: boolean;
    onToggleMinimize: () => void;
    onToggleAdminControls: () => void;
    isFlashing: boolean;
    children: React.ReactNode;
}

const StopwatchContainer: React.FC<StopwatchContainerProps> = ({
    isMinimized,
    canControl,
    showAdminControls,
    onToggleMinimize,
    onToggleAdminControls,
    isFlashing,
    children
}) => {
    // Minimized view
    if (isMinimized) {
        return (
            <div
                className={`absolute top-20 right-12 z-50 w-10 h-10 bg-background p-2 rounded-md shadow-md border flex items-center justify-center cursor-pointer hover:bg-muted transition-colors ${isFlashing ? 'bg-sidebar-primary text-sidebar-primary-foreground' : ''}`}
                onClick={onToggleMinimize}
                title="Maximize Timer"
            >
                <Timer size={16} />
            </div>
        );
    }

    // Full view
    return (
        <div className={`absolute top-20 right-12 z-50 bg-background p-4 rounded-md shadow-md border w-64 transition-colors ${isFlashing ? 'bg-sidebar-primary text-sidebar-primary-foreground' : ''}`}>
            <Button
                variant="ghost"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6"
                onClick={onToggleMinimize}
                title="Minimize Timer"
            >
                <Minimize2 size={16} />
            </Button>

            {canControl && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-1 left-1 h-6 w-6"
                    onClick={onToggleAdminControls}
                    title={showAdminControls ? 'Hide Controls' : 'Show Controls'}
                >
                    <Settings size={16} />
                </Button>
            )}

            {children}
        </div>
    );
};

export default StopwatchContainer;