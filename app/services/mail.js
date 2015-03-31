var mailgun = require('mailgun-js')({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN
});
var MailComposer = require("mailcomposer").MailComposer;
var mailcomposer = new MailComposer();

module.exports = {
    sendEmail: function(options) {
        mailcomposer.setMessageOption({
            from: options.from,
            to: options.to,
            subject: options.subject,
            body: options.text,
            html: options.html
        });

        mailcomposer.buildMessage(function(err, messageSource) {
            var dataToSend = {
                to: options.to,
                message: messageSource
            };

            mailgun.messages().sendMime(dataToSend, function(err, body) {
                if (err) {
                    console.log(sendError);
                    return;
                }
            });
        });
    }
};
