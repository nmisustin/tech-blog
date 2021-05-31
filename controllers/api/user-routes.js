const router = require('express').Router();
const {User, Post} = require('../../models');
const withAuth = require('../../utils/auth');

router.get('/', (req, res) => {
    User.findAll({
        attributes: {exclude: ['passwprd']}
    })
        .then(userData => res.json(userData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});
router.get('/:id', (req, res) => {
    User.findOne({
        attributes: {exclude: ['password']},
        where: {
            id: req.params.id 
        },
        include: [
            {
                model: Post,
                attributes: ['id', 'title', 'post_content', 'created_at']
            },
            {
                model: Comment,
                 attributes: ['id', 'comment_text', 'creates_at'],
                 include: {
                     model: Post,
                     attributes: ['title']
                 }
            }
        ]
    })
        .then(userData => {
            if(!userData){
                res.status(404).json({message: 'No user found with this id'})
            }
            res.json(userData)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});
router.post('/', (req, res) => {
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
        .then(userData => {
            req.session.save(() => {
                req.session.user_id = userData.id;
                req.session.username = userData.username;
                req.session.loggedIn = true;

                res.json(userData);
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});
router.post('/login', (req, res) => {
    User.findOne({
        where: {
            username: req.body.username
        }
    })
        .then(userData => {
            if(!userData){
                res.status(404).json({message: 'no user found with this email'});
                return;
            }
            const validPassword = userData.checkPassword(req.body.password);
            if(!validPassword){
                res.status(400).json({message: 'Incorrect password'});
                return;
            }
            req.session.save(() => {
                req.session.user_id = userData.id;
                req.session.username = userData.username;
                req.session.loggedIn = true;
                res.json({user: userData, message: 'you are now logged in!'})
            });
        });
});
router.post('/logout', (req, res) => {
    if(req.session.loggedIn){
        req.session.destroy(()=> {
            req.status(204).end();
        })
    }
    else{
        res.status(404).end();
    }
})

module.exports = router;