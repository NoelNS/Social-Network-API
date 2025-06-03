const User = require('../models/User');
const Thought = require('../models/Thought');

module.exports = {
  // GET all users
  async getUsers(req, res) {
    try {
      const users = await User.find().populate('thoughts').populate('friends');
      res.json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // GET a single user
  async getSingleUser(req, res) {
    try {
      const user = await User.findById(req.params.userId)
        .populate('thoughts')
        .populate('friends');
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // POST a new user
  async createUser(req, res) {
    try {
      const user = await User.create(req.body);
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // PUT to update a user
  async updateUser(req, res) {
    try {
      const user = await User.findByIdAndUpdate(req.params.userId, req.body, {
        new: true,
        runValidators: true
      });
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // DELETE user and associated thoughts
  async deleteUser(req, res) {
    try {
      const user = await User.findByIdAndDelete(req.params.userId);
      if (!user) return res.status(404).json({ message: 'User not found' });

      await Thought.deleteMany({ _id: { $in: user.thoughts } });
      res.json({ message: 'User and associated thoughts deleted!' });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // POST to add a friend
  async addFriend(req, res) {
    try {
      const user = await User.findByIdAndUpdate(
        req.params.userId,
        { $addToSet: { friends: req.params.friendId } },
        { new: true }
      );
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // DELETE to remove a friend
  async removeFriend(req, res) {
    try {
      const user = await User.findByIdAndUpdate(
        req.params.userId,
        { $pull: { friends: req.params.friendId } },
        { new: true }
      );
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  }
};
