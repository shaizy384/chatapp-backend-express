const LINK = (backHost, _id, userToken) => `${backHost}/api/user/verify/${_id}/${userToken}`
const SUBJECT = `Verify Your GalBaat Email Address`
const MESSAGE = (link) => `<p>Thanks for signing up with GalBaat! Click on the link below to verify your email:</p>
    
<a href="${link}">Click here</a>

<p>This link will expire in 24 hours. If you did not sign up for a Render account,
you can safely ignore this email. Have fun, and don't hesitate to contact us with your feedback.</p>

<p>Best,<br>The ChatApp Team</p>`