import { useEffect, useRef } from 'react'
import { Snackbar, Alert, Button } from '@mui/material'
import App from './App'
import { useRegisterSW } from 'virtual:pwa-register/react'

export default function Root() {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('Service worker registered successfully');
      // Check for updates every hour
      if (r) {
        intervalRef.current = setInterval(() => {
          r.update();
        }, 60 * 60 * 1000);
      }
    },
    onRegisterError(error) {
      console.error('Service worker registration failed:', error);
    },
  });

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleUpdateClick = () => {
    updateServiceWorker(true);
  };

  const handleUpdateDismiss = () => {
    setNeedRefresh(false);
  };

  return (
    <>
      <App />
      <Snackbar
        open={needRefresh}
        onClose={handleUpdateDismiss}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity="info"
          variant="filled"
          onClose={handleUpdateDismiss}
          action={
            <Button color="inherit" size="small" onClick={handleUpdateClick}>
              UPDATE
            </Button>
          }
        >
          A new version is available! Click UPDATE to refresh.
        </Alert>
      </Snackbar>
    </>
  );
}
