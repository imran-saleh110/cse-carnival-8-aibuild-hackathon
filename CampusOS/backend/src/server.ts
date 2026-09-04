import app from './app';
import { env } from './config/env';

app.listen(env.PORT, () => {
  console.log(`CampusOS backend running on http://localhost:${env.PORT}`);
});
