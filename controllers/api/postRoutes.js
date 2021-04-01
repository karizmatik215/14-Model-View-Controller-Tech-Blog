const router = require('express').Router();
const { Post, User, Comment } = require('../../models');
const sequelize = require('../../config/connection');
const withAuth = require('../../utils/auth');

router.get('/', async (req, res) => {
  try {
    const postData = await Post.findAll({
      attributes: ['id', 'title', 'content', 'date_created'],
      order: [['date_created', 'DESC']],
      include: [
        {
          model: User,
          attributes: ['username'],
        },
        {
          model: Comment,
          attributes: [
            'id',
            'comment_text',
            'post_id',
            'user_id',
            'date_created',
          ],
          include: {
            model: User,
            attributes: ['username'],
          },
        },
      ],
    });
    res.json(postData.reverse());
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get('/:id', async (req, res) => {
  try {
    Post.findOne(req.params.id, {
      attributes: ['id', 'content', 'title', 'date_created'],
      include: [
        {
          model: User,
          attributes: ['username'],
        },
        {
          model: Comment,
          attributes: [
            'id',
            'comment_text',
            'post_id',
            'user_id',
            'date_created',
          ],
          include: {
            model: User,
            attributes: ['username'],
          },
        },
      ],
    });
    if (!postData) {
      res.status(404).json({ message: 'No post found with this id' });
      return;
    }
    res.json(postData);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post('/', withAuth, async (req, res) => {
  try {
    Post.create({
      title: req.body.title,
      content: req.body.content,
      user_id: req.session.user_id,
    });
    res.json(postData);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.put('/:id', withAuth, async (req, res) => {
  try {
    Post.update(req.params.id, {
      title: req.body.title,
      content: req.body.content,
    });
    if (!postData) {
      res.status(404).json({ message: 'No post found with this id' });
      return;
    }
    res.json(postData);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete('/:id', withAuth, async (req, res) => {
  try {
    Post.destroy(req.params.id);
    if (!postData) {
      res.status(404).json({ message: 'No post found with this id' });
      return;
    }
    res.json(postData);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
