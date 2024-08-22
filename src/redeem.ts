import express from 'express';
import { PrismaClient } from "../prisma";
import dotenv from 'dotenv';
dotenv.config();
const serverUrl = process.env.SERVER_URL
const router = express.Router();
const prisma = new PrismaClient();

export const redeem = router.get('/redeem', async (req, res) => {
  const { couponId, email } = req.query;
  console.log(1)
  if (!couponId || !email) {
    res.status(400).send('Missing couponId or email');
    return;
  }

  try {
    const coupon = await prisma.coupon.findUnique({
      where: { id: Number(couponId) },
    });

    if (!coupon?.listingId) {
      res.status(404).send('Coupon not found');
      return;
    }

    const listing = await prisma.listing.findUnique({
      where: { id: coupon.listingId },
    });

    console.log(listing)
    if (!listing) {
      res.status(404).send('Listing not found');
      return;
    }

    const user = await prisma.user.findUnique({
      where: { email: String(email) },
    });

    if (!user) {
      res.status(404).send('User not found');
      return;
    }

    // Generate the HTML response
    const htmlResponse = `<html>
    <head>
      <title>Coupon Redemption</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 10px;
          padding: 10px;
          background-color: #f4f4f4;
          font-size: 20px; /* Increased base font size */
        }
        .container {
          background-color: #fff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          max-width: 500px;
          margin: 0 auto;
        }
        .button {
          background-color: red;
          color: white;
          padding: 20px;
          text-align: center;
          text-decoration: none;
          display: block;
          font-size: 22px; /* Larger font size for buttons */
          margin: 15px 0;
          border-radius: 5px;
          border: none;
          cursor: pointer;
          width: 100%; /* Full width on mobile */
        }
        .disclaimer {
          margin-top: 20px;
          font-size: 16px;
          color: #777;
        }
        .input-field {
          padding: 18px;
          margin: 15px 0;
          font-size: 22px; /* Larger font size for input fields */
          width: 100%;
          box-sizing: border-box;
          border: 1px solid #ccc;
          border-radius: 5px;
        }
        h1 {
          font-size: 28px; /* Increased font size for headings */
          margin-bottom: 20px;
        }
        p {
          margin-bottom: 18px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Coupon Redemption</h1>
        <p><strong>Coupon:</strong> ${coupon.name}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Listing Name:</strong> ${listing.name}</p>
        <form id="claim-form">
          <p>
            Please enter your employee passcode to verify and claim this coupon for ${user.firstName} ${user.lastName}.
          </p>
          <input type="password" id="passcode" class="input-field" placeholder="Enter Passcode" required />
          <button type="button" class="button" onclick="claimCoupon()">Claim Coupon</button>
        </form>
        <p class="disclaimer">
          By clicking "Claim Coupon," you verify that the user with the email listed above will redeem their coupon. This action is irreversible.
        </p>
      </div>
      <script>
        function claimCoupon() {
          const passcode = document.getElementById('passcode').value;

          if (passcode === '') {
            alert('Please enter the passcode.');
            return;
          }
          if(passcode !== '${listing.code}'){
             alert('Wrong passcode')
          }
          // Here, you would send a request to the backend to verify the passcode and redeem the coupon
          fetch('${serverUrl}'+'trpc/couponUse', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({email: '${user.email}',couponId: '${couponId}' })
          })
          .then(response => response.json())
          .then(data => {

            if (data.success) {
              alert('Coupon successfully redeemed!');
            } else {
              alert('Invalid passcode. Please try again.');
            }
          })
          .catch(error => {
            alert('An error occurred while redeeming the coupon. Please try again.');
          });
        }
      </script>
    </body>
  </html>
  `;


    res.setHeader('Content-Type', 'text/html');
    res.send(htmlResponse);
  } catch (error) {
    res.status(500).send('An error occurred while processing the request');
  }
});

