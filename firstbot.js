require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Drift = require('drift-chat');
const Sequelize = require('sequelize');

// const sequelize = new Sequelize('postgres://postgres:testpassword@localhost:5432/postgres');
//
// sequelize
//   .authenticate()
//   .then(() => {
//     console.log('Connection has been established successfully.');
//   })
//   .catch(err => {
//     console.error('Unable to connect to the database:', err);
//   });
//
//
// const Conversation = sequelize.define('conversations', {
//   conversation_id: {
//     type: Sequelize.INTEGER,
//     primaryKey: true,
//   },
//   org_id: {
//     type: Sequelize.INTEGER
//   },
//   body: {
//     type: Sequelize.STRING
//   },
//   created_at: {
//     type: Sequelize.INTEGER
//   }
// });
//
// // force: true will drop the table if it already exists
// Conversation.sync({
//   force: true
// })

app.use(bodyParser.json());
app.listen(process.env.PORT || 3000, () => console.log('Your first bot is listening on port 3000!'));

app.get('/', async(message, res) => { //message is the request, res is the response
 return res.status(200).send('check it out!!')
})

app.post('/', async(request, response) => {
 //console.log(request.body);
 const {data, type, orgId} = request.body;
 if (!data) return response.send(400);


 if (data.type == 'private_note' && data.author.type == 'user'){
   if (data.body.startsWith('/howto')) {
     console.log('orgId is' + orgId)
     console.log('new message came in: ' + data.body)
     console.log('conversationId is ' + data.conversationId)
     console.log('created at ' + data.createdAt)    }

     return ([{
       'label': 'Send',
       'value': data.body,
       'type': 'action',
       'style': 'primary',
       'reaction': {
         type: 'delete'
       }
     },
     {
       'label': 'Cancel',
       'value': 'cancel',
       'type': 'noop',
     },
   ])
 }

})
