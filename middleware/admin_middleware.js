const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {//checks if the usre is admin or not
    return res.status(403).json({ error: 'Access denied: Admins only' });
  }
  next();
};

module.exports = adminOnly;