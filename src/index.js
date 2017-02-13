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
const APP_ID = "amzn1.ask.skill.6ee8b76f-4a2f-4d46-8d64-221936011019";

const Alexa = require('alexa-sdk');

var languageStrings = {
    "en-US": {
        "translation": {
            "CARD_TITLE": "NoteTaker: %s",
            "WELCOME_MESSAGE": "Welcome to the Note Taker. I can take notes for you and read them out. If you want me to take a new note, say 'take a note' and tell me your note.",
            "WELCOME_REPROMPT": "Hi, if you want me to take a note, say 'take a note' and tell me your note. If you want me to read all your notes, say 'read all my notes'. If you want me to delete your notes, say 'delete all my notes'. If you know the index number of a particular note, you can ask me to read it by saying 'read note number x', or delete it by saying 'delete note number x'. If you don't want to continue, say 'stop' to end our session. Now what would you like me to do?",
            "HELP_MESSAGE": "To take a note, say 'take a note' and followed by your note. To hear all your notes, say 'read all my notes'. To delete all your notes, say 'delete all my notes'. If you know the index number of a particular note, you can ask me to read it by saying 'read note number x', or delete it by saying 'delete note number x'. If you don't want to continue, say 'stop' to end our session. Now what would you like me to do?",
            "STOP_MESSAGE": "Good bye!",
            "FINISH_MESSAGE": "Ok, I have taken a new note. Your note number %s is %s.",
            "READ_ALL_NOTES_MESSAGE": "You have the following notes: %s",
            "READ_NOTE_MESSAGE": "Your note number %s is %s",
            "DELETE_ALL_NOTES_MESSAGE": "All of your notes are deleted.",
            "DELETE_NOTE_MESSAGE": "Note number %s %s is deleted.",
            "ERR_MESSAGE": "Sorry, I didn't get that. To ask me to take down a note for you, say 'take a note' and followed by your note. To hear all your notes, say 'read all my notes'. To delete all your notes, say 'delete all my notes'. If you know the index number of a particular note, you can ask me to read it by saying 'read note number x', or delete it by saying 'delete note number x'. If you don't want to continue, say 'stop' to end our session. Now what would you like me to do?"
        }
    }
};

var handlers = {
    'LaunchRequest': function() {
        if (Object.keys(this.attributes).length === 0) {
            // Check if it's the first time the skill has been invoked
            this.attributes['notes'] = []
        }
        this.emit(':askWithCard', this.t("WELCOME_MESSAGE"), this.t("WELCOME_REPROMPT"), this.t("CARD_TITLE", "Hello"), this.t("WELCOME_REPROMPT"))
    },
    'NoteTakingIntent': function() {
        let note = this.event.request.intent.slots.note.value
        if (note) {
            this.attributes['notes'].push(note)
            let indexValue = this.attributes['notes'].length.toString()

            this.emit(':tellWithCard', this.t("FINISH_MESSAGE", indexValue, note), this.t("CARD_TITLE", "NewNote " + indexValue), note)
        } else {
            this.emit('Unhandled')
        }
    },
    'ReadAllNotesIntent': function() {
        let notesString = this.attributes['notes'].reduce((total, curr, index) => total + (index + 1).toString + ". " + curr + '\n', '')
        this.emit(':tellWithCard', this.t("READ_ALL_NOTES_MESSAGE", notesString), this.t("CARD_TITLE", "MyNotes"), notesString)
    },
    'ReadNoteIntent': function() {
        let indexValue = this.event.request.intent.slots.readIndex.value
        if (!isNaN(indexValue)) {
            let index = parseInt(indexValue) - 1
            let note = this.attributes['notes'][index]

            this.emit(':tellWithCard', this.t("READ_NOTE_MESSAGE", indexValue, note), this.t("CARD_TITLE", "Note " + indexValue), note)
        } else {
            this.emit('Unhandled')
        }
    },
    'DeleteAllNotesIntent': function() {
        this.attributes['notes'] = []
        this.emit(':tellWithCard', this.t("DELETE_ALL_NOTES_MESSAGE"), this.t("CARD_TITLE", "AllNotesDeleted"), this.t("DELETE_ALL_NOTES_MESSAGE"))
    },
    'DeleteNoteIntent': function() {
        let indexValue = this.event.request.intent.slots.deleteIndex.value
        if (!isNaN(indexValue)) {
            let index = parseInt(indexValue) - 1
            let note = this.attributes['notes'].splice(index, 1)

            this.emit(':tellWithCard', this.t("DELETE_NOTE_MESSAGE", indexValue, note), this.t("CARD_TITLE", "NoteDeleted"), this.t("DELETE_NOTE_MESSAGE", indexValue, note))
        } else {
            this.emit('Unhandled')
        }
    },
    'AMAZON.HelpIntent': function() {
        this.emit(':askWithCard', this.t("HELP_MESSAGE"), this.t("HELP_MESSAGE"), this.t("CARD_TITLE", "Help"), this.t("HELP_MESSAGE"));
    },
    'AMAZON.StopIntent': function() {
        this.emit(':StopSession');
    },
    'AMAZON.CancelIntent': function() {
        this.emit(':StopSession');
    },
    'StopSession': function() {
        this.emit(':tellWithCard', this.t("STOP_MESSAGE"), this.t("CARD_TITLE", "Exit"), this.t("STOP_MESSAGE"))
    },
    'SessionEndedRequest': function() {
        console.log('session ended!');
        this.emit(':saveState', true);
        // Be sure to call :saveState to persist your session attributes in DynamoDB
    },
    'Unhandled': function() {
        this.emit(':askWithCard', this.t("ERR_MESSAGE"), this.t("ERR_MESSAGE"), this.t("CARD_TITLE", "Error"), this.t("ERR_MESSAGE"))
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