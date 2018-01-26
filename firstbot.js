require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Drift = require('drift-chat');
const Sequelize = require('sequelize');
const request = require('superagent');

const CONVERSATION_API_BASE = 'https://driftapi.com/conversations'

const TOKEN = 'EfV1DHwdnyg3DgP7DSCX6pwCMo8eKLKb'

//const DB_URL = 'postgres://unkgbaytvmtmim:dabcb3c53c61a002849ac80bdbc8e39736e43b3cc6d5f726b566c9e5baf37477@ec2-174-129-22-84.compute-1.amazonaws.com:5432/db76971qu5035q'

const DB_URL = 'postgres://totdytfagojfrt:0129d1dd1d4631a6a47a340b41fdc71e39cddd476aa823cffb7a99372336ff5c@ec2-23-21-195-249.compute-1.amazonaws.com:5432/ddqnnljlncturp'

const sequelize = new Sequelize(DB_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: true
  }
})

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

const Inquiry = sequelize.define('inquiries', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
  },
  conversationId: {
    type: Sequelize.INTEGER,
  },
  orgId: {
    type: Sequelize.INTEGER
  },
  timeStamp: {
    type: Sequelize.INTEGER
  },
  slashCommand: {
    type: Sequelize.STRING
  },
  issueContent: {
    type: Sequelize.STRING
  },
  issueCategory: {
    type: Sequelize.STRING
  }
});


//force: true will drop the table if it already exists
// Inquiry.sync({
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

//wrote it the old way for people to read
function makeNewInquiry(orgId, slashCommand, data) {
  const timeStamp = data.createdAt
  const issueContent = data.body.replace('/howto ', '')
  const issueCategory = 'howto'
  const conversationId = data.conversationId
  const messageId = data.id

  console.log('newInquiry Ran')
  Inquiry.create({
    id: messageId,
    conversationId: conversationId,
    orgId: orgId,
    timeStamp: 888,
    slashCommand: slashCommand,
    issueContent: issueContent,
    issueCategory: 'other'
  }).catch(err => console.log(err))

}

function updatelastIssue(lastReferencedId, updatedCategory){
  return Inquiry.findById(lastReferencedId)
  .then(inquiry => {
    inquiry.issueCategory = updatedCategory
    return inquiry.save()
  })
}

app.use(bodyParser.json());
app.listen(process.env.PORT || 3000, () => console.log('Your first bot is listening on port 3000!'));

// console.log(newInquiry(12345, 1234, 1234, 12345, 'howto', 'this is the issueContent'))

let lastReferencedId = 0
//shows it works on your public domain
app.get('/', async(message, res) => { //message is the request, res is the response
 return res.status(200).send('check it out!!')
})

app.post('/', async(request, response) => {
 console.log(request.body);
 const {data, type, orgId} = request.body;
 if (!data) return response.send(400);

 if (data.type == 'private_note' && data.author.type == 'user'){
   console.log('noted')
   if (data.body.startsWith('/howto')) {
     const slashCommand = 'howto'
     lastReferencedId = data.id
     makeNewInquiry(orgId, slashCommand, data)

     //run function to save inquiry into db
     console.log(lastReferencedId + ' should match '+ data.id)
     console.log('new message came in: ' + data.body)
     // console.log('orgId is' + orgId)
     // console.log('conversationId is ' + data.conversationId)
     // console.log('createdAt is '+ data.createdAt)
     return sendMessage(orgId ,data.conversationId, "What category does this issue fall into?")
   }
 }

if (type == 'button_action' && data.author.type == 'user'){
  console.log('issue category is '+ data.button.value)
  const updatedCategory = data.button.value
  updatelastIssue(lastReferencedId, updatedCategory)
}

})

//bot responds to my slash command
const sendMessage = (orgId, conversationId, message) => {
  return request.post(CONVERSATION_API_BASE + `/${conversationId}/messages`)
    .set('Content-Type', 'application/json')
    .set(`Authorization`, `bearer ${TOKEN}`)
    .send({body: message, orgId: orgId, type: 'private_prompt', buttons: categoryButtons})
    .catch(err => console.log(err))
}
