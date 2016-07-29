var validationMessages = {
  error: {
    empty: 'Please enter a value for {PATH}',
    format: 'Please use the correct format for {PATH}',
    duplicate: 'This {PATH} is already in use',
    notFound: 'No {PATH} was found',
    mismatch: 'Authentication failure: username and password combination incorrect'
  },
  success: {
    created: 'Creation of {PATH} was successful',
    updated: 'Successfully updated {PATH}'
  }
};

module.exports = validationMessages;
