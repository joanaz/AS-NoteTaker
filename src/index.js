'use strict';
/**
 * A Lambda function for handling Alexa Skill Note Taker requests.
 *
 * Examples:
 * One-shot model:
 *  User: "Alexa, ask Note Taker to take down lunch with Linda at Maru tomorrow."
 *  Alexa: "Ok, I have taken a new note. Your note number nine is lunch with Linda at Maru tomorrow."
 */

/**
 * App ID for the skill
 * 
 * replace with your app ID 
 */
const APP_ID = "amzn1.ask.skill.983d4696-e720-47a6-96b0-acc4bbde8ea8";

const Alexa = require('alexa-sdk');

var languageStrings = {
    "en-US": {
        "translation": {
            "WELCOME_MESSAGE": "<say-as interpret-as='interjection'>Ta da!</say-as> Welcome to the Note Taker! I can take notes for you and read them out. Say 'take my note' and tell me your note. Say 'read my notes' to hear all your notes.",
            "WELCOME_REPROMPT": "<say-as interpret-as='interjection'>Yoink.</say-as> If you want me to take a note, say 'take my note' and followed by your note. If you want me to read all your notes, say 'read all my notes'. If you want me to delete all your notes, say 'delete all my notes'. If you know the index number of a particular note, you can ask me to read it by saying 'read note number x', or delete it by saying 'delete note number x'. If you don't want to continue, say 'stop' to end our session. You got that? Now. <say-as interpret-as='interjection'>Bada bing bada boom. </say-as> What would you like me to do?",
            "WELCOME_CARD_TITLE": "Welcome to the Note Taker",
            "WELCOME_CARD": "Welcome to the Note Taker! I can take notes for you and read them out. \nIf you want me to take a note, say 'take my note' and followed by your note. \nIf you want me to read all your notes, say 'read all my notes'. \nIf you want me to delete all your notes, say 'delete all my notes'. \nIf you know the index number of a particular note, you can ask me to read it by saying 'read note number x', or delete it by saying 'delete note number x'. \nIf you don't want to continue, say 'stop' to end our session.",
            "HELP_MESSAGE": "<say-as interpret-as='interjection'>Howdy!</say-as> To take a note, say 'take my note' and followed by your note. To hear all your notes, say 'read all my notes'. To delete all your notes, say 'delete all my notes'. If you know the index number of a particular note, you can ask me to read it by saying 'read note number x', or delete it by saying 'delete note number x'. If you don't want to continue, say 'stop' to end our session. Now. <say-as interpret-as='interjection'>Bada bing bada boom. </say-as> What would you like me to do?",
            "HELP_CARD_TITLE": "Help",
            "STOP_MESSAGE": "<say-as interpret-as='interjection'>Cheerio!</say-as>",
            "STOP_CARD_TITLE": "Goodbye",
            "STOP_CARD": "Thanks for using Note Taker!",
            "NEW_NOTE_MESSAGE": "<say-as interpret-as='interjection'>Dun dun dun.</say-as> I have taken a new note. Your <say-as interpret-as='ordinal'>%s</say-as> note is %s.",
            "NEW_NOTE_TITLE": "New Note Added",
            "READ_ALL_NOTES_MESSAGE": "<say-as interpret-as='interjection'>As you wish.</say-as> You have the following notes: %s",
            "READ_ALL_NOTES_TITLE": "Your Notes",
            "NO_NOTES_ERR": "<say-as interpret-as='interjection'>Boo.</say-as> You don't have any notes.",
            "NO_NOTES_CARD": "You don't have any notes.",
            "READ_NOTE_MESSAGE": "<say-as interpret-as='interjection'>Aha!</say-as> Your <say-as interpret-as='ordinal'>%s</say-as> note is %s",
            "READ_NOTE_TITLE": "Note %s",
            "DELETE_ALL_NOTES_MESSAGE": "<say-as interpret-as='interjection'>Yay!</say-as> All of your notes are deleted.",
            "DELETE_ALL_NOTES_TITLE": "All Notes Deleted all",
            "DELETE_ALL_NOTES_CARD": "All of your notes are deleted.",
            "DELETE_NOTE_MESSAGE": "<say-as interpret-as='interjection'>Good riddance.</say-as> Your <say-as interpret-as='ordinal'>%s</say-as> note, %s is deleted.",
            "DELETE_NOTE_TITLE": "Note Deleted",
            "DELETE_NOTE_CARD": "Note #%s %s is deleted.",
            "NOTE_INDEX_ERR": "<say-as interpret-as='interjection'>Uh oh.</say-as> You don't have note number %s",
            "NOTE_INDEX_CARD": "You don't have note number %s",
            "ERR_MESSAGE": "<say-as interpret-as='interjection'>Yoink.</say-as> Sorry, I didn't get that. To ask me to take down a note for you, say 'take my note' and followed by your note. To hear all your notes, say 'read all my notes'. To delete all your notes, say 'delete all my notes'. If you know the index number of a particular note, you can ask me to read it by saying 'read note number x', or delete it by saying 'delete note number x'. If you don't want to continue, say 'stop' to end our session. Now. <say-as interpret-as='interjection'>Bada bing bada boom. </say-as> What would you like me to do?",
            "ERR_CARD_TITLE": "Error",
            "ERR_CARD": "Sorry, I didn't get that. To ask me to take down a note for you, say 'take my note' and followed by your note. To hear all your notes, say 'read all my notes'. To delete all your notes, say 'delete all my notes'. If you know the index number of a particular note, you can ask me to read it by saying 'read note number x', or delete it by saying 'delete note number x'. If you don't want to continue, say 'stop' to end our session.",
            "USER_ID_MESSAGE": "Your user <say-as interpret-as='spell-out'>id</say-as> is now displayed on your Alexa companion app.",
            "USER_ID_CARD": "Your User ID"
        }
    }
};

