const SLACK_URL = 'https://hooks.slack.com/services/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';
const NOTION_TOKEN = 'secret_kHRFfrS2OtPbHm8tASQGRSWPOYypCRc3alAn3KTXdk';
const NOTION_DB = '207c9a2939aa4d4cacfce123ca639d0e';

// An example of retrieving an Google Ads Report and sending it in a slack message.
function doPost(e) {
  const channelId = e.parameter.channel_id;

  var project = getProject(channelId);

  const memoUrl = createPage(project);
  
  sendSlackMessage(memoUrl);

  return ContentService.createTextOutput().setMimeType(ContentService.MimeType.JSON);
}


function getProject(channelId) {
  const url = 'https://api.notion.com/v1/databases/207c9a2939aa4d4cacfce123ca639d0e/query';
  const data = {
    "filter": {
        "property": "Slack_Channel_ID",
        "rich_text": {
            "equals": channelId
        }
    }
  }

  const options = {
    method: 'POST',
    contentType: 'application/json',
    headers: {
      'Authorization': 'Bearer ' + NOTION_TOKEN,
      'Notion-Version': '2022-06-28'
    },
    payload: JSON.stringify(data)
  };

  const response = UrlFetchApp.fetch(url, options);
  const contentObj = JSON.parse(response.getContentText());

  Logger.log(contentObj.results[0].id);

  return getProjectName(contentObj.results[0].id);
}

function getProjectName(id) {
  const url = 'https://api.notion.com/v1/pages/' + id + '/properties/title';

  console.log(url)
  const options = {
    method: 'GET',
    contentType: 'application/json',
    headers: {
      'Authorization': 'Bearer ' + NOTION_TOKEN,
      'Notion-Version': '2022-06-28'
    }
  };

  const response = UrlFetchApp.fetch(url, options);

  // console.log('sdfsdf', response);
  const contentObj = JSON.parse(response.getContentText());

  // console.log('wef', );

  // Logger.log('propertysdcsd: ', pageId);

  return contentObj.results[0].title.plain_text;
}

function createPage(name) {
  const url = 'https://api.notion.com/v1/pages';
  const data = {
    "parent": {
      "database_id": "207c9a2939aa4d4cacfce123ca639d0e"
    },
    "properties": {
        "Name": {
            "title": [
                {
                    "text": {
                        "content": name
                    }
                }
            ]
        }
    }
  }

  const options = {
    method: 'POST',
    contentType: 'application/json',
    headers: {
      'Authorization': 'Bearer ' + NOTION_TOKEN,
      'Notion-Version': '2022-06-28'
    },
    payload: JSON.stringify(data)
  };

  const response = UrlFetchApp.fetch(url, options);
  const contentObj = JSON.parse(response.getContentText());

  Logger.log(contentObj.url);

  return contentObj.url;
}

/**
 * Sends a message to Slack
 * @param {string} text The message to send in slack formatting. See:
 *     https://api.slack.com/docs/message-formatting.
 * @param {string=} opt_channel An optional channel, which can be channel e.g.
 *     '#google-ads' or a direct message e.g. '@sundar'. Defaults to '#general'.
 */
function sendSlackMessage(text, opt_channel) {
  const slackMessage = {
    text: text,
    icon_url:
        'https://www.gstatic.com/images/icons/material/product/1x/adwords_64dp.png',
    username: 'Google Ads Scripts',
    channel: opt_channel || '#gas'
  };

  const options = {
    method: 'POST',
    contentType: 'application/json',
    payload: JSON.stringify(slackMessage)
  };
  UrlFetchApp.fetch(SLACK_URL, options);
}

// function doPost(request){
//   console.log("GOT here");
//   var params = request.parameter;
//   var text = params.text; //the options provided after the command as a single string
//   //visit https://api.slack.com/slash-commands/#app_command_handling for available payload sent by slack
//   var names = text.split(" ");
//   var firstName = names[0];
//   var lastName = names[1];
  
//   addRow(firstName, lastName);//call function to add row as declared below
  
//   var response = {    
//     "response_type": "ephemeral",
//     "text": firstName + " " + lastName +" has been added to our records",
//   };
//   //finally we return the reponse back to slack
//   return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(ContentService.MimeType.JSON);
// }

// function addRow(firstName, lastName) {
//    // more info https://developers.google.com/apps-script/guides/sheets
//    var sheet = SpreadsheetApp.getActiveSheet();
//    sheet.appendRow([firstName, lastName]);//adds a new row to the sheet
// }