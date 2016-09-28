var validationMessages = {
  error: {
    empty: 'Please enter a value for {PATH}',
    emptyBody: 'Nothing to update',
    format: 'Please use the correct format for {PATH}',
    duplicate: 'This {PATH} is already in use',
    notFound: 'No {PATH} was found',
    mismatchCred: 'Authentication failure: username and password combination incorrect',
    noAuth: 'Authentication failure',
    noPerm: 'Authentication failure: Account lacks the required permissions ({PATH})'
  },
  warn: {
    createdNoAchi: 'WARNING: No achievements were saved when creating this user'
  },
  success: {
    created: 'Creation of {PATH} was successful',
    updated: 'Successfully updated {PATH}',
    deleted: '{PATH} successfully deleted'
  }
};

module.exports = validationMessages;
