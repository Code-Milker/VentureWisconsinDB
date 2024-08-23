import { Coupon, Groups, Listing, User } from "../prisma";
const addDays = (date, days) => {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};
export enum CouponTypes {
  percent = "% off",
  offers = "offers",
  dollar = "$ off",
}
export const mockUsers: Omit<User, "id" | "createdAt" | "groupsGroupName">[] = [
  {
    email: "tylerf66@gmail.com",
    firstName: "Tyler",
    lastName: "Fischer",
    password: "password123",
    role: "ADMIN",
    pendingAccountChange: false,
    authId: "",
    authStrategy: "",
  },
  {
    email: "kyguy6969@gmail.com",
    firstName: "Kyle",
    lastName: "Esser",
    password: "password123",
    role: "LISTER",
    pendingAccountChange: false,
    authId: "",
    authStrategy: "",
  },
  {
    email: "daves66@gmail.com",
    firstName: "Dave",
    lastName: "Shuma",
    password: "password123",
    role: "USER",
    pendingAccountChange: true,
    authId: "",
    authStrategy: "",
  },
];
export const ADMIN = mockUsers[0];
export const LISTER = mockUsers[1];
export const USER = mockUsers[2];
export const mockListings = {
  // BAR_430: {
  //   image1:
  //     "https://images.squarespace-cdn.com/content/v1/581d212246c3c40f060ce1ec/1478310323329-AEKV1H8T44UB8LU5YPMC/IMG_5033.jpg",
  //   image2:
  //     "https://images.squarespace-cdn.com/content/v1/581d212246c3c40f060ce1ec/1478318946664-18H4CDL98HA2JOK7SEDU/IMG_5010.jpg",
  //   image3:
  //     "https://images.squarespace-cdn.com/content/v1/581d212246c3c40f060ce1ec/1478313684290-QI8D44040Z5M04SM352X/13697019_894095867362167_160257876984087406_n-2.png",
  //   image4: null,
  //   experience1: "cozy",
  //   experience2: "cozy",
  //   experience3: "cozy",
  //   experience4: "cozy",
  //   city: "Oshkosh",
  //   displayTitle: "Bar 430",
  //   subTitle: "Fancy bar place",
  //   address: "430 N Main St, Oshkosh, WI 54901",
  //   name: "Bar 430",
  //   email: "tylerf66@gmail.com",
  //   website: "bar430.com",
  //   phone: "(920) 230-1114",
  //   category: "bars",
  //   zipcode: "53130",
  //   description: "Venue for classic bar fare with some creative twists, a robust drink menu & brunch on weekends.",
  // },
  // MOLLYS: {
  //   image1: "https://lh3.googleusercontent.com/p/AF1QipO1NgOQV1FZIuSksxG20y4hzNxISHQW34onekQU=s1360-w1360-h1020",
  //   image2: null,
  //   image3: null,
  //   image4: null,
  //   experience1: "cozy",
  //   experience2: "cozy",
  //   experience3: "cozy",
  //   experience4: "cozy",
  //   city: "Oshkosh",
  //   displayTitle: "Mollys",
  //   subTitle: "asdf",
  //   zipcode: "53209",
  //   email: "kyguy6969@gmail.com",
  //   website: "mollymcguiresoshkosh.com",
  //   phone: "(920) 233-3301",
  //   address: "539 Campus Pl, Oshkosh, WI 54901",
  //   name: "Molly McGuire's",
  //   category: "bars",
  //   description: "Pub grub, cocktails & draft beer served in a wood-paneled space with a pool table & arcade games.",
  // },
  D_PUB: {
    image1: "44_1_2024-08-17T19:01:31.725Z.jpg",
    image2: null,
    image3: null,
    image4: null,
    experience1: "cozy",
    experience2: "cozy",
    experience3: "cozy",
    experience4: "cozy",
    city: "Oshkosh",
    displayTitle: "D PUB",
    subTitle: "additional info",
    zipcode: "53207",
    address: "515 N Main St, Oshkosh, WI 54901",
    name: "d pub",
    website: "https://www.facebook.com/DistilleryPub/",
    email: "daves66@gmail.com",
    phone: "(920) 233-2565",
    category: "bars",
    code: "d pub",
    description:
      "Located in historic downtown Oshkosh. Quaint, laid back pub, full-service restaurant and amazing mugs of imported beer.",
  },
};
type CouponRelations = {
  listingId: number;
  expirationDate: Date;
  groupName: string;
};
type CouponBase = Omit<
  Coupon,
  | "id"
  | "dollarsOff"
  | "amountRequiredToQualify"
  | "percentOff"
  | "itemName"
  | "percentOffFor"
  | "listingId" // include on submit
  | "expirationDate" // include on submit
  | "groupName" // include on submit
>;
type DollarsOffCoupon = CouponBase & { dollarsOff: string };
type BuySomeGetSomeCoupon = CouponBase & { amountRequiredToQualify: string };
type PercentOffItemCoupon = CouponBase & {
  percentOff: string;
  percentOffFor: string;
  itemName: string;
};
type PercentOffBillCoupon = Omit<PercentOffItemCoupon, "itemName">;

const mollyDollarDefaultCoupon: DollarsOffCoupon = {
  description: "get 2 bucks off any order over 300 dollars.",
  dollarsOff: "2",
  email: "tylerf66@gmail.com",
  name: "Molly Madness",
  couponType: CouponTypes.dollar,
};
const mollyDollarGroup1Coupon: DollarsOffCoupon = {
  description: "Enjoy 5 dollars off on this item",
  dollarsOff: "5",
  email: "tylerf66@gmail.com",
  name: "5 dollar discount",
  couponType: CouponTypes.dollar,
};
const mollyDollarGroup2Coupon: DollarsOffCoupon = {
  description: "3 dollars off this item!",
  dollarsOff: "2",
  email: "tylerf66@gmail.com",
  name: "3 dollar discount",
  couponType: CouponTypes.dollar,
};
const mollyDollarGroup3Coupon: DollarsOffCoupon = {
  description: "20 dollars off this item!",
  dollarsOff: "2",
  email: "tylerf66@gmail.com",
  name: "Ultra coupon",
  couponType: CouponTypes.dollar,
};

const dPubPercentCouponGroup1ForItem: PercentOffItemCoupon = {
  description: "discount meatballs!",
  percentOff: "20%",
  percentOffFor: "offItem",
  itemName: "meatballs",
  email: "tylerf66@gmail.com",
  name: "MEATBALL MADNESS",
  couponType: CouponTypes.percent,
};
const dPubPercentCouponGroup2ForItem: PercentOffItemCoupon = {
  description: "discount beverages!",
  percentOff: "20%",
  percentOffFor: "offItem",
  itemName: "beverages",
  email: "tylerf66@gmail.com",
  name: "Diet prices",
  couponType: CouponTypes.percent,
};
//2 percent bill
const dPubDefaultPercentCouponGroup3ForBill: PercentOffBillCoupon = {
  description: "discount bill!",
  percentOff: "25%",
  percentOffFor: "offBill",
  email: "tylerf66@gmail.com",
  name: "25% off meal",
  couponType: CouponTypes.percent,
};
const dPubPercentCouponGroup2ForBill: PercentOffBillCoupon = {
  description: "another discount bill",
  percentOff: "20%",
  percentOffFor: "offBill",
  email: "tylerf66@gmail.com",
  name: "20% off meal",
  couponType: CouponTypes.percent,
};

const bar430DefaultBuySomeGetSome: BuySomeGetSomeCoupon = {
  amountRequiredToQualify: "2",
  description: "Buy 2 beers get 1 free",
  email: "tylerf66@gmail.com",
  name: "Beer goggles",
  couponType: CouponTypes.offers,
};
const bar430Group1BuySomeGetSome: BuySomeGetSomeCoupon = {
  amountRequiredToQualify: "3",
  description: "buy 3 of these and get 2 of those",
  email: "tylerf66@gmail.com",
  name: "Buy 3 of those and get 2 in return",
  couponType: CouponTypes.offers,
};
const bar430Group2BuySomeGetSome: BuySomeGetSomeCoupon = {
  amountRequiredToQualify: "1",
  description: "Selling at a loss what could go wrong",
  email: "tylerf66@gmail.com",
  name: "BOGO BOGO",
  couponType: CouponTypes.offers,
};
const bar430Group3BuySomeGetSome: BuySomeGetSomeCoupon = {
  amountRequiredToQualify: "33",
  description:
    "Our bogo deal caused us to close down in 10 different locations",
  email: "tylerf66@gmail.com",
  name: "ANTI BOGO",
  couponType: CouponTypes.offers,
};

export const MollyCoupons = [
  mollyDollarDefaultCoupon,
  mollyDollarGroup1Coupon,
  mollyDollarGroup2Coupon,
  mollyDollarGroup3Coupon,
];

export const bar430Coupons = [
  bar430DefaultBuySomeGetSome,
  bar430Group1BuySomeGetSome,
  bar430Group2BuySomeGetSome,
  bar430Group3BuySomeGetSome,
];
export const dPubCoupons = [
  dPubDefaultPercentCouponGroup3ForBill,
  dPubPercentCouponGroup2ForBill,
  dPubPercentCouponGroup1ForItem,
  dPubPercentCouponGroup2ForItem,
];

export const mockGroups: Groups[] = [
  {
    groupName: "Venture 2023",
    description:
      "Part of the Venture Wisconsin coupon collection, enjoy various discounts to well known dinners, bars, and so much more in the wisconsin area.",
    activationCode: "qwerty",
  },
  {
    groupName: "Brew Deck",
    description:
      "Part of the Venture Wisconsin coupon collection, enjoy various discounts to various breweries in the wisconsin.",
    activationCode: "qwerty",
  },
  {
    groupName: "Bloody Marry Bonus",
    description: "Bloody Mary package created by some lady in Wisconsin",
    activationCode: "peepee",
  },
];

export const getCoupons = (
  listings: Listing[],
  groups: Groups[],
  users: User[],
) => {
  const updateCoupon = (c, i, listingName) => {
    const listing = listings.find((l) => l.name === listingName);
    const groupName = i === 0 ? listing?.name : groups[i - 1].groupName;
    return {
      ...c,
      listingId: listing?.id as number,
      expirationDate: addDays(new Date(), i + 3),
      groupName: groupName as string,
    };
  };
  const dPub: Coupon[] = dPubCoupons.map((c, i) =>
    updateCoupon(c, i, mockListings.D_PUB.name),
  );

  return { dPub };
};
export const getMockListings = () => [mockListings.D_PUB];
