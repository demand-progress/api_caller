const axios = require('axios');
const { parseString } = require('xml2js');
let keys = ''; 
if(!process.env.fccCommentKey) {
  keys = require('./config/key.js');
}

const getStateAndCity = zip => new Promise(async (resolve, reject) => {
  axios.get('https://secure.shippingapis.com/ShippingAPI.dll?', {
    params: {
      API: 'CityStateLookup',
      xml: `<CityStateLookupRequest USERID="661DEMAN2298"><ZipCode ID="0"><Zip5>${zip}</Zip5></ZipCode></CityStateLookupRequest>`,
    },
  })
    .then((response) => {
      const xml = response.data;

      parseString(xml, (err, result) => {
        const { State, City } = result.CityStateLookupResponse.ZipCode[0];
        resolve({
          state: State[0],
          city: City[0],
        });
      });
    })
    .catch((error) => {
      console.log('error from line 27 fccComment.js ', error, 'zipcode: ', zip)
      reject(error);
    });
});

const postFccComment = reqBody => new Promise(
  async (resolve, reject) => {
    const {
      first_name,
      last_name,
      email,
      address1,
      zip,
      fcc_comment,
    } = reqBody;

    const cityStateObj = await getStateAndCity(zip);
    const { state, city } = cityStateObj;
    const key = process.env.fccCommentKey ? process.env.fccCommentKey : keys.fccKey;

    axios({
      method: 'post',
      url: `https://publicapi.fcc.gov/ecfs/filings?api_key=${key}`,
      data: {
        proceedings: [
          {
            bureau_code: 'WTB',
            bureau_name: 'Wireless Telecommunications Bureau',
            name: '18-197',
          },
        ],
        filers: [
          {
            name: `${first_name} ${last_name}`,
          },
        ],
        contact_email: email,
        addressentity: {
          address_line_1: address1,
          city,
          state,
          zip_code: zip,
        },
        text_data: fcc_comment,
        express_comment: 1,
      },
    })
      .then((response) => {
        resolve(response.data.status);
      })
      .catch((error) => {
        console.log('error from line 78 fccComment.js ', error)
        reject(error);
      });
  },
);

module.exports = postFccComment;
