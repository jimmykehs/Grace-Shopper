function requireAdmin(req, res, next) {
  if (!req.user.admin) {
    next({
      name: "Unauthorized",
      message: "You do not have access to this",
    });
  } else {
    next();
  }
}

module.exports = { requireAdmin };
