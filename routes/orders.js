const { Router } = require("express");
const Order = require("../models/order");
const auth = require("../middleware/auth");
const router = Router();

router.get("/", auth, async (req, res) => {
  try {
    const orders = await Order.find({ "user.userId": req.user._id })
      .populate("user.userId")
      .lean();

    const allOrders = orders.map((o) => {
      return {
        ...o,
        price: o.courses.reduce((total, c) => {
          return total + c.count * c.course.price;
        }, 0),
      };
    });

    res.render("orders", {
      isOrder: true,
      title: "Orders",
      orders: allOrders,
    });
  } catch (e) {
    console.log(e);
  }
});

router.post("/", auth, async (req, res) => {
  try {
    await req.user.populate("card.items.courseId");

    const courses = req.user.card.items.map((i) => ({
      count: i.count,
      course: { ...i.courseId._doc },
    }));

    const order = new Order({
      user: {
        name: req.user.name,
        userId: req.user,
      },
      courses: courses,
    });

    await order.save();
    await req.user.clearCard();

    res.redirect("/orders");
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
