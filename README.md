# twilio-opty
Demonstrating how to use Optimizely to test Twilio SMS content.

## Requirements:
- Access to Optimizely Full Stack, sign up for a [free dev account](https://www.optimizely.com/rollouts/)
- Access to Twilio functions and a phone number

## Getting Started:
1. Create a new function in Twilio, copy & paste the contents of the `function.js` file into the the `code` section of your function.
2. Check the box above the `code` container to `Check for valid Twilio signature`. This will ensure that your Twilio Accound SID and auth token are added safely to be used by your function.
2. Under the `Configure` tab of your Twilio function, check the box for `Enable ACCOUNT_SID and AUTH_TOKEN`.
2. In this same section, add the following dependencies:
`Name: @optimizely/optimizely-sdk; Version: 4.1.0` Check [here](https://www.npmjs.com/package/@optimizely/optimizely-sdk) for the latest Optimizely SDK version for Nodejs
`Name: request-promise; Version: 4.2.5`
2. Create an Optimizely Full Stack Project, retrieve your datafile URL and replace the datafile URL in the `function.js` file.
3. Create an experiment in Optimizely and replace the experiment key and variation keys with what you've assigned in the Optimizely app.
4. Finally associate your Optimizely-Twilio function with a phone number in the Twilio app and test it out!

## Note
Optimizely does not accept PII which includes phone numbers, use the built in module `crypto` to hash phone numbers before we send them as the `user id`, or unique identifier, in the Optimizely `activate` method. When `activate` is invoked the Optimizely SDK automatically dispatches an even to Optimizely to record that this user was activated in an experiment with the `experiment_key` defined and `variation_key` they were bucketed into.
