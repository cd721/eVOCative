import { Router } from "express";
const router = Router();
import idValidation from "../validation/idValidation.js";
import userData from "../data/users/users.js";
import wordData from "../data/words/words.js";
import wordValidation from "../data/words/wordValidation.js";
import xss from "xss";

router.route("/").get(async (req, res) => {
  try {
    const userList = await userData.getAllUsers();
    let adminUsers = [];
    for (let user of userList) {
      if (user.is_admin) {
        adminUsers.push(user);
      }
    }
    return res.render("admin/index", { users: adminUsers });
  } catch (e) {
    return res.status(500).json({ error: e });
  }
});

router
  .route("/addNewWord")
  .get(async (req, res) => {
    try {
      return res.render("admin/addNewWord");
    } catch (e) {
      return res.status(500).json({ error: e });
    }
  })
  .post(async (req, res) => {
    let word = xss(req.body.word);
    let definition = xss(req.body.definition);
    let tags = xss(req.body.tags);
    tags = tags.split(",").map((tag) => tag.trim());

    try {
      word = wordValidation.validateWord(word);
      definition = wordValidation.validateDefinition(definition);
      tags = wordValidation.validateTags(tags);

      await wordData.addWord(word, definition, tags, []);
      return res.redirect("/words");
    } catch (e) {
      return res.status(500).json({ error: e });
    }
  });

router
  .route("/editWord/:id")
  .get(async (req, res) => {
    try {
      let word_id = req.params.id;
      let word = await wordData.getWordById(word_id);
      let tagStr = "";
      let firstTag = true;
      for (let tag of word.tags) {
        if (firstTag) {
          tagStr = tagStr + `${tag}`;
          firstTag = false;
        } else {
          tagStr = tagStr + `, ${tag}`;
        }
      }
      return res.render("admin/editWord", {
        id: word_id,
        word: word.word,
        definition: word.definition,
        tags: tagStr,
      });
    } catch (e) {
      return res.status(500).json({ error: e });
    }
  })
  .post(async (req, res) => {
    let word_id = req.params.id;
    let word = xss(req.body.word);
    let definition = xss(req.body.definition);
    let tags = xss(req.body.tags);
    tags = tags.split(",").map((tag) => tag.trim());

    try {
      word = wordValidation.validateWord(word);
      definition = wordValidation.validateDefinition(definition);
      tags = wordValidation.validateTags(tags);

      await wordData.updateWord(word_id, word, definition, tags, []);
      return res.redirect("/words/all");
    } catch (e) {
      return res.status(500).json({ error: e });
    }
  });

router.route("/deleteWord/:id").get(async (req, res) => {
  try {
    let word_id = req.params.id;
    let word = await wordData.getWordById(word_id);
    return res.render("admin/deleteWordConfirmation", { id: word_id, word: word.word });
  } catch (e) {
    return res.status(500).json({ error: e });
  }
}).post(async (req, res) => {
  try {
    let word_id = req.params.id;
    let removalInfo = await wordData.removeWord(word_id);
    if (removalInfo.removeSuccessful) {
      return res.render("admin/deleteWord");
    } else {
      return res.render("admin/deleteWord", { error: true });
    }
  } catch (e) {
    return res.status(500).json({ error: e });
  }
});

export default router;
