const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = process.env.PORT || 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  });

  const io = new Server(server, {
    cors: {
      origin: ["http://localhost:3000", "http://localhost:3001"],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Handle joining parcel-specific room for real-time updates
    socket.on("join-parcel", (parcelId) => {
      socket.join(`parcel-${parcelId}`);
      console.log(`Socket ${socket.id} joined parcel room: parcel-${parcelId}`);
    });

    // Handle joining user-specific room
    socket.on("join-user", (userId) => {
      socket.join(`user-${userId}`);
      console.log(`Socket ${socket.id} joined user room: user-${userId}`);
    });

    // Handle joining agent-specific room
    socket.on("join-agent", (agentId) => {
      socket.join(`agent-${agentId}`);
      console.log(`Socket ${socket.id} joined agent room: agent-${agentId}`);
    });

    // Handle leaving rooms
    socket.on("leave-parcel", (parcelId) => {
      socket.leave(`parcel-${parcelId}`);
      console.log(`Socket ${socket.id} left parcel room: parcel-${parcelId}`);
    });

    // Handle agent location updates
    socket.on("agent-location-update", (data) => {
      console.log(`Agent location update from ${data.agentId}:`, data);

      // Broadcast to admin rooms
      socket.to("user-admin").emit("agent-location-update", data);

      // If parcelId is provided, broadcast to that parcel's room
      if (data.parcelId) {
        socket
          .to(`parcel-${data.parcelId}`)
          .emit("agent-location-update", data);
      }

      // Broadcast to the agent's own room for multiple devices
      socket.to(`agent-${data.agentId}`).emit("agent-location-update", data);
    });

    socket.on("disconnect", (reason) => {
      console.log(`Client disconnected: ${socket.id}, reason: ${reason}`);
    });
  });

  // Store io instance globally for use in API routes
  global.io = io;

  server
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
      console.log(`> Socket.IO server running on same port`);
    });
});
