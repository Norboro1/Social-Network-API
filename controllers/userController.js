const { User, Thought } = require('../models');

module.exports = {

    getUsers(req, res) {
        User.find({})
            .then(dbUserData => res.json(dbUserData))
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            }
            );
    },

    getUserById({ params }, res) {
        User.findOne({ _id: params.id })
            .populate('thoughts')
            .populate('friends')
            .then(dbUserData => {
                if (!dbUserData) {
                    res.sendStatus(404);
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            }
            );
    },

    addUser({ body }, res) {
        User.create(body)
            .then(dbUserData => res.json({msg: 'User created!',data: dbUserData}))
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            });
    },

    updateUser({ params, body }, res) {
        User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.sendStatus(404);
                    return;
                }
                res.json({msg: 'User successfully Updated!', data: dbUserData});
            })
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            });
    },

    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.sendStatus(404);
                    return;
                }

                Thought.deleteMany({ username: dbUserData.username })
                    .then(() => {
                        res.json({msg: 'User successfully Deleted!', data: dbUserData});
                    })
                    .catch(err => {
                        console.log(err);
                        res.sendStatus(400);
                    });
            })
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            });
    },

    addFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.id },
            { $addToSet: { friends: params.friendId } },
            { new: true }
        )
            .then(dbUserData => {
                if (!dbUserData) {
                    res.sendStatus(404);
                    return;
                }
                res.json({msg: 'Friend successfully Added!', data: dbUserData});
            })
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            });
    },

    deleteFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.id },
            { $pull: { friends: params.friendId } },
            { new: true } )
            .then(dbUserData => res.json({msg: 'Friend successfully Deleted!', data: dbUserData}))
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            });
        }


}