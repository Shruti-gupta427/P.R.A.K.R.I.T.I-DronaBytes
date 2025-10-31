var express = require('express');
var router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');


router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id', auth, async (req, res) => {
  try {
   
    if (req.userId !== req.params.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    const allowedUpdates = ['firstName', 'lastName', 'avatar', 'bio', 'location'];

    const updates = {};
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[`profile.${field}`] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// leaderboard was according to experience

// router.get('/leaderboard/top', async (req, res) => {
//   try {
//     const topUsers = await User.find()
//       .sort({ 'profile.experience': -1 })
//       .limit(10)
//       .select('username profile');
//     res.json(topUsers);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });
router.get('/leaderboard/combined', async (req, res) => {
  try {
    const users = await User.find().select(
      'username profile.level profile.experience profile.streak.current profile.stats.tasksCompleted profile.avatar'
    );

    // Calculate combined score for each user
    const weighted = users.map(user => {
      const experience = user.profile.experience || 0;
      const streak = user.profile.streak?.current || 0;
      const tasks = user.profile.stats?.tasksCompleted || 0;

      // Weighted formula
      const score = (experience * 0.5) + (streak * 0.3) + (tasks * 0.2);

      return {
        username: user.username,
        level: user.profile.level,
        experience,
        streak,
        tasksCompleted: tasks,
        avatar: user.profile.avatar || null,
        score: parseFloat(score.toFixed(2))
      };
    });
    const sorted = weighted.sort((a, b) => b.score - a.score);
    // Take top 10 users
    res.json(sorted.slice(0, 10));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get('/dashboard/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      'username profile.level profile.experience profile.streak profile.stats avatar'
    );

    if (!user) return res.status(404).json({ error: 'User not found' });

    
    const allUsers = await User.find().select(
      'profile.experience profile.streak.current profile.stats.tasksCompleted'
    );

    const leaderboard = allUsers.map(u => {
      const exp = u.profile.experience || 0;
      const streak = u.profile.streak?.current || 0;
      const tasks = u.profile.stats?.tasksCompleted || 0;
      const score = (exp * 0.5) + (streak * 0.3) + (tasks * 0.2);
      return { id: u._id.toString(), score };
    });

    leaderboard.sort((a, b) => b.score - a.score);
    const rank = leaderboard.findIndex(l => l.id === user._id.toString()) + 1;

    res.json({
      username: user.username,
      avatar: user.profile.avatar || null,
      level: user.profile.level,
      experience: user.profile.experience,
      streak: user.profile.streak,
      stats: user.profile.stats,
      rank
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



module.exports = router;
