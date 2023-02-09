import app from './app';
import l from './config/logger';

l.info('Listen in port: 3331');

app.listen(3331);
