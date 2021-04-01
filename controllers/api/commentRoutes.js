const router = require('express').Router();
const { Comment } = require('../../models');
const withAuth = require('../../utils/auth');

router.get('/', async (req, res) => {
  try {
    const commentData = await Comment.findAll({});
    res.json(commentData);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const commentData = await Comment.findAll(req.params.id);
    res.json(commentData);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post('/', withAuth, async (req, res) => {
  try {
    const commentData = await Comment.create({
      comment_text: req.body.comment_text,
      post_id: req.body.post_id,
      user_id: req.session.user_id,
    });
    if (req.session) {
      res.json(commentData);
    }
  } catch (error) {
    res.status(400).json(error);
  }
});

router.put('/:id', withAuth, async (req, res) => {
  try {
    const commentData = await Comment.update(req.params.id, {
      comment_text: req.body.comment_text,
    });
    if (!commentData) {
      res.status(404).json({ message: 'No comment found with this id' });
      return;
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete('/:id', withAuth, async (req, res) => {
  try {
    const commentData = await Comment.destroy(req.params.id);
    if (!commentData) {
      res.status(404).json({ message: 'No comment found with this id' });
      return;
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
