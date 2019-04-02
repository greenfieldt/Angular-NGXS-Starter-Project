const express = require('express');
const compression = require('compression');

const CONTEXT = `/${process.env.CONTEXT || 'Increate'}`;
const PORT = process.env.PORT || 4000;

const app = express();

app.use(compression());
app.use(CONTEXT, express.static(__dirname + '/dist/Increate'));
app.use('/', express.static(__dirname + '/dist/Increate'));
app.use('*', express.static(__dirname + '/dist/Increate'));

app.listen(PORT, () => console.log(`App running on http://localhost:${PORT}${CONTEXT}`));
