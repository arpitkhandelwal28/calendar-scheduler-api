const isOverlapping = await Event.findOne({
  user: req.user._id,
  startTime: { $lt: req.body.endTime },
  endTime: { $gt: req.body.startTime },
});

if (isOverlapping) {
  return res.status(409).json({ message: 'Event conflicts with an existing one.' });
}
