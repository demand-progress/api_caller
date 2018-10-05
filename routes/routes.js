const postFccComment = require('../fccComment.js');

const appRouter = (app) => {
  app.get('/', (req, res) => {
    res.send('welcome!');
  });

  app.post('/fcccomment', (req, res) => {
    postFccComment(req.body)
      .then(answer => res.send(answer))
      .catch(error => console.log('error from line 11 routes.js ', error));
  });
};
module.exports = appRouter;
