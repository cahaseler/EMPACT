"use client";

import React, { useEffect, useRef } from 'react';
import { UserbackProvider, useUserback } from '@userback/react';
import { UserbackOptions } from '@userback/widget';

interface UserbackProviderClientProps {
  children: React.ReactNode;
  token: string;
  options: UserbackOptions;
}

const IdentifyUser: React.FC<{ options: UserbackOptions }> = ({ options }) => {
  console.log('IdentifyUser component rendering...');
  const { isLoaded, identify } = useUserback();
  const [identified, setIdentified] = React.useState(false);
  // Use a ref to store the interval ID for cleanup
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const name = options.name;
    const email = options.email;

    // Clear any existing interval on re-run or unmount
    const clearPollingInterval = () => {
      if (intervalRef.current) {
        console.log("IdentifyUser: Clearing polling interval.");
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    // Only proceed if we have user data and haven't identified yet
    if (!identified && name && email) {
      const checkAndIdentify = () => {
        const loaded = isLoaded();
        console.log(`IdentifyUser Check: isLoaded=${loaded}, identified=${identified}, name=${name}, email=${email}`);
        if (loaded) {
          console.log("IdentifyUser: Conditions met via polling/check. Calling identify().");
          identify(email, { name: name, email: email });
          setIdentified(true);
          clearPollingInterval(); // Stop polling once identified
          return true; // Indicate success
        }
        return false; // Indicate still not loaded
      };

      // Try immediately first
      if (!checkAndIdentify()) {
        // If not loaded yet, start polling
        console.log("IdentifyUser: Script not loaded yet, starting polling.");
        // Clear previous interval just in case (shouldn't happen with current deps, but safe)
        clearPollingInterval();
        intervalRef.current = setInterval(checkAndIdentify, 200); // Poll every 200ms
      }
    } else {
      // If conditions (name/email/!identified) are not met, ensure no interval is running
      clearPollingInterval();
    }

    // Cleanup function for the effect
    return clearPollingInterval;

  // Re-run when identify function reference changes (should be stable),
  // when identified state changes, or when name/email values change.
  }, [identify, identified, options.name, options.email, isLoaded]); // Added isLoaded back - needed for the check inside effect

  return null;
};

export function UserbackProviderClient({ children, token, options }: UserbackProviderClientProps) {
  if (!token) {
    console.error("Userback token is missing on the client.");
    return <>{children}</>;
  }

  return (
    <UserbackProvider token={token}>
      <IdentifyUser options={options} />
      {children}
    </UserbackProvider>
  );
}