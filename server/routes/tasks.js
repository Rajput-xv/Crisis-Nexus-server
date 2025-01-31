const router = require('express').Router();
const Task = require('../models/Task');
const User = require('../models/User');

router.post('/', async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/match/:taskId', async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    const matchedVolunteers = await User.find({
      role: 'volunteer',
      skills: { $in: task.requiredSkills },
      'location.coordinates': {
        $near: {
          $geometry: task.location,
          $maxDistance: 10000 // 10km
        }
      }
    }).limit(5);
    res.json(matchedVolunteers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;