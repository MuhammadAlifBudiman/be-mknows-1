import { App } from "@/app";
import { ValidateEnv } from "@utils/validateEnv";

import { AuthRoute } from "@routes/auth.routes";
import { UserRoute } from "@routes/users.routes";
import { AccountRoute } from "@routes/account.routes";
import { FileRouter } from "@routes/files.routes";

ValidateEnv();

const app = new App([
  new AuthRoute(), 
  new UserRoute(),
  new AccountRoute(),
  new FileRouter()
]);

app.listen();