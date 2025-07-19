import { logger } from "./application/logging";
import app from "./application/web";

app.listen(3000, () => {
  logger.info("Server is running on port 3000");
});
