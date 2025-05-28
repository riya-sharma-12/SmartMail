const fs = require('fs').promises;

async function readExistingTokenNumbers(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return {}; // Return an empty object if the file does not exist
  }
}

async function writetokenNumbersToFile(filePath, tokenNumbers) {
  await fs.writeFile(filePath, JSON.stringify(tokenNumbers, null, 2));
}

async function generateUniqueTokenNumber(existingtokenNumbers) {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 because months are zero-based
  const day = currentDate.getDate().toString().padStart(2, '0');

  const yearMonthKey = `${year}${month}${day}`;
  if (!existingtokenNumbers[yearMonthKey]) {
    existingtokenNumbers[yearMonthKey] = 1; // Initialize the counter to 1 for the current date
  } else {
    existingtokenNumbers[yearMonthKey]++; // Increment the counter for the current date
  }

  await writetokenNumbersToFile(`${__dirname}/assets/generated_token_numbers.json`, existingtokenNumbers); // Write the updated receipt numbers to the file

  const counter = existingtokenNumbers[yearMonthKey].toString().padStart(6, '0'); // Convert counter to a 4-digit string
  const tokenNumber = `${year}${month}${day}${counter}`;
  return tokenNumber;
}

async function getTokenNumber() {
  const existingtokenNumbers = await readExistingTokenNumbers(`${__dirname}/assets/generated_token_numbers.json`);
  const uniquetokenNumber = await generateUniqueTokenNumber(existingtokenNumbers);
  return uniquetokenNumber;
}
module.exports = {
  getTokenNumber
};
