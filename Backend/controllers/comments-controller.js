const comments = require("../models/comments-model");


const get = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await comments.find({ petition_id: id });

    if (!data || data.length === 0) {
      return res.status(200).json({ text: "No Comments Found" });
    }

    res.status(200).json({ data });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      text: "Some Internal Server Error! Please Refresh the Page and Try Again",
    });
  }
};

const add = async (req, res) => {
  const { petition_id, comment } = req.body;
  try {

    const existing = await comments.findOne({ petition_id });

    if (existing) {

      existing.comment.push(comment);
      await existing.save();
      return res.status(200).json({ text: "Comment added successfully" });
    }


    await comments.create({ petition_id, comment: [comment] });
    res.status(200).json({ text: "Comment added successfully" });

  } catch (e) {
    console.error(e);
    res.status(500).json({
      text: "Some Internal Server Error! Please Refresh the Page and Try Again",
    });
  }
};



const update = async (req, res) => {
  const { petition_id, oldComment, newComment } = req.body;

  try {
    const commentDoc = await comments.findOne({ petition_id });
    if (!commentDoc) {
      return res.status(404).json({ text: "No comments found for this petition" });
    }

    const updatedComments = [];
    let updated = false;

    for (let i = 0; i < commentDoc.comment.length; i++) {
      const [userId, commentText] = commentDoc.comment[i];

      if (userId === oldComment[0]) {
        const newText = Array.isArray(newComment) ? newComment[1] : newComment;
        updatedComments.push([userId, newText]);
        updated = true;
      } else {
        updatedComments.push([userId, commentText]);
      }
    }

    if (!updated) {
      const newText = Array.isArray(newComment) ? newComment[1] : newComment;
      updatedComments.push([oldComment[0], newText]);
    }

    await comments.updateOne({ petition_id }, { $set: { comment: updatedComments } });
    res.status(200).json({ text: "Comment updated successfully" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ text: "Internal Server Error" });
  }
};


const remove = async (req, res) => {
  const { petition_id, comment } = req.body;
  try {
    const commentDoc = await comments.findOne({ petition_id });

    if (!commentDoc) {
      return res.status(404).json({ text: "No comments found for this petition" });
    }

    const originalLength = commentDoc.comment.length;

    commentDoc.comment = commentDoc.comment.filter(
      (c) => !(c[0] === comment[0] && c[1] === comment[1])
    );

    if (commentDoc.comment.length === originalLength) {
      return res.status(404).json({ text: "Comment not found" });
    }

    await commentDoc.save();
    res.status(200).json({ text: "Comment deleted successfully" });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      text: "Some Internal Server Error! Please Refresh the Page and Try Again",
    });
  }
};


module.exports = [get, add, update, remove ];
