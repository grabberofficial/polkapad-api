import { Application } from './application';

const application = new Application();

(async () => {
  await application.bootstrap();
})();
