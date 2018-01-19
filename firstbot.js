require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Drift = require('drift-chat');

app.use(bodyParser.json());
app.listen(process.env.PORT || 3000, () => console.log('Your first bot is listening on port 3000!'));

app.get('/', async(message, res) => { //message is the request, res is the response
  return res.status(200).send('check it out!!')
})

app.post('/', async(request, response) => {
  console.log(request.body);
  const {data, type} = request.body;
  if (!data) return response.send(400);

  if (type == 'new message'){
    console.log('new message came in' + data.body)
  }

})
