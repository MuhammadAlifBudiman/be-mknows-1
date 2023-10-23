import { App } from "@/app";
import { ValidateEnv } from "@utils/validateEnv";

import { AuthRoute } from "@routes/auth.routes";
import { UserRoute } from "@routes/users.routes";

ValidateEnv();

const app = new App([new AuthRoute(), new UserRoute()]);

app.listen();