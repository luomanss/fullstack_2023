import { PORT } from "./utils/config.js";
import app from "./app.js";
import log from "./utils/logger.js";

app.listen(PORT, () => {
  log.info(`Server running on port ${PORT}`);
});
