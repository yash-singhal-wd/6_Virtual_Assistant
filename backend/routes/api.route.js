const router = require('express').Router();
const {google} = require('googleapis')

const gclientId = "954234567281-iudn12ogcts37vv45kbvspsp939t2ckq.apps.googleusercontent.com"
const gclientSecret = "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"

const storeUsers = {}

let refreshToken = "1//0grF58QdBZ8bgCgYIARAAGBASNwF-L9IrX5Go2qIajo2EbcFjVCuAWZdMI6FpeTdzrWRFYATyI5nMP3jEtuHPrPXpROWbTrBbQto";

const oauth2Client = new google.auth.OAuth2(
  gclientId, gclientSecret,
  'http://localhost:3000'
)

router.get('/', async (req, res, next) => {
  res.send({ message: 'Ok api is working 🚀' });
});

router.post('/create-tokens', async (req, res, next) => {
  try{
    const {code} = req.body
    const {tokens} = await oauth2Client.getToken(code);
    if(tokens.refresh_token){
      refreshToken = tokens.refresh_token;
    }
    res.send(tokens)
  } catch (error) {
    next(error)
  }
})

router.post('/create-event', async (req,res,next) => {
  try{
    const {summary, description, location, startDateTime, endDateTime} = req.body;
    oauth2Client.setCredentials({refresh_token: refreshToken})
    const calendar = google.calendar('v3')
    const response = await calendar.events.insert({
      auth: oauth2Client,
      calendarId: 'primary',
      requestBody : {
        summary: summary,
        description: description,
        location: location,
        colorId: '7',
        start : {
          dateTime: new Date(startDateTime)
        },
        end : {
          dateTime: new Date(endDateTime)
        }

      }
    })
    res.send(response)
  } catch(error) {
    next(error)
  }
})

module.exports = router;
