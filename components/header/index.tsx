"use client";
import Logo from "@/assets/logo.svg";
import Logout from "@/assets/logout-03.svg";
import Mail from "@/assets/mail-02.svg";
import Bell from "@/assets/notification-03.svg";
import type { DrawerProps } from "antd";
import { Drawer, Tooltip, notification } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { IoStar } from "react-icons/io5";
import { RxHamburgerMenu } from "react-icons/rx";
import NavMenuItems from "../navlinks";
import { bottomRoutes, routes } from "../sidebar/links";
import { Routes } from "../sidebar/routes";
import UserDetails from "../user-details";

const images = [Bell, Mail];
const Header = () => {
  const [click, setClicked] = useState(false);
  const [open, setOpen] = useState(false);
  const [placement, ,] = useState<DrawerProps["placement"]>("left");
  const [api, contextHolder] = notification.useNotification();

  const openNotification = () => {
    api.open({
      duration: 3,
      message: "In App Notification",
      description: "No Notification Available",
    });
  };

  const onClose = () => {
    setOpen(false);
    setClicked(false);
  };

  const handleClick = () => {
    setClicked((click) => !click);
    setOpen(true);
  };

  return (
    <>
      <div className="pt-8 pb-10 flex items-center justify-between sticky top-0 left-0 bg-white">
        <div className="sticky top-0 left-0 z-20 self-start md:hidden">
          <Link
            href={`${Routes.dashboard}`}
            className="flex items-center gap-2"
          >
            <Image src={Logo} alt="icon" className="w-[40px]" />
            <p className="text-xl font-medium">HR.360</p>
          </Link>
        </div>
        <div className="hidden md:flex">
          <h1>Welcome back, </h1>
          <span className="pl-1 font-medium flex gap-1 items-center">
            Samuel <IoStar className="text-yellow-500" />
          </span>
        </div>
        <div className="hidden md:block">
          <UserDetails isHidden={false} />
        </div>
        <div onClick={handleClick} className="lg:hidden">
          {click ? (
            <IoMdClose className="text-xl text-primary-100" />
          ) : (
            <RxHamburgerMenu className="text-xl text-primary-100" />
          )}
        </div>
      </div>

      <Drawer
        title=""
        placement={placement}
        closable={true}
        onClose={onClose}
        open={open}
        key={placement}
        className="font-light bg-white sticky top-0 left-0 pb-4"
      >
        <div className="py-3 w-full pb-5">
          <UserDetails isHidden={false} />
        </div>

        <ul className="flex flex-col gap-7">
          {routes?.map((route, index) => {
            return <NavMenuItems key={index} route={route} />;
          })}
        </ul>

        <ul className="pt-16 pb-10 flex flex-col gap-7">
          {bottomRoutes?.map((route, index) => {
            return <NavMenuItems route={route} key={index} />;
          })}

          <li className={`px-3 flex gap-3 items-center cursor-pointer`}>
            <Image src={Logout} alt="logout" />

            <Tooltip title="logout" color={`#380ABB`} className="text-black">
              logout
            </Tooltip>
          </li>
        </ul>
      </Drawer>
    </>
  );
};

export default Header;
