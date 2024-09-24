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
    jwt: "jwt",
    role: "ADMIN",
    pendingAccountChange: false,
    authStrategy: "google",
  },
  {
    email: "kyguy6969@gmail.com",
    firstName: "Kyle",
    lastName: "Esser",
    jwt: "jwt",
    role: "LISTER",
    pendingAccountChange: false,
    authStrategy: "google",
  },
  {
    email: "daves66@gmail.com",
    firstName: "Dave",
    lastName: "Shuma",
    jwt: "jwt",
    role: "USER",
    pendingAccountChange: true,
    authStrategy: "google",
  },
];
export const ADMIN = mockUsers[0];
export const LISTER = mockUsers[1];
export const USER = mockUsers[2];
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


