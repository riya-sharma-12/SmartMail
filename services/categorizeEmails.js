function categorizeEmail(email) {
  const content = email.subject + ' ' + email.body;

  if (content.includes('urgent') || content.includes('immediately')|| content.includes('Application') || content.includes('Security alert')) {
    return 'top-priority';
  } else if (content.includes('offer') || content.includes('discount')) {
    return 'spam';
  } else if (content.includes('hello') || content.includes('inquiry')) {
    return 'new';
  } else {
    return 'less-priority';
  }
}

module.exports = { categorizeEmail };