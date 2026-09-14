import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { config } from "./config.js";
import { getArtifactsResponse } from "./api/artifacts.js";
import { createCampaignResponse, getCampaignResponse } from "./api/campaigns.js";

function send(response: ServerResponse, status: number, payload: unknown) {
  response.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(payload));
}

async function readJson(request: IncomingMessage): Promise<unknown> {
  let body = "";
  for await (const chunk of request) body += chunk;
  try { return JSON.parse(body || "{}"); } catch { throw new Error("Request body must be valid JSON"); }
}

export const server = createServer(async (request, response) => {
  const url = new URL(request.url ?? "/", `http://${request.headers.host ?? "localhost"}`);
  try {
    if (request.method === "GET" && url.pathname === "/health") return send(response, 200, { status: "ok", service: config.serviceName, renderMode: config.renderMode });
    if (request.method === "POST" && url.pathname === "/v1/campaigns") return send(response, 201, await createCampaignResponse(await readJson(request)));
    const campaignMatch = url.pathname.match(/^\/v1\/campaigns\/([^/]+)$/);
    if (request.method === "GET" && campaignMatch) {
      const payload = getCampaignResponse(campaignMatch[1]);
      return payload ? send(response, 200, payload) : send(response, 404, { error: "Campaign not found" });
    }
    const artifactMatch = url.pathname.match(/^\/v1\/campaigns\/([^/]+)\/artifacts$/);
    if (request.method === "GET" && artifactMatch) {
      const payload = getArtifactsResponse(artifactMatch[1]);
      return payload ? send(response, 200, payload) : send(response, 404, { error: "Campaign not found" });
    }
    return send(response, 404, { error: "Route not found" });
  } catch (error) {
    return send(response, 400, { error: error instanceof Error ? error.message : "Invalid request" });
  }
});
