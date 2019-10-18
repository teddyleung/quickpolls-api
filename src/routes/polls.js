const router = require('express').Router();
let Poll = require('../models/poll.model');
const generateSlug = require('../library/generateSlug');

// TODO: create an index on :slug

const parseQuestions = questions => questions.map(question => ({
  question: question.question,
  answers: question.answers.map(answer => ({ answer }))
}));

router.route('/').post((req, res) => {  
  const newPoll = new Poll({
    title: req.body.title,
    slug: generateSlug(),
    questions: parseQuestions(req.body.questions)
  });

  newPoll.save()
    .then(poll => res.json(poll))
    .catch(() => res.status(400).json({ error: 'Failed to created poll' }));
});

module.exports = router;