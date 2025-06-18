function categorizeEmail(email) {
  const content = (email.subject + ' ' + email.body).toLowerCase();
  if (
    content.includes('urgent') ||
    content.includes('immediately') ||
    content.includes('application') ||
    content.includes('security alert') ||
    content.includes('asap') ||
    content.includes('critical') ||
    content.includes('action required') ||
    content.includes('important') ||
    content.includes('payment overdue') ||
    content.includes('response needed') ||
    content.includes('failure') ||
    content.includes('deadline')
  ) {
    return 'top-priority';
  } else if (content.includes('offer') || content.includes('discount')) {
    return 'spam';
  }  else {
    return 'less-priority';
  }
}

module.exports = { categorizeEmail };