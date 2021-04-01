const router = require('express').Router();
const { Post, User, Comment } = require('../models');
const sequelize = require('../config/connection');
const withAuth = require('../utils/auth');

router.get('/', withAuth, async (req, res) => {
  try {
    const dashboardData = await Post.findAll(req.session.user_id, {
      attributes: ['id', 'title', 'content', 'date_created'],
      include: [
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
        {
          model: User,
          attributes: ['username'],
        },
      ],
    });
    const posts = dashboardData.map((post) => post.get({ plain: true }));
    res.render('dashboard', { posts, loggedIn: true });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get('/edit/id:', withAuth, async (req, res) => {
  try {
    const dashboardData = await Post.findOne(req.params.id, {
      attributes: ['id', 'title', 'content', 'date_created'],
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
    if (!dashboardData) {
      res.status(404).json({ message: 'No post found with this id' });
      return;
    }
    const post = dashboardData.get({ plain: true });
    res.render('edit_post', { post, loggedIn: true });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get('/new', (req, res) => {
  res.render('new_post');
});

module.exports = router;
