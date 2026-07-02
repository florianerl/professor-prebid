import React, { createContext, useEffect, useState } from 'react';
import { getTabId } from '../utils';
import { useDebounce } from '../hooks/useDebounce';
import { fetchEvents } from './fetchEvents';

const InspectedPageContext = createContext<IPageContext | undefined>(undefined);

interface ChromeStorageProviderProps {
  children: React.ReactNode;
}
export const InspectedPageContextProvider = ({ children }: ChromeStorageProviderProps) => {
  const [frames, setFrames] = useState<{ [key: string]: IFrameInfo }>({});
  const [downloading, setDownloading] = useState<'true' | 'false' | 'error'>('false');
  const [syncInfo, setSyncInfo] = useState<string>('');
  const [initReqChainData, setInitReqChainData] = useState<initReqChainResult>({});
  const initReqChainResult = useDebounce(initReqChainData, 2000);
  const [downloadingUrls, setDownloadingUrls] = useState<string[]>([]);

  useEffect(() => {
    // Read initial value from chrome.storage.local
    getTabId().then((tabId) => {
      const key = `tab_info_${tabId}`;
      chrome.storage.local.get([key], async (res) => {
        const tabInfo = res[key];
        if (tabInfo) {
          const tabInfoWithEvents = await fetchEvents(tabInfo, setDownloading, setSyncInfo, []);
          setFrames(tabInfoWithEvents);
        }
      });
    });
  }, []);

  useEffect(() => {
    // Subscribe to changes in local storage
    const handler = (changes: { [key: string]: chrome.storage.StorageChange }, areaName: 'local' | 'sync' | 'managed' | 'session') => {
      if (areaName === 'local') {
        getTabId().then((tabId) => {
          const key = `tab_info_${tabId}`;
          if (changes[key]) {
            if (JSON.stringify(changes[key].newValue) !== JSON.stringify(changes[key].oldValue)) {
              fetchEvents(changes[key].newValue || {}, setDownloading, setSyncInfo, downloadingUrls).then(setFrames);
            }
          }
        });
      }
    };
    chrome.storage.onChanged.addListener(handler);

    // keep only the last 100 urls
    if (downloadingUrls.length > 100) {
      setDownloadingUrls(downloadingUrls.slice(1));
    }

    // Unsubscribe when component unmounts
    return () => {
      chrome.storage.onChanged.removeListener(handler);
    };
  }, [downloadingUrls]);

  useEffect(() => {
    // Subscribe to changes in local storage
    const handler = (changes: { [key: string]: chrome.storage.StorageChange }, areaName: 'local' | 'sync' | 'managed' | 'session') => {
      if (areaName === 'local' && changes.initReqChain && changes.initReqChain.newValue) {
        setInitReqChainData(JSON.parse(changes.initReqChain.newValue));
      }
    };
    chrome.storage.onChanged.addListener(handler);

    // Unsubscribe when component unmounts
    return () => {
      chrome.storage.onChanged.removeListener(handler);
    };
  }, []);

  const contextValue: IPageContext = {
    frames,
    downloading,
    syncState: syncInfo,
    initReqChainResult,
  };

  return <InspectedPageContext.Provider value={contextValue}>{children}</InspectedPageContext.Provider>;
};

export default InspectedPageContext;

export interface IPageContext {
  frames: { [key: string]: IFrameInfo };
  downloading: string;
  syncState: string;
  initReqChainResult: any;
}
