import UserBadge from "../models/UserBadge.js";

// GET /admin/badges -> lista plana de todas las insignias (pobladas)
export const getAllBadgesAdmin = async (_req, res) => {
  try {
    const list = await UserBadge.find({})
      .populate("userId", "name lastName email")
      .populate("libroId", "nombre imagen")
      .sort({ earnedAt: -1 });
    res.json(list);
  } catch (e) {
    console.error("ADMIN getAllBadges:", e);
    res.status(500).json({ message: "Error al listar insignias" });
  }
};

// GET /admin/badges/users -> agrupar por usuario [{ user, badges: [] }]
export const getUsersWithBadgesAdmin = async (_req, res) => {
  try {
    const list = await UserBadge.find({})
      .populate("userId", "name lastName email")
      .populate("libroId", "nombre imagen")
      .sort({ earnedAt: -1 });

    const map = new Map();
    for (const b of list) {
      const uid = b.userId?._id?.toString();
      if (!uid) continue;
      if (!map.has(uid)) map.set(uid, { user: b.userId, badges: [] });
      map.get(uid).badges.push(b);
    }
    res.json(Array.from(map.values()));
  } catch (e) {
    console.error("ADMIN getUsersWithBadges:", e);
    res
      .status(500)
      .json({ message: "Error al obtener usuarios con insignias" });
  }
};

// GET /admin/badges/user/:userId -> todas las insignias de un usuario (pobladas)
export const getBadgesByUserIdAdmin = async (req, res) => {
  try {
    const { userId } = req.params;
    const list = await UserBadge.find({ userId })
      .populate("userId", "name lastName email")
      .populate("libroId", "nombre imagen")
      .sort({ earnedAt: -1 });
    res.json(list);
  } catch (e) {
    console.error("ADMIN getBadgesByUserId:", e);
    res.status(500).json({ message: "Error al obtener insignias del usuario" });
  }
};
