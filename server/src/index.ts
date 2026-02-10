import Fastify from "fastify";
import cors from "@fastify/cors";
import compress from "@fastify/compress";
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";

import { pool, QUERIES, buildUpdateQuery } from "./db";
import { connectRedis, pubClient, subClient } from "./redis";
import { initDatabase } from "./seeder";

const fastify = Fastify({ logger: true });
const PORT = Number(process.env.PORT) || 4000;

async function start() {
  try {
    // 1. Infrastructure Setup
    await connectRedis();
    const dbRes = await pool.query(QUERIES.CHECK_CONN);
    console.log("✅ Postgres connected:", dbRes.rows[0].now);

    // 2. Data Initialization
    await initDatabase();

    // 3. Fastify Plugins
    await fastify.register(cors, { origin: "*" });
    await fastify.register(compress, { global: true });

    // 4. Socket.io Setup
    const io = new Server(fastify.server, { cors: { origin: "*" } });
    io.adapter(createAdapter(pubClient, subClient));

    io.on("connection", (socket) => {
      // socket.on('join', ...) logic if needed later
    });

    // 5. Routes
    fastify.get("/", async () => ({ status: "ok", service: "cloudtable-api" }));

    fastify.get("/rows", async (req, reply) => {
      const result = await pool.query(QUERIES.SELECT_ALL);
      return result.rows; // Fastify will serialize & compress this
    });

    fastify.patch("/rows/:id", async (req, reply) => {
      const { id } = req.params as { id: string };
      const updates = req.body as Record<string, any>;

      const query = buildUpdateQuery(id, updates);
      if (!query) return reply.code(400).send("No fields to update");

      const result = await pool.query(query.text, query.values);

      if (result.rowCount === 0) return reply.code(404).send("Row not found");

      const updatedRow = result.rows[0];
      io.emit("row_update", updatedRow); // Broadcast to all clients including other nodes

      return updatedRow;
    });

    // 6. Start Server
    await fastify.listen({ port: PORT, host: "0.0.0.0" });
    console.log(`🚀 Server listening on http://0.0.0.0:${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();
