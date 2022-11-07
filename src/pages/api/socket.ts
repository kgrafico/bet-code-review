import { Server } from "socket.io";
import type { NextApiRequest } from "next";
import run from "./util/crawler";
import { NextApiResponseWithSocket, StatusEvent } from "../../types";

const ioHandler = (_req: NextApiRequest, res: NextApiResponseWithSocket) => {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server);
    res.socket.server.io = io;
  }

  res.socket.server.io.on("connection", (socket) => {

    let cancel: () => void = null;

    const cancelIfRunning = () => {
      if (cancel) {
        socket.disconnect();
        socket.removeAllListeners();
        cancel();
      }
    }

    socket.on("cancel", () => {
      cancelIfRunning();
    });

    socket.on(
      "start",
      (
        data
      ) => {
        const runner = run(
          data.url,
          data.followUrlRestriction,
          data.maxConcurrentRequests
        );

        runner.status.on(StatusEvent.PROCESSING, (url: string) => {
          socket.emit("processing", url);
        });

        runner.status.on(StatusEvent.PROCESSED, (url: string, _body: string) => {
          socket.emit("processed", url);
        });

        runner.status.on(
          StatusEvent.SEEN,
          (url: string, shouldFollow: boolean) => {
            socket.emit("seen", url, shouldFollow);
          }
        );

        cancel = runner.cancel;
      }
    );
  });
  res.end();
};

export default ioHandler;
