import Post from "../models/Post.js";

export const createPost = async (req, res) => {
  const post = await Post.create({
    title: req.body.title,
    user: req.user,
  });

  res.json(post);
};

export const deletePost = async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  if (post.user.toString() !== req.user) {
    return res.status(403).json({ message: "Not authorized" });
  }

  await post.deleteOne();

  res.json({ message: "Post deleted" });
};
