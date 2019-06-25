const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded());

app.use('/', (req, res) => {
	res.send({
		status: 200,
		message: 'Express Boilerplate'
	})
});

app.listen(8080, () => {
	console.log('Listening on port 8080');
});