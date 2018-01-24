require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Drift = require('drift-chat');
const Sequelize = require('sequelize');
const request = require('superagent');

const CONVERSATION_API_BASE = 'https://driftapi.com/conversations'

const TOKEN = 'EfV1DHwdnyg3DgP7DSCX6pwCMo8eKLKb'

// const sequelize = new Sequelize(process.env.DATABASE_URL)
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
//   id: {
//     type: Sequelize.INTEGER,
//     primaryKey: true,
//   },
//   status: {
//     type: Sequelize.STRING
//   },
//   language: {
//     type: Sequelize.STRING
//   },
//   first_seen_at: {
//     type: Sequelize.INTEGER
//   },
//   first_seen_id: {
//     type: Sequelize.INTEGER
//   }
// });
//
// // force: true will drop the table if it already exists
// Conversation.sync({
//   force: true
// })

const categoryButtons = [
  {
    "label": 'Playbooks',
    "value": 'playbooks',
    "type": 'action',
    "style": 'primary',
    "reaction": {
      "type": 'replace',
      "message": 'playbooks - confirmed'
    }
  },
  {
    "label": 'Integrations',
    "value": 'integrations',
    "type": 'action',
    "style": 'primary',
    "reaction": {
      "type": 'replace',
      "message": 'integrations - confirmed'
    }
  },
  {
    "label": 'Widget',
    "value": 'widget',
    "type": 'action',
    "style": 'primary',
    "reaction": {
      "type": 'replace',
      "message": 'widget-confirmed'
    }
  },
  {
    "label": 'Contacts',
    "value": 'contacts',
    "type": 'action',
    "style": 'primary',
    "reaction": {
      "type": 'replace',
      "message": 'contacts-confirmed'
    }
  },
  {
    "label": 'WidgetAPI/JavascriptSDK',
    "value": 'api',
    "type": 'action',
    "style": 'primary',
    "reaction": {
      "type": 'replace',
      "message": 'api and sdk -confirmed'
    }
  },
  {
    "label": 'Other',
    "value": 'other',
    "type": 'compose',
    "style": 'primary',
    "reaction": {
      "type": 'replace',
      "message": 'other-confirmed'
    }
  },

]

// var responseMessage = {
//   "id": 1,
//   "orgId": 1,
//   "body": 'string',
//   "author": {
//     "type": user
//   },
//   "type": "private_prompt",
//   "conversationId": conversationId,
//   "buttons": categoryButtons,
// }

const sendMessage = (orgId, conversationId, message) => {
  return request.post(CONVERSATION_API_BASE + `/${conversationId}/messages`)
    .set('Content-Type', 'application/json')
    .set(`Authorization`, `bearer ${TOKEN}`)
    .send({body: message, orgId: orgId, type: 'private_prompt', buttons: categoryButtons})
    .catch(err => console.log(err))
}

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
   console.log('noted')
   if (data.body.startsWith('/howto')) {
     const messageBody = data.body.replace('/howto ', '')
     console.log('message is' + messageBody)
     console.log('orgId is' + orgId)
     return sendMessage(orgId ,data.conversationId, "What category does this issue fall into?")

     // console.log('new message came in: ' + data.body)
     // console.log('conversationId is ' + data.conversationId)
     // console.log('created at ' + data.createdAt)

   }
 }
})
