import { z } from "zod";
import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { login } from "@/redux/slice/authSlice";
import { Link, useNavigate } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleCheckBig, CircleX, Eye, EyeClosed } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});
export default function Login() {
  const { toast } = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const showToast = (icon, message, variant) => {
    toast({
      title: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          {icon}
          {message}
        </div>
      ),
      variant,
    });
  };
  const [showPassword, setShowPassword] = useState(false);
  async function onSubmit(values) {
    const { data } = await axios.post(
      `${import.meta.env.VITE_URL}/api/auth/login`,
      values
    );
    if (data.success) {
      showToast(<CircleCheckBig />, data.message, "success");
      dispatch(login(data));
      navigate("/");
    } else {
      showToast(<CircleX />, data.message, "destructive");
    }
  }
  return (
    <div className="bg-zinc-200 w-screen h-[100svh] p-5 flex justify-center items-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="bg-white rounded-lg p-5 shadow-md space-y-5 lg:w-1/3 w-full h-fit mx-auto "
        >
          <div>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-blue-700">
              Login
            </h1>
            <p className="text-gray-500 text-sm">
              Please fill in the form below to login
            </p>
          </div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="abc@example.com" {...field} />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel>Password</FormLabel>
                  <p onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeClosed /> : <Eye />}
                  </p>
                </div>
                <FormControl>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <div className="flex justify-center items-center gap-1 text-sm">
            <p>Don&apos;t have an account?</p>
            <Link to="/register" className="text-blue-700 underline">
              Register
            </Link>
          </div>
          <Button type="submit" className="w-full bg-blue-700 text-white">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}
