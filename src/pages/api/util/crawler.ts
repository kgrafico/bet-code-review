import { EventEmitter } from "node:events";
import { crawlUrl } from "./http";

export enum StatusEvent {
  PROCESSING = "processing",
  PROCESSED = "processed",
  SEEN = "seen",
}

export default function runner(
  url: string,
  followUrlRestriction: any,
  maxConcurrentRequests: number
) {
  const status = new EventEmitter();
  let pending: string[] = [];
  const seen: string[] = [];
  const visited: string[] = [];

  let cancelled = false;
  let currentRequests = 0;
  let pendingQueue: string[] = [];

  async function processQueue() {

    if (cancelled) {
      return;
    }

    const url = pendingQueue.pop();

    if (!url) {
      return;
    }

    status.emit(StatusEvent.PROCESSING, url);

    pending = pending.filter(i => {return i !== url});

    currentRequests++;

    const [links, body] = await crawlUrl(url);

    visited.push(url);
    currentRequests--;

    status.emit(StatusEvent.PROCESSED, url, body, links);

    links.forEach((link) => {
      if (!seen.includes(link)) {
        seen.push(link);
        const shouldFollow =
          !pending.includes(link) &&
          !visited.includes(link) &&
          new RegExp(followUrlRestriction).test(link);
        status.emit(StatusEvent.SEEN, link, shouldFollow);
        if (shouldFollow) {
          pending.push(link);
          pendingQueue.push(link);
        }
      }
    });

    while (pendingQueue.length > 0 && currentRequests < maxConcurrentRequests) {
      processQueue();
    }
  }

  pending.push(url);
  pendingQueue.push(url);
  processQueue();

  return {
    status,
    cancel: function() {
      cancelled = true;
    }
  }
}
