// src/pages/page.tsx
import Link from 'next/link';
import React from 'react';

export default function Home() {
  return (
    <>
      
      <Link href="/Notificationservice/email-verification">Verify Email</Link><br/>
      {/* <Link href="/Notificationservice/push-notification">Click for Notificaton</Link><br /> */}
      {/* <Link href="/Notificationservice/PushNoti"> Messages Notification 2</Link><br /> */}
      <Link href="/Notificationservice/PushNoti"> Messages Notification 2</Link><br />
      {/* <Link href="/Notificationservice/product_announcement">Product Announcement</Link><br /> */}
      <Link href="/Notificationservice/ProductAnnouncement"> Product Announcement</Link><br />
      {/* <Link href="/Notificationservice/special_offers">Special Offers</Link><br /> */}
      <Link href="/Notificationservice/SpecialOffers"> Special Offers</Link><br />
      {/* <Link href="/Notificationservice/insights_tips">Insights Tips</Link><br /> */}
      <Link href="/Notificationservice/InsightsTips"> Insights Tips</Link><br />
      {/* <Link href="/Notificationservice/price_alerts">Price Alerts</Link><br /> */}
      <Link href="/Notificationservice/PriceAlerts"> Price Alerts</Link><br />
      {/* <Link href="/Notificationservice/account_activity">Account Activity</Link><br /> */}
      <Link href="/Notificationservice/AccountActivity"> Account Activity</Link><br />
    </>
  );
}
