import serialize from './serialize';
import { API_ENDPOINT, endpoints } from '../resources/apiConfig';
const {
  SESSION,
  STATION,
} = endpoints;

class ApiEndpoint {
  constructor(endpoint, state) {
    this.endpoint = endpoint || 'SETME';
    this.url = `${API_ENDPOINT}${this.endpoint}`;
    this.params = {
      headers: {
       'Accept': 'application/json',
       'Content-Type': 'application/json',
      },
    }

    // set the token
    if(state.session.token != ''){
      this.params.headers.Authorization = state.session.token;
    }
  }

  _api(params) {
    return fetch(this.url, params)
      .then(res => res.json())
      .then(res => {
        console.log('Logging from within fetcher: ', res);
        return res;
      })
  }

  _get(params) {
    params.method = 'GET';
    return this._api(params);
  }

  _post(params) {
    params.method = 'POST';
    return this._api(params);
  }

  // find all
  find(query) {
    this.url = `${this.url}?${serialize(query)}`
    console.log(this.url, this.params);
    return this._get(Object.assign({}, this.params));
  }

  // find one
  findOne(query) {
    return this._get(Object.assign({}, this.params, {
      body: JSON.stringify(query)
    }));
  }

  // create a new resource
  create(data) {
    return this._post(Object.assign({}, this.params, {
      body: JSON.stringify(data)
    }));
  }

  // destroy a resource
  destroy(query) {

  }
}

// setup the session endpoint
class Session extends ApiEndpoint {
  constructor(state) {
    super(SESSION, state)
  }
}

// setup the station endpoint
class Station extends ApiEndpoint {
  constructor(state) {
    super(STATION, state)
  }
}
// TODO: es6 version of this?
// Fetcher.prototype.station = new Station();

class Fetcher {
  constructor(state) {
    this.session = new Session(state);
    this.station = new Station(state);
  }
}

export default Fetcher
