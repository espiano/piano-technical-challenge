const fetch = require('node-fetch');
const { URLSearchParams } = require('url');

require('dotenv').config(); // load credentials from .env

class PianoRequest {
  constructor(endpoint, payload = {}, includeAid = true) {
    this.parameters = new URLSearchParams();

    this.parameters.append('api_token', process.env.PIANO_API_TOKEN);

    if (includeAid) {
      this.parameters.append('aid', process.env.PIANO_API_AID);
    }

    Object.keys(payload).forEach((name) => this.parameters.append(name, payload[name]));

    this.requestEndpoint = `https://${process.env.PIANO_API_DOMAIN}/api/v3${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
  }

  async getResponse() {
    if (this.response === undefined) {
      await fetch(this.requestEndpoint, {
        method: 'POST',
        body: this.parameters, // Auto sets header Content-type: application/x-www-form-urlencoded`
      }).then((res) => res.json())
        .then((json) => {
          this.response = json;
        })
        .catch(console.error.bind(console));
    }
    return this.response;
  }
}

module.exports = PianoRequest;
