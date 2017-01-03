// Your Client ID can be retrieved from your project in the Google
    // Developer Console, https://console.developers.google.com
    var CLIENT_ID = '771319609939-0lk2qq8qi7ebf0k8enfs82iop7ukqk5q.apps.googleusercontent.com';

    var SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];

    /**
     * Check if current user has authorized this application.
     */
    function checkAuth() {
      gapi.auth.authorize(
          {
            'client_id': CLIENT_ID,
            'scope': SCOPES.join(' '),
            'immediate': true
          }, handleAuthResult);
    }

    /**
     * Handle response from authorization server.
     *
     * @param {Object} authResult Authorization result.
     */
    function handleAuthResult(authResult) {
      var authorizeDiv = document.getElementById('authorize-div');
      if (authResult && !authResult.error) {
        // Hide auth UI, then load client library.
        authorizeDiv.style.display = 'none';
        loadSheetsApi();
      } else {
        // Show auth UI, allowing the user to initiate authorization by
        // clicking authorize button.
        authorizeDiv.style.display = 'inline';
      }
    }

    /**
     * Initiate auth flow in response to user clicking authorize button.
     *
     * @param {Event} event Button click event.
     */
    function handleAuthClick(event) {
      gapi.auth.authorize(
          {client_id: CLIENT_ID, scope: SCOPES, immediate: false},
          handleAuthResult);
      return false;
    }

    /**
     * Load Sheets API client library.
     */
    function loadSheetsApi() {
      var discoveryUrl =
          'https://sheets.googleapis.com/$discovery/rest?version=v4';
      gapi.client.load(discoveryUrl).then(listMajors);
    }

    /**
     * Print the names and majors of students in a sample spreadsheet:
     * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
     * https://docs.google.com/spreadsheets/d/1judnGxTSxOD6l6ImvjWo6r1qxACO0YPEyfe8R7wDXms/edit#gid=1899385777
     */
    function listMajors() {
      gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: '1judnGxTSxOD6l6ImvjWo6r1qxACO0YPEyfe8R7wDXms',
        range: 'Neptune!A2:E',
      }).then(function(response) {
        var range = response.result;
        if (range.values.length > 0) {
          appendPre('Name, Major:');
          for (i = 0; i < range.values.length; i++) {
            var row = range.values[i];
            // Print columns A and E, which correspond to indices 0 and 4.
            appendPre(row[0] + ', ' + row[4]);
          }
        } else {
          appendPre('No data found.');
        }
      }, function(response) {
        appendPre('Error: ' + response.result.error.message);
      });
    }

    /**
     * Append a pre element to the body containing the given message
     * as its text node.
     *
     * @param {string} message Text to be placed in pre element.
     */
    function appendPre(message) {
      var pre = document.getElementById('output');
      var textContent = document.createTextNode(message + '\n');
      pre.appendChild(textContent);
    }
