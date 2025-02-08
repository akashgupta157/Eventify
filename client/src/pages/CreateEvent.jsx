import { z } from "zod";
import React from "react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { configure, uploadCloudinary } from "@/utils";
import { CalendarIcon, CircleCheckBig, CircleX, MoveLeft } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import axios from "axios";

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Name must be at least 3 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  date: z.date({
    required_error: "Date is required",
  }),
  time: z.string().min(1, { message: "Time is required" }),
  location: z
    .string()
    .min(5, { message: "Location must be at least 5 characters." }),
  category: z.string().min(1, { message: "Category is required" }),
  image: z.instanceof(File).refine((file) => file.size > 0, {
    message: "Image is required",
  }),
});

export default function CreateEvent() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const config = configure(user.token);

  const showToast = (icon, message, variant) => {
    toast({
      title: (
        <div className="flex items-center gap-2">
          {icon}
          {message}
        </div>
      ),
      variant,
    });
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      date: undefined,
      time: "",
      location: "",
      category: "",
      image: undefined,
    },
  });

  async function onSubmit(values) {
    try {
      const imageUrl = await uploadCloudinary(values.image);
      const eventData = {
        ...values,
        image: imageUrl.url,
      };
      const { data } = await axios.post(
        `${import.meta.env.VITE_URL}/api/event`,
        eventData,
        config
      );
      showToast(<CircleCheckBig />, data.message, "success");
      form.reset();
      navigate("/");
    } catch (error) {
      console.error("Error uploading image or submitting form:", error);
      showToast(
        <CircleX />,
        "An error occurred. Please try again later.",
        "destructive"
      );
    }
  }

  return (
    <div className="flex justify-center items-center py-5 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl space-y-5">
        <div
          className="flex items-center gap-2 text-blue-900 cursor-pointer font-bold text-sm"
          onClick={() => navigate("/")}
        >
          <MoveLeft className="w-4 h-4" />
          Back
        </div>

        <h1 className="text-2xl font-bold text-blue-800">Create Event</h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="flex flex-col sm:flex-row gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="w-full sm:w-1/2">
                    <FormLabel>Event Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter event title" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="w-full sm:w-1/2 flex flex-col justify-between pt-1.5">
                    <FormLabel>Event Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal w-full",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span className="text-gray-400">
                                Select event date
                              </span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          className="bg-white"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <FormItem className="w-full sm:w-1/2">
                <FormLabel>Created By</FormLabel>
                <FormControl>
                  <Input value={user?.name} readOnly />
                </FormControl>
              </FormItem>
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem className="w-full sm:w-1/2">
                    <FormLabel>Event Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter event location" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Category</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter event category" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter event description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="image">Event Image</FormLabel>
                  <FormControl>
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        field.onChange(
                          e.target.files ? e.target.files[0] : null
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full sm:w-auto bg-blue-800 text-white"
            >
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
