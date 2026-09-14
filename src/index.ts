import { config } from "./config.js";
import { server } from "./server.js";

server.listen(config.port, () => {
  console.log(`${config.serviceName} listening on port ${config.port} in ${config.renderMode} mode`);
});
