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

router.route('/:slug').get((req, res) => {
  Poll.findOne({ slug: req.params.slug })
    .then(poll => {
      if (poll === null) {
        res.status(400).json({ error: `Unable to find poll with id ${req.params.slug}` });
      } else {
        res.json(poll);
      }
    })
    .catch(() => res.status(400).json({ error: 'Failed to get poll' }));
});

router.route('/:slug').put((req, res) => {
  Poll.findOne({ slug: req.params.slug })
    .then(poll => {
      if (poll === null) {
        res.status(400).json({ error: `Unable to find poll with id ${req.params.slug}` });
      } else if (poll.isPublished) {
        res.status(400).json({ error: 'The poll is published and cannot be updated' });
      } else {
        poll.title = req.body.title,
        poll.questions = parseQuestions(req.body.questions)
  
        poll.save({ validateBeforeSave: true })
          .then(poll => res.json(poll))
          .catch(() => res.status(400).json({ error: 'Failed to update poll' }));
      }
    })
    .catch(() => res.status(400).json({ error: 'Failed to update poll' }));
});

router.route('/:slug/publish').put((req, res) => {
  Poll.findOneAndUpdate(
    {
      slug: req.params.slug
    }, 
    {
      isPublished: true
    },
    {
      new: true,
      runValidators: true
    }
  )
    .then(poll => {
      if (poll === null) {
        res.status(400).json({ error: `Unable to find poll with id ${req.params.slug}` });
      } else {
        res.json(poll);
      }
    })
    .catch(() => res.status(400).json({ error: 'Failed to publish poll' }));
});

module.exports = router;