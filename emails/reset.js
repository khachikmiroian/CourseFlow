const keys = require("../keys");

module.exports = function (email, token) {
  return {
    to: email,
    from: keys.EMAIL_FROM,
    subject: "Password reset",
    html: `
      <h1>You forgot password?</h1>
      <p>If not, ignore this mail</p>
      <p>Otherwise click to link below:</p>
      <p><a href="${keys.BASE_URL}/auth/password/${token}">Reset</a></p>
      <hr/>
    `,
  };
};
