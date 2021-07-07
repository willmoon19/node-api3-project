const express = require('express');
const Users = require('../users/users-model');
const Posts = require('../posts/posts-model');
const { 
  validateUserId,
  validateUser,
  validatePost
} = require('../middleware/middleware');

// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required

const router = express.Router();

router.get('/', (req, res, next) => {
  Users.get()
  .then(users => {
    res.status(200).json(users)
  })
  .catch(next)
});

router.get('/:id', validateUserId, (req, res) => {
  res.status(200).json(req.user)
});

router.post('/', validateUser, (req, res, next) => {
  Users.insert({ name: req.name })
  .then(user => {
    res.status(201).json(user)
  })
  .catch(next)
});

router.put('/:id', validateUserId, validateUser, (req, res, next) => {
  Users.update(req.params.id, { name: req.name })
  .then(row => { //eslint-disable-line
    return Users.getById(req.params.id)
  })
  .then(updated => {
    res.status(200).json(updated)
  })
  .catch(next)
});

router.delete('/:id', validateUserId, (req, res, next) => {
  Users.remove(req.params.id)
  .then(thing => { //eslint-disable-line
    res.status(200).json(`${req.user.name} has been deleted`)
  })
  .catch(next)
});

router.get('/:id/posts', validateUserId, async (req, res, next) => {
  try {
    const posts = await Users.getUserPosts(req.params.id)
    res.status(200).json(posts)
  } catch(err) {
    next(err)
  }
});

router.post('/:id/posts', validateUserId, validatePost, async (req, res, next) => {
  try {
    const newPost = Posts.insert({
      user_id: req.params.id,
      text: req.text
    })
    res.status(201).json(newPost)
  } catch(err) {
    next(err)
  }
});

router.use((err, req, res, next) => { //eslint-disable-line
  res.status(err.status || 500).json({
    message: "check go bouncy bounce",
    error: err.message
  })
})

// do not forget to export the router
module.export = router