const router = require('express').Router();
const { Post } = require('../../models');
const withAuth = require('../../utils/auth');

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
router.put('/edit/:id', withAuth, async (req, res) => {
  try {
    const postData = await Post.update(
      {
        title: req.body.title,
        content: req.body.content,
      },
      { where: { id: req.params.id } }
    );
    res.status(200).json(postData);
  } catch (error) {
    res.status(500).json(error);
  }
});

//delete a post
router.delete('/edit/:id', withAuth, async (req, res) => {
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
