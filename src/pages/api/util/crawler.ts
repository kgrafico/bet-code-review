import { EventEmitter } from "node:events";
import { StatusEvent } from "../../../types";
import { crawlUrl } from "./http";

const Runner = (
  url: string,
  followUrlRestriction: any,
  maxConcurrentRequests: number
) => {
  const status = new EventEmitter();
  EventEmitter.defaultMaxListeners = 20;
  
  const seen: string[] = [];
  let pending: string[] = [];
  let pendingQueue: string[] = [];
  let cancelled: boolean = false;
  let currentRequests = 0;

  const processQueue = async () => {
    const lastElementFromPendingQueue = pendingQueue.pop();

    status.emit(StatusEvent.PROCESSING, lastElementFromPendingQueue);

    pending = pending.filter(i => i !== lastElementFromPendingQueue);

    currentRequests++;

    await processingToProcessed(lastElementFromPendingQueue);

    while (pendingQueue?.length > 0 && currentRequests < maxConcurrentRequests) {
      processQueue();
    }

  }

  const processingToProcessed = async (lastElementFromPendingQueue) => {
    const [links, body] = await crawlUrl(lastElementFromPendingQueue);
  
    currentRequests--;
    status.emit(StatusEvent.PROCESSED, lastElementFromPendingQueue, body, links);

    processedToSeen(links);
  }

  const processedToSeen = (links) => {
    links.forEach((link) => {
      if (!seen.includes(link)) {

        seen.push(link);

        const shouldFollow = !pending.includes(link) && new RegExp(followUrlRestriction).test(link);

        status.emit(StatusEvent.SEEN, link, shouldFollow);
  
        if (shouldFollow) {
          pending.push(link);
          pendingQueue.push(link);
        }
      }
    });
  }
  
  if (!cancelled && url) {
    pending.push(url);
    pendingQueue.push(url);
    processQueue();
  }

  return {
    status,
    cancel: () => {
      cancelled = true;
    }
  }
}

export default Runner;
