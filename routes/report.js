import { Router } from "express";
import idValidation from "../validation/idValidation.js";
import wordData from "../data/words/words.js";
import userData from "../data/users/users.js";
import ticketData from "../data/tickets/tickets.js";
import ticketValidation from "../data/tickets/ticketValidation.js";
const router = Router();

router.route("/").get(async (req, res) => {
  try {
    let tickets = await ticketData.getTicketsForUser(req.session.user._id);
    let isAdmin = false;
    if (req.session.user.role === "admin") {
      isAdmin = true;
    }
    return res.render("tickets", {
      title: "Tickets",
      isAdmin: isAdmin,
      tickets: tickets,
      newTicket: true,
    });
  } catch (e) {
    return res.status(500).render("errorSpecial", { error: e });
  }
});

router
  .route("/new")
  .get(async (req, res) => {
    try {
      return res.render("newTicket", {
        title: "Tickets",
        isAdmin: isAdmin,
        tickets: tickets,
        newTicket: true,
      });
    } catch (e) {
      return res.status(500).render("errorSpecial", { error: e });
    }
  })
  .post(async (req, res) => {
    try {
      let issue = xss(req.body.issue);
      let type = xss(req.body.type);
      issue = ticketValidation.validateBody(issue);
      type = ticketValidation.validateType(type);
      await ticketData.addTicket(req.session.user._id, type, issue);

      return res.redirect("/report");
    } catch (e) {
      return res.status(500).render("errorSpecial", { error: e });
    }
  });

export default router;
