require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Drift = require('drift-chat');
const Sequelize = require('sequelize');
const request = require('superagent');

const CONVERSATION_API_BASE = 'https://driftapi.com/conversations'

const TOKEN = 'EfV1DHwdnyg3DgP7DSCX6pwCMo8eKLKb'

const sendMessage = (orgId, conversationId, message) => {
  return request.post(CONVERSATION_API_BASE + `/${conversationId}/messages`)
    .set('Content-Type', 'application/json')
    .set(`Authorization`, `bearer ${TOKEN}`)
    .send({body: message, orgId: 1, type: 'private_prompt'})
    .catch(err => console.log(err))
}


app.use(bodyParser.json());
app.listen(process.env.PORT || 3000, () => console.log('Your first bot is listening on port 3000!'));

app.get('/', async(message, res) => { //message is the request, res is the response
 return res.status(200).send('check it out!!')
})

// const askCategory = ({orgId, conversationId, buttonset}) => {
//   const message = {
//     'orgId': orgId,
//     'body': 'which category does this fall into?',
//     'type': 'private_prompt',
//     'buttons': buttonset
//   }
//   return message;
// }


app.post('/', async(request, response) => {
 //console.log(request.body);
 const {data, type, orgId} = request.body;
 if (!data) return response.send(400);

 if (data.type == 'private_note' && data.author.type == 'user'){
   console.log('noted')
   if (data.body.startsWith('/howto')) {
     const messageBody = data.body.replace('/howto ', '')
     console.log('message is' + messageBody)

     const buttonset = [
       {
         "label": 'playbooks',
         "value": 'playbooks',
         "type": 'action',
         "style": 'primary',
         "reaction": {
           "type": 'replace',
           "message": 'playbooks - confirmed'
         }
       },
       {
         "label": 'integrations',
         "value": 'integrations',
         "type": 'action',
         "style": 'primary',
         "reaction": {
           "type": 'replace',
           "message": 'integrations - confirmed'
         }
       },
       {
         "label": 'widget',
         "value": 'widget',
         "type": 'action',
         "style": 'primary',
         "reaction": {
           "type": 'replace',
           "message": 'widget-confirmed'
         }
       }
     ]

    // return askCategory(orgId, data.conversationId, buttonset)
     console.log('orgId is' + orgId)
     console.log(buttonset)
     return sendMessage(orgId ,data.conversationId, "this is the response")
     // return request.post('hello testing')

     // console.log('new message came in: ' + data.body)
     // console.log('conversationId is ' + data.conversationId)
     // console.log('created at ' + data.createdAt)

   }
 }
 return response.send('okay okay')

})
