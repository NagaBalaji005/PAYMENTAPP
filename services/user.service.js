const User = require('../models/User');

module.exports.registerNewUser = async ({
  fullName,
  emailAddress,
  userPassword,
  userUpi,
  accountBalance,
}) => {
  // Validate the presence of required fields
  if (!fullName || !emailAddress || !userPassword || !userUpi || accountBalance === undefined) {
    throw new Error("All fields are mandatory");
  }

  // Create the new user in the database
  const newUser = await User.create({
    fullName,
    emailAddress,
    userPassword,
    userUpi,
    accountBalance,
  });

  return newUser;
};
