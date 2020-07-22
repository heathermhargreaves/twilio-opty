exports.handler = function(context, event, callback) {
  // import libraries
  var crypto = require('crypto');
  var md5sum = crypto.createHash('md5');
  var optimizelySDK = require('@optimizely/optimizely-sdk');
  var rp = require('request-promise');

  // datafile URL
  var url = 'https://cdn.optimizely.com/datafiles/B9JfyqMb3Pm8WfdDMFGsD.json';
  var options = {uri: url, json: true};
  var optimizely;

  // get the datafile
  rp(options).then(function(datafile) {

    // initialize Optimizely SDK
    optimizely = optimizelySDK.createInstance({datafile: datafile});

    // Create Twilio response message
    let twiml = new Twilio.twiml.MessagingResponse();

    // get incoming message text
    var incomingMessage = event.Body;

    // get incoming message number
    var userId = md5sum.update(event.From).digest('hex');

    // assume that if a user is saying 'hello' they are just starting
    if (incomingMessage.toLowerCase() === 'hello') {
      // activate the Optimizely Experiment
      var variationKey = optimizely.activate('twilio_test', userId);
      console.log('variation', variationKey)
      // split logic based on which variation the user is in
      if (variationKey === 'variation_1') {
        // execute code for A
        twiml.message("Hi there what kind of workout should we send you today? Reply (1) for Yoga, (2) for Cycling, or (3) for Strength. Text 'Stop' if you would like to opt out");
      } else if (variationKey === 'variation_2') {
        // execute code for B
        twiml.message("Who's looking to get fit today?? Let us send you a personalized class next time you log into Variis! Reply (1) for Yoga🧘‍♂️️, (2) for Cycling🚲, or (3) for Strength💪");
      } else {
        // execute default code as fallback
        twiml.message('Reply 1, 2, or 3 for a special workout!')
      }
    }
    // otherwise track user responses
    else if (incomingMessage.toLowerCase() === '1') {
      optimizely.track('yoga_opt_in', userId);
      twiml.message('Great, we will send you some super zen yoga classes when you login to Variis today');
    }
    else if (incomingMessage.toLowerCase() === '2') {
      optimizely.track('cycling_opt_in', userId);
      twiml.message('Get ready to set a new PR in your spin class when you login to Variis today!');
    }
    else if (incomingMessage.toLowerCase() === '3') {
      optimizely.track('strength_opt_in', userId);
      twiml.message('Find your inner warrior in your stength class today when you login to Variis');
    }
    // if the user sent a message we cannot respond to, send them the Opticon 2017 recap
    else {
      twiml.message('Please reply with 1 (Yoga), 2 (Cycling), or 3 (Strength) to choose a workout class');
    }
    // send the message response
    callback(null, twiml);
  });
};
