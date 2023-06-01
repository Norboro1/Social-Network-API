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

    async updateUser({ params, body }, res) {
        try{
            let oldUsername = '';
            if(body.username){
                const userData = await User.findById(params.id);
                oldUsername = userData.username;
            }
    
            const newUserData = await User.findOneAndUpdate({ _id: params.id }, body, { runValidators: true, new: true });

            if (!newUserData) {
                res.sendStatus(404);
                return;
            }

            if(body.username){
                await Thought.updateMany({ username: oldUsername }, { username: body.username })
                console.log('Username updated in thoughts');
            }

            res.json({msg: 'User successfully Updated!', data: newUserData});

        } catch (err) {
            console.log(err);
            res.sendStatus(400);
        }




       /* User.findOneAndUpdate({ _id: params.id }, body, { runValidators: true })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.sendStatus(404);
                    return;
                }

                Thought.updateMany({ username: dbUserData.username }, { username: body.username })
                    .then(() => {
                        User.findOne({ _id: params.id })
                            .then(updatedUserData => {
                                res.json({msg: 'User successfully Updated!', data: updatedUserData});
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
            })
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            }); */
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