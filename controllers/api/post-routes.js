const router = require('express').Router();
const { Post, User } = require('../../models');
const withAuth = require('../../utils/auth');

//get all posts
router.get('/', withAuth, async (req, res) => {
  Post.findAll({
    attributes: ['id', 'title', 'content', 'user_id'],
    include: [
      {
        model: Comment,
        as: 'comments',
        attributes: ['id', 'content', 'user_id'],
      },
    ],
  })
    .then((postData) => {
      res.json(postData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

//create a new post
router.post('/', withAuth, async (req, res) => {
  try {
    const postData = await Post.create({
      title: req.body.title,
      content: req.body.content,
      user_id: req.session.user_id,
    });
    res.status(200).json(postData);
  } catch (error) {
    res.status(400).json(error);
  }
});

//update a post
router.put('/:id', withAuth, async (req, res) => {
  try {
    const postData = await Post.update(
      {
        title: req.body.title,
        content: req.body.content,
      },
      { where: { id: req.params.id } }
    );

    if (!postData) {
      res.status(404).json({ message: 'No post found with this id' });
      return;
    }
    res.status(200).json(postData);
  } catch (error) {
    res.status(500).json(error);
  }
});

//delete a post
router.delete('/:id', withAuth, async (req, res) => {
  try {
    const postData = await Post.destroy({ where: { id: req.params.id } });
    if (!postData) {
      res.status(404).json({ message: 'No post found with this id' });
      return;
    }
    res.status(200).json(postData);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
