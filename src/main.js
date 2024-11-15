import { logger } from "./applications/logging.js";
import { web } from "./applications/web.js";

const port = process.env.PORT || 8000;

web.listen(port, () => {
    logger.info(`Running Server on port ${port} success`);
});