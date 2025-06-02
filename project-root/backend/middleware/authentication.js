const authentication = (req, res, next) => {
  console.log(req.session, req.session.user?.id);
  if (req.session && req.session.user) {
    next();
  } else {
    res.status(401).json({
      message: "Unauthorized access. Please log in.",
    });
  }
};

const adminAuthentication = (req, res, next) => {
  if (req.session && req.session.user && req.session.user.role === "admin") {
    next();
  } else {
    res.status(403).json({
      message: "Forbidden access. Admins only.",
    });
  }
};

const sellerAuthentication = (req, res, next) => {
  if (req.session && req.session.user && req.session.user.role === "seller") {
    next();
  } else {
    res.status(403).json({
      message: "Forbidden access. Sellers only.",
    });
  }
};

export { authentication, adminAuthentication, sellerAuthentication };
