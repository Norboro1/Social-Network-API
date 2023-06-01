const { Thought, User } = require('../models');

module.exports = { 
    getThoughts(req, res) {
        Thought.find({})
            .then(dbThoughtData => res.json(dbThoughtData))
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            }
            );
    },

    getSingleThought({ params }, res) {
        Thought.findOne({ _id: params.id })
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.sendStatus(404);
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            }
            );
    },

    addThought({ params, body }, res) {
        Thought.create(body)
            .then(({ _id }) => {
                User.findOneAndUpdate(
                    { _id: params.userId },
                    { $push: { thoughts: _id } },
                    { new: true }
                )
                    .then(dbUserData => {
                        if (!dbUserData) {
                            res.sendStatus(404);
                            return;
                        }
                        res.json(dbUserData);
                    })
                    .catch(err => res.json(err));
            })
            .catch(err => res.json(err));
    },

    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.sendStatus(404);
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => res.json(err));
    },

    deleteThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.id })
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.sendStatus(404);
                    return;
                }
                return User.findOneAndUpdate(
                    { username: dbThoughtData.username },
                    { $pull: { thoughts: params.id } },
                    { new: true }
                );
            })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.sendStatus(404);
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.json(err));
    },

    addReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.id },
            { $push: { reactions: body } },
            { new: true, runValidators: true }
        )
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.sendStatus(404);
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => res.json(err));
    },

    deleteReaction({ params }, res) {
        Thought.findOneAndUpdate(
            { _id: params.id },
            { $pull: { reactions: { reactionId: params.reactionId } } },
            { new: true, runValidators: true }
            )
            .then(dbThoughtData => res.json(dbThoughtData))
            .catch(err => res.json(err));
        }
}