const protect = async (req, res, next) => {
  const token = req.headers.authorization;

  //   Verify token
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    //   Decode the token
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    //   Get userId
    req.userId = decode.userId;
    next();
  } catch (error) {
    // Return unauthorized message
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export default protect;