var handlers = {
    'LaunchRequest': function() {
        this.emit('SayHello')
    },
    'HelloIntent': function() {
        this.emit('SayHello')
    },
    'SayHello': function() {
        if (Object.keys(this.attributes).length === 0) {
            // Check if it's the first time the skill has been invoked
            this.attributes['notes'] = []
        }
        this.emit(':askWithCard', this.t("WELCOME_MESSAGE"), this.t("WELCOME_REPROMPT"), this.t("WELCOME_CARD_TITLE"), this.t("WELCOME_CARD"))
    },
    'NoteTakingIntent': function() {
        if (Object.keys(this.attributes).length === 0) {
            // Check if it's the first time the skill has been invoked
            this.attributes['notes'] = []
        }
        let note = this.event.request.intent.slots.note.value
        if (note) {
            this.attributes['notes'].push(note)
            let indexValue = this.attributes['notes'].length.toString()

            this.emit(':tellWithCard', this.t("NEW_NOTE_MESSAGE", indexValue, note), this.t("NEW_NOTE_TITLE"), indexValue + ". " + note)
        } else {
            this.emit('Unhandled')
        }
    },
    'ReadAllNotesIntent': function() {
        if (Object.keys(this.attributes).length === 0 || this.attributes['notes'].length === 0) {
            // Check if it's the first time the skill has been invoked
            this.attributes['notes'] = []
            this.emit(':tellWithCard', this.t("NO_NOTES_ERR"), this.t("ERR_CARD_TITLE"), this.t("NO_NOTES_CARD"))
        } else {
            let notesString = this.attributes['notes'].reduce((total, curr, index) =>
                (total + (index + 1).toString() + ". " + curr + '. \n '), '')
            this.emit(':tellWithCard', this.t("READ_ALL_NOTES_MESSAGE", notesString), this.t("READ_ALL_NOTES_TITLE"), notesString)
        }
    },
    'ReadNoteIntent': function() {
        if (Object.keys(this.attributes).length === 0 || this.attributes['notes'].length === 0) {
            // Check if it's the first time the skill has been invoked
            this.attributes['notes'] = []
            this.emit(':tellWithCard', this.t("NO_NOTES_ERR"), this.t("ERR_CARD_TITLE"), this.t("NO_NOTES_CARD"))
        } else {
            let indexValue = this.event.request.intent.slots.readIndex.value
            let index = parseInt(indexValue) - 1

            if (isNaN(index)) {
                this.emit('Unhandled')
            } else if (index >= this.attributes['notes'].length) {
                this.emit(':tellWithCard', this.t("NOTE_INDEX_ERR", indexValue), this.t("ERR_CARD_TITLE"), this.t("NOTE_INDEX_CARD", indexValue))
            } else {
                let note = this.attributes['notes'][index]

                this.emit(':tellWithCard', this.t("READ_NOTE_MESSAGE", indexValue, note), this.t("READ_NOTE_TITLE", indexValue), note)
            }
        }
    },
    'DeleteAllNotesIntent': function() {
        this.attributes['notes'] = []
        this.emit(':tellWithCard', this.t("DELETE_ALL_NOTES_MESSAGE"), this.t("DELETE_ALL_NOTES_TITLE"), this.t("DELETE_ALL_NOTES_CARD"))
    },
    'DeleteNoteIntent': function() {
        if (Object.keys(this.attributes).length === 0 || this.attributes['notes'].length === 0) {
            // Check if it's the first time the skill has been invoked
            this.attributes['notes'] = []
            this.emit(':tellWithCard', this.t("NO_NOTES_ERR"), this.t("ERR_CARD_TITLE"), this.t("NO_NOTES_CARD"))
        } else {
            let indexValue = this.event.request.intent.slots.deleteIndex.value
            let index = parseInt(indexValue) - 1

            if (isNaN(index)) {
                this.emit('Unhandled')
            } else if (index >= this.attributes['notes'].length) {
                this.emit(':tellWithCard', this.t("NOTE_INDEX_ERR", indexValue), this.t("ERR_CARD_TITLE"), this.t("NOTE_INDEX_CARD", indexValue))
            } else {
                let note = this.attributes['notes'].splice(index, 1)

                this.emit(':tellWithCard', this.t("DELETE_NOTE_MESSAGE", indexValue, note), this.t("DELETE_NOTE_TITLE"), this.t("DELETE_NOTE_CARD", indexValue, note))
            }
        }
    },
    'UserIDIntent': function() {
        let userId = this.event.session.user.userId
        console.log(userId)
        this.emit(':tellWithCard', this.t("USER_ID_MESSAGE"), this.t("USER_ID_CARD"), userId)
    },
    'AMAZON.HelpIntent': function() {
        this.emit(':askWithCard', this.t("HELP_MESSAGE"), this.t("HELP_MESSAGE"), this.t("HELP_CARD_TITLE"), this.t("WELCOME_CARD"));
    },
    'AMAZON.StopIntent': function() {
        this.emit(':StopSession');
    },
    'AMAZON.CancelIntent': function() {
        this.emit(':StopSession');
    },
    'StopSession': function() {
        this.emit(':tellWithCard', this.t("STOP_MESSAGE"), this.t("STOP_CARD_TITLE"), this.t("STOP_CARD"))
    },
    'SessionEndedRequest': function() {
        console.log('session ended!');
        this.emit(':saveState', true);
        // Be sure to call :saveState to persist your session attributes in DynamoDB
    },
    'Unhandled': function() {
        this.emit(':askWithCard', this.t("ERR_MESSAGE"), this.t("ERR_MESSAGE"), this.t("ERR_CARD_TITLE"), this.t("ERR_CARD"))
    }
};

exports.handler = function(event, context, callback) {
    let alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.resources = languageStrings;
    alexa.dynamoDBTableName = 'Notes';
    alexa.registerHandlers(handlers);
    alexa.execute();
};