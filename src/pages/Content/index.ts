import { MESSAGE_TYPE, EVENTS, SAVE_MASKS, CONSOLE_TOGGLE } from '../Shared/constants';
import { IPrebidDetails } from '../Injected/prebid';
import { detectIframe, sendWindowPostMessage } from '../Shared/utils';

let pbjsNamespace: string = null;
let port: chrome.runtime.Port | null = null;

const getPort = () => {
  if (!port) {
    port = chrome.runtime.connect({ name: 'professor-prebid' });
    port.onDisconnect.addListener(() => {
      port = null;
    });
  }
  return port;
};

const injectScript = () => {
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('/injected.bundle.js');
  script.id = 'professor prebid injected bundle';
  const node = document.head || document.documentElement;
  if (node && !['challenges.cloudflare.com'].includes(window.location.host)) {
    node.appendChild(script);
    script.onload = () => {
      script.remove();
    };
  } else {
    requestIdleCallback(injectScript);
  }
};

const listenToWindowMessages = () => {
  window.addEventListener('message', processWindowMessages, false);
};

const listenToChromeRuntimeMessages = () => {
  chrome.runtime?.onMessage.addListener(processChromeRuntimeMessages);
};

const processChromeRuntimeMessages = (request: { type: string; payload?: object;[key: string]: any }) => {
  if (request.type === MESSAGE_TYPE.CONSOLE_TOGGLE) {
    sendWindowPostMessage(request.type, { detail: request.consoleState });
  }
  if (request.type === MESSAGE_TYPE.PBJS_NAMESPACE_CHANGE) {
    pbjsNamespace = request.pbjsNamespace;
    sendWindowPostMessage(request.type, { detail: request.pbjsNamespace });
  }
  if (request.type === MESSAGE_TYPE.POPUP_LOADED) {
    window.postMessage({ type: 'FROM_CONTENT_SCRIPT', text: 'Hello from the content script!' }, '*');
    sendWindowPostMessage(request.type, request.payload);
  }
};

const processWindowMessages = async (event: MessageEvent<{ type: string; payload: object; profPrebid: boolean }>) => {
  if (!event.data.profPrebid || !event?.data || !event?.data?.type) return;
  const { type, payload } = event.data;

  if (type === EVENTS.REQUEST_CONSOLE_STATE) {
    const result = await chrome.storage?.local.get(CONSOLE_TOGGLE);
    const checked = result[CONSOLE_TOGGLE];
    document.dispatchEvent(new CustomEvent(CONSOLE_TOGGLE, { detail: !!checked }));
  }

  if (type === EVENTS.SEND_PREBID_DETAILS_TO_BACKGROUND) {
    pbjsNamespace = (payload as IPrebidDetails)?.namespace;
    getPort().postMessage({ type: MESSAGE_TYPE.PBJS_NAMESPACE_CHANGE, pbjsNamespace });
  }

  // not all events need to be sent to service worker ?
  sendToServiceWorker(type, payload);
  updateOverlays();
};

const sendToServiceWorker = (type: string, payload: object) => {
  if (!type || !payload || !chrome.runtime?.id) return;
  getPort().postMessage({ type, payload });
};

const updateOverlays = () => {
  if (pbjsNamespace) {
    document.dispatchEvent(new CustomEvent(SAVE_MASKS, { detail: pbjsNamespace }));
  }
};

const setUpListeners = () => {
  listenToWindowMessages();
  listenToChromeRuntimeMessages();
};
injectScript();

if (detectIframe() === false) {
  setUpListeners();
  const globals = (window as any)._pbjsGlobals || [];
  if (globals.length && !pbjsNamespace) {
    pbjsNamespace = globals[0];
    getPort().postMessage({ type: MESSAGE_TYPE.PBJS_NAMESPACE_CHANGE, pbjsNamespace });
  }
}
