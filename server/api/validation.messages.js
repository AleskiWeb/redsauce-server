var validationMessages = {
  error: {
    empty: 'Please enter a value for {PATH}',
    format: 'Please use the correct format for {PATH}',
    duplicate: 'This {PATH} is already in use',
    notFound: 'No {PATH} was found',
    mismatchCred: 'Authentication failure: username and password combination incorrect',
    noAuth: 'Authentication failure',
    noPerm: 'Account lacks the required permissions'
  },
  success: {
    created: 'Creation of {PATH} was successful',
    updated: 'Successfully updated {PATH}',
    deleted: '{PATH} successfully deleted'
  }
};

module.exports = validationMessages;
