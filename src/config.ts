export const config = {
  port: Number.parseInt(process.env.PORT ?? "3000", 10),
  renderMode: "mock" as const,
  serviceName: "video-machine"
};
