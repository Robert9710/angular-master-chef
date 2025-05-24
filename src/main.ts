import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { Base } from './pages/base/base';

bootstrapApplication(Base, appConfig).catch((err) => console.error(err));
