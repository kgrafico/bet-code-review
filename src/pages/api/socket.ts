import { Server } from "socket.io";
import type { NextApiRequest, NextApiResponse } from "next";
import run, { StatusEvent } from "./util/crawler";
import type { Server as HTTPServer } from "http";
import type { Socket as NetSocket } from "net";
import type { Server as IOServer } from "socket.io";

interface SocketServer extends HTTPServer {
  io?: IOServer | undefined;
}

interface SocketWithIO extends NetSocket {
  server: SocketServer;
}

interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithIO;
}

export default (_req: NextApiRequest, res: NextApiResponseWithSocket) => {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server);
    res.socket.server.io = io;
  }

  res.socket.server.io.on("connection", (socket) => {

    let cancel: () => void = null;

    function cancelIfRunning() {
      if (cancel) {
        cancel();
      }
    }

    socket.on("disconnect", () => {
      cancelIfRunning();
    });

    socket.on("cancel", () => {
      cancelIfRunning();
    });

    socket.on(
      "start",
      (
        url: string,
        followUrlRestriction: string,
        maxConcurrentRequests: number
      ) => {
        const runner = run(
          url,
          followUrlRestriction,
          maxConcurrentRequests
        );

        runner.status.on(StatusEvent.PROCESSING, function (url: string) {
          socket.emit("processing", url);
        });

        runner.status.on(StatusEvent.PROCESSED, function (url: string, _body: string) {
          socket.emit("processed", url);
        });

        runner.status.on(
          StatusEvent.SEEN,
          function (url: string, shouldFollow: boolean) {
            socket.emit("seen", url, shouldFollow);
          }
        );

        cancel = runner.cancel;
      }
    );
  });
  res.end();
};
