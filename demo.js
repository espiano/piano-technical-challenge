const csvParser = require('csv-parser');
const fs = require('fs');
const PianoRequest = require('./src/PianoRequest');

(async function runDemo() {
  const getCsvPromise = (filename) => new Promise((resolve) => {
    const results = [];
    fs.createReadStream(filename)
      .pipe(csvParser())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results));
  });

  await Promise.all([
    getCsvPromise('sample-files/userEmails.csv'),
    getCsvPromise('sample-files/userNames.csv'),
  ]).then(async (results) => {
    const [emailRows, nameRows] = results;
    const users = {};

    const unpackRowByUserId = (row) => {
      users[row.user_id] = {
        ...users[row.user_id],
        ...row,
      };
    };

    emailRows.forEach(unpackRowByUserId);
    nameRows.forEach(unpackRowByUserId);

    const userIdsByEmail = {};

    Object.keys(users).forEach((userId) => {
      const user = users[userId];
      if (!user.email || !user.first_name || !user.last_name) {
        throw new Error(`User data mismatch:\n${JSON.stringify(user)}`);
      }

      userIdsByEmail[user.email] = userId;
    });

    const pianoUsersRequest = new PianoRequest('/publisher/user/list', { offset: 0 });

    const pianoUserRows = await pianoUsersRequest.getResponse();

    (pianoUserRows.users).forEach((pianoUserRow) => {
      const pianoUserEmail = pianoUserRow.email;

      if (Object.prototype.hasOwnProperty.call(userIdsByEmail, pianoUserEmail)) {
        const incorrectUserId = userIdsByEmail[pianoUserEmail];
        console.log(
          `
Correcting:\n${JSON.stringify(users[incorrectUserId])}
With:\n${JSON.stringify(pianoUserRow)}
`,
        );

        users[incorrectUserId] = {
          user_id: pianoUserRow.uid,
          email: pianoUserRow.email,
        };
      }
    });

    const outputFile = fs.createWriteStream('sample-files/merged.csv');
    const headers = ['user_id', 'email', 'first_name', 'last_name'];

    outputFile.write(`${headers.join(',')}\n`);

    Object.keys(users).forEach((userId) => {
      outputFile.write(
        `${headers.map((header) => users[userId][header]).join(',')}\n`,
      );
    });

    outputFile.end();
    console.log('Merge complete!');
  });
}());
