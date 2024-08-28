
import { Router } from "express";

const adminRouter = Router();

adminRouter.get("/admin", (req, res) => {
  // Render the 'admin' view, passing any necessary data
  res.render("admin", {
    layout: false,
    title: "Admin Page",
    message: "Welcome to the Admin Panel!",
  });
});
adminRouter.get('/listing/create', (req, res) => {
  res.render('listingCreate', { title: 'Create Listing', message: 'Create a new listing' });
});

adminRouter.get('/listing/update', (req, res) => {
  res.render('listingUpdate', { title: 'Update Listing', message: 'Update an existing listing' });
});

adminRouter.get('/listing/delete', (req, res) => {
  res.render('listingDelete', { title: 'Delete Listing', message: 'Delete a listing' });
});

adminRouter.get('/listing/account-requests', (req, res) => {
  res.render('listingAccountRequests', { title: 'Account Requests', message: 'Manage account requests' });
});

adminRouter.get('/coupon/create', (req, res) => {
  res.render('couponCreate', { title: 'Create Coupon', message: 'Create a new coupon' });
});

adminRouter.get('/coupon/update', (req, res) => {
  res.render('couponUpdate', { title: 'Update Coupon', message: 'Update an existing coupon' });
});

adminRouter.get('/coupon/delete', (req, res) => {
  res.render('couponDelete', { title: 'Delete Coupon', message: 'Delete a coupon' });
});

adminRouter.get('/user/update', (req, res) => {
  res.render('userUpdate', { title: 'Update User', message: 'Update user information' });
});

export default adminRouter;
