const keys = require("../keys");

module.exports = function (email) {
  return {
    to: email,
    from: keys.EMAIL_FROM,
    subject: "Account created",
    html: `
        <h1>Welcome to our store</h1>
        <p>You succesfully created account with email ${email}</p>
        <hr/>
        <a href="${keys.BASE_URL}">To Site</a>
        `,
  };
};
