const login = async (req, res) => {
  const { email, password } = req.body;

  if (email === "admin@admin.com" && password === process.env.ADMIN_PASSWORD) {
    req.session.user = { email, role: "admin" };
    return res
      .status(200)
      .json({ message: "Login successful", user: req.session.user });
  }

  try {
    const user = await Worker.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    if (user.role !== "seller") {
      return res.status(403).json({ message: "Access denied. Not a seller." });
    }
    req.session.user = { id: user.id, role: "seller" };
    return res
      .status(200)
      .json({ message: "Login successful", user: req.session.user });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { login };
