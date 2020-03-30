import User from '../models/User';
import Notification from '../schemas/Notification';

class NotificationController {
  async index(req, res) {
    /**
     * Check if provider_id is a provider
     */
    const isProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });

    if (!isProvider) {
      return res
        .status(400)
        .json({ error: 'You can only create appointments with providers' });
    }

    const notifications = await Notification.find({ user: req.userId })
      .sort({ createAt: 'desc' })
      .limit(20);

    return res.json(notifications);
  }

  async update(req, res) {
    // new:true retorna o novo registro atualizado

    const notifications = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    return res.json(notifications);
  }
}

export default new NotificationController();
