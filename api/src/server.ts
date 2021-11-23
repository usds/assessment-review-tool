import * as dotenv from 'dotenv';
import App from './app';
import Routes from './interfaces/routes.interface';
import AdminRoute from './routes/admin.routes';
import ApplicationRoute from './routes/application.routes';
import AssessmentHurdleRoute from './routes/assessmenthurdle.routes';
import EvaluationRoute from './routes/evaluation.routes';
import UsersRoute from './routes/users.routes';
import MetricsRouter from './routes/metrics.routes';
import ReviewRouter from './routes/review.routes';

const allRoutes: Routes[] = [
  new AdminRoute(),
  new UsersRoute(),
  new AssessmentHurdleRoute(),
  new ApplicationRoute(),
  new EvaluationRoute(),
  new MetricsRouter(),
  new ReviewRouter(),
];

const port = parseInt(<string>process.env.PORT) || 9000;
const app = new App(port, process.env.NODE_ENV || 'development', allRoutes);

process.on('uncaughtException', err => {
  console.log(JSON.stringify(err));
});
process.on('exit', () => {
  console.log('exit');
  app?.cleanup();
});
process.on('SIGTERM', () => {
  console.log('sigterm');

  app?.cleanup();
});
app.listen();
