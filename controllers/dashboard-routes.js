const router = require('express').Router();
const sequelize = require('../config/connection');
const {Post, User, Comment}= require('../models');
const withAuth = require('../utils/auth');

router.get('/', withAuth, (req, res) => {
    Post.findAll({
        where: {
            user_id: req.session.user_id
        },
        attributes: [
            'id',
            'post_content',
            'title',
            'created_at'
        ],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include:{
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
        .then(data => {
            const posts = data.map(post => post.get({ plain: true }));
            res.render('dashboard', {posts });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
})

module.exports = router