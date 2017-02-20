# Alexa Skill Note Taker
An [AWS Lambda](http://aws.amazon.com/lambda) function of an Alexa skill for taking notes. It saves your notes in DynamoDB, so your notes can be read out or deleted later. The Alexa responses used Speech Synthesis Markup Language ([SSML](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speech-synthesis-markup-language-ssml-reference)) for richer audio effect.

###This Alexa skill is now live. You can enable it [here](http://alexa.amazon.com/spa/index.html#skills/dp/B06W9JQV4F/?ref=skill_dsk_skb_sr_0) or [here](https://www.amazon.com/Joanna-Zhang-Note-Taker/dp/B06W9JQV4F/ref=sr_1_1?s=digital-skills&ie=UTF8&qid=1487608455&sr=1-1).

However, to get it to work with your [Magic Mirror](https://github.com/MichMich/MagicMirror) Module - [Note Taker](https://github.com/joanaz/MMM-NoteTaker), you have to use your own DynamoDB, so you still have to create your own Lambda function & Alexa skill by following the instructions [below](#dependencies).


## One-shot Examples

```
User: "Alexa, ask Note Taker to take my note lunch with Linda at Maru tomorrow"
Alexa: "Dun dun dun. I have taken a new note. Your third note is lunch with Linda at Maru tomorrow"
```

```
User: "Alexa, ask Note Taker to read my notes"
Alexa: "As you wish. You have the following notes: ......"
```

```
User: "Alexa, ask Note Taker to read note number three"
Alexa: "Aha! Your third note is lunch with Linda at Maru tomorrow"
```

```
User: "Alexa, ask Note Taker to delete note number three"
Alexa: "Good riddance. Your third note, lunch with Linda at Maru tomorrow is deleted"
```

```
User: "Alexa, ask Note Taker to delete my notes"
Alexa: "Yay! All of your notes are deleted."
```


## List of commands

### Say Hello

- hello
- hi
- how are you

### Take Note

- take my note {asymmetric cryptography uses public and private keys to encrypt and decrypt data}
- take a note {dinner with Linda at six tomorrow at Hao}
- take note {interactive orange juice}

### Read all notes

- read all my notes
- read all notes
- read my notes
- read notes

### Read a note

*Note: readIndex has to be a cardinal number, not an ordinal number*

- read my note number {readIndex}
- read note number {readIndex}
- read number {readIndex}
- read note {readIndex}
- what's my note number {readIndex}
- what's note number {readIndex}

### Delete all notes

- delete all my notes
- delete all notes
- delete my notes
- delete all

### Delete a note

*Note: deleteIndex has to be a cardinal number, not an ordinal number*

- delete note number {deleteIndex}
- delete my note number {deleteIndex}
- delete number {deleteIndex}
- delete note {deleteIndex}


### Get Alexa User ID 

*Note: This is only for the use of the [Magic Mirror Module Note Taker](https://github.com/joanaz/MMM-NoteTaker). Your user ID will be displayed on your Alexa companion mobile app or on the [Alexa website](http://alexa.amazon.com/spa/index.html#cards)*

- what's my database user ID
- what's my user ID
- what's my user identifier
- what's my identifier
- my user ID
- my identifier


## Dependencies

On your terminal, navigate to the src folder, and enter `npm install`  to install dependencies.

- [alexa-sdk](https://github.com/alexa/alexa-skills-kit-sdk-for-nodejs) 


## Setup

To run this skill you need to do two things:

1. deploy the code in Lambda
2. configure the Alexa skill to use Lambda

### AWS Lambda Setup

1. Go to the AWS Console and click on the __Lambda__ link. Note: ensure you are in __us-east__ or you won't be able to use Alexa with Lambda.
2. Click on the __Create a Lambda Function__ or __Get Started Now__ button.
3. Choose __Blank Blueprint__
4. Choose trigger __Alexa Skills Kit__, click "Next"
5. Name the Lambda Function, select the runtime as __Node.js__
6. Go to your local __src__ directory, select all files and then create a zip file, make sure the zip file does not contain the src directory itself, otherwise Lambda function will not work.
7. Go back to the AWS Lambda console, select __Code entry type__ as "Upload a .ZIP file" and then upload the .zip file to the Lambda
8. Keep the Handler as index.handler (this refers to the main js file in the zip)
9. Create a new role for full access of DynamoDB:
    1. Go to the __IAM__ service from the AWS Console
    2. Click on Roles, then __Create New Role__
    3. Call this Role __lambda-dynamo-full-access-role__
    4. Select __AWS Lambda__ as the Role Type 
    5. Select policies __AmazonDynamoDBFullAccess__ and __CloudWatchFullAccess__ (for debug)
    6. Click __Next__, then __Create Role__
10. Go back to the Lambda console, __Choose an existing role__ 
11. Choose __lambda-dynamo-full-access-role__
12. Leave the Advanced settings as the defaults
13. Click "Next" and review the settings then click "Create Function"
14. Copy the __ARN__ from the top right to be used later in the Alexa Skill Setup

### Alexa Skill Setup

1. Go to the [Alexa Console](https://developer.amazon.com/edw/home.html) and click __Add a New Skill__.
2. Set "Mirror Mirror On The Wall" as the skill name and "on the wall" as the invocation name, this is what is used to activate your skill. For example you would say: "Alexa, on the wall, say hello". If you customized the wake word as "Mirror mirror", you can say "Mirror mirror on the wall, find Snow White".
3. Select the __Lambda ARN__ for the skill Endpoint and paste the ARN copied from above. Click Next.
4. Copy the __Intent Schema__ from the included IntentSchema.json in the speechAssets folder.
5. Copy the __Sample Utterances__ from the included SampleUtterances.txt. Click Next.
6. Go back to the skill Information tab and copy the appId. Paste the appId into the index.js file for the variable __APP_ID__, then update the Lambda source zip file with this change and __upload to Lambda__ again, this step makes sure the Lambda function only serves request from authorized source.
7. You are now able to start testing your Alexa skill! You should be able to go to the [Echo webpage](http://echo.amazon.com/#skills) and see your skill enabled.
8. In order to test it, try to say some of the Sample Utterances from the [List of commands](#list-of-commands) section above.
