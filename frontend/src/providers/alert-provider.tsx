import { createContext, useContext, useState, useCallback } from "react";
import { Alert } from "@app/components";
import { AlertData, AlertProviderProps } from "@app/types";

const AlertContext = createContext<any | undefined>(undefined);

export const useAlert = () => {
  return useContext(AlertContext);
};

export const AlertProvider = (props: AlertProviderProps) => {
  const [alerts, setAlerts] = useState<AlertData[]>([]);

  const addAlert = useCallback((alert: AlertData) => {
    const id = Date.now();
    setAlerts((prev) => [...prev, { ...alert, id, fadeOut: false }]);

    setTimeout(() => {
      setAlerts((prev) =>
        prev.map((a) => (a.id === id ? { ...a, fadeOut: true } : a))
      );

      setTimeout(() => {
        setAlerts((prev) => prev.filter((a) => a.id !== id));
      }, 300);
    }, 3000);
  }, []);

  return (
    <AlertContext.Provider value={{ addAlert }}>
      {props.children}
      <div className="fixed top-20 w-screen flex flex-col items-center">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`transition-opacity ${
              alert.fadeOut ? "animate-fade-out" : "animate-fade-in"
            }`}
          >
            <Alert type={alert.type} title={alert.title} message={alert.message} />
          </div>
        ))}
      </div>
    </AlertContext.Provider>
  );
};

export default AlertProvider;
