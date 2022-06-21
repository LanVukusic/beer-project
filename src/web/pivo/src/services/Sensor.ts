import { useState } from "react";
import { useToggle } from "../tools/useSwap";
import { useInterval } from "./useInterval";

export interface IHistory {
  timestamp: Date;
  value: number;
}

// connecting to sensor
export const useSensor = <T>(updateCb?: (data: IHistory) => void) => {
  const [isLoading, setIsloading] = useState<boolean>(false);
  const [data, setData] = useState<any>(null);
  const [i, setI] = useState<number>(0);
  let j = 0;
  // const [data, setData] = useState<IData<T> | null>(null);
  const [isError, setIsError] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [interval, setIntervalNum] = useState<number | undefined>(undefined);

  const connect = (url: string, pollRate: number) => {
    setIsloading(true);
    setIsError(false);

    setIntervalNum(
      setInterval(() => {
        fetch(url)
          .then((data) => {
            setIsConnected(true);
            data.text().then((text) => {
              console.log(text);
              setData(text);
              const d: IHistory = {
                timestamp: new Date(),
                value: parseFloat(text),
              };
              updateCb && updateCb(d);
            });

            setI(j);
            j++; // to je grdo samo neznam drgac
          })
          .catch((error) => {
            setIsError(true);
            setIsConnected(false);
            clearInterval(interval);
            console.log(error);
          })
          .finally(() => {
            setIsloading(false);
          });
      }, pollRate)
    );
  };

  // disconnect function
  const disconnect = () => {
    clearInterval(interval);
    setIsConnected(false);
    setIsloading(false);
  };

  return { isConnected, isLoading, isError, data, i, connect, disconnect };
};

export const useHistory = (maxLen: number) => {
  const [data, setData] = useState<IHistory[]>([]);

  const addData = (d: IHistory) => {
    const d2 = data;
    if (data.length >= maxLen) {
      d2.shift();
    }
    d2.push(d);
    setData(d2);
  };

  return { data, addData };
};
