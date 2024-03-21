import { signJwt, verifyJwt } from "@/lib/jwt";
import { compileActivationTemplate, sendMail } from "@/lib/mail";
import { mongoDBConnection } from "@/lib/mongodb";
import { User } from "@/models/users";
import { isEmptyOrSpaces } from "@/utils/helper";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const { email, password, name, role, emailVerified, employmentType } =
    await req.json();
  await mongoDBConnection();
  try {
    const checkIfUserEmailExists = await User.findOne({ email });
    if (checkIfUserEmailExists) {
      return NextResponse.json(
        { message: "User Already Exist" },
        { status: 409 }
      );
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      if (
        isEmptyOrSpaces(name) ||
        isEmptyOrSpaces(email) ||
        isEmptyOrSpaces(password) ||
        isEmptyOrSpaces(role) ||
        isEmptyOrSpaces(emailVerified) ||
        isEmptyOrSpaces(employmentType)
      ) {
        return NextResponse.json(
          {
            message: "Fields can't be empty",
            statusCode: 204,
          },
          { status: 204 }
        );
      } else {
        const user = await User.create({
          name,
          email,
          password: hashedPassword,
          role,
          emailVerified,
          employmentType,
        });
        const jwtUserId = signJwt({ id: user?.id });
        const activationURL = `${process.env.NEXTAUTH_URL}/auth/activation/${jwtUserId}`;
        const body = compileActivationTemplate(name, activationURL);
        await sendMail({
          to: email,
          subject: "Activate your account",
          body: body,
        });

        return NextResponse.json(
          {
            message: "An activation link has been sent to your mail",
            statusCode: 200,
          },
          { status: 201 }
        );
      }
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Oops, something went wrong" },
      { status: 501 }
    );
  }
};

type ActivateUserTypeFunc = (
  jwtUserId: string
) => Promise<"userNotExist" | "alreadyActivate" | "success">;

export const activateUser: ActivateUserTypeFunc = async (jwtUserId) => {
  const payload = verifyJwt(jwtUserId);
  const userId = payload?.id;
  const user = await User.findById({ _id: userId });
  if (!user) return "userNotExist";
  if (user.emailVerified) return "alreadyActivate";
  await User.findOneAndUpdate({ _id: user?.id }, { emailVerified: new Date() });
  return "success";
};
