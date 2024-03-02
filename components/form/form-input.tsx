import CK from "@/assets/ck.svg";
import { Input, InputProps } from "antd";
import { ErrorMessage } from "formik";
import Image from "next/image";
import { IoSearch } from "react-icons/io5";
import FormError from "./form-error";
import FormFieldLayout from "./layout";

type IProps = {
  onChange?: (value: string) => void;
  label?: string;
  placeholder?: string;
  value?: string | number | null;
} & InputProps;

export default function FormInput({
  label,
  placeholder,
  value,
  name,
  type = "text",
  onChange,
  onBlur,
  ...props
}: IProps) {
  return (
    <FormFieldLayout
      label={label}
      content={
        <div className="relative">
          <Input
            className="relative py-[15px] !rounded-lg border-gray-300 border-[1.3px] focus:border-btn hover:border-btn px-3 placeholder:font-normal placeholder:text-black"
            value={value || undefined}
            placeholder={placeholder}
            onChange={onChange && onChange}
            onBlur={onBlur}
            name={name}
            autoComplete="off"
            type={type}
            allowClear={type === "search"}
            prefix={type === "search" && <IoSearch />}
            suffix={type === "search" && <Image src={CK} alt="" />}
            {...props}
          />

          <ErrorMessage
            name={name as string}
            // eslint-disable-next-line react/no-children-prop
            children={(msg) => <FormError error={msg} />}
          />
        </div>
      }
    />
  );
}
