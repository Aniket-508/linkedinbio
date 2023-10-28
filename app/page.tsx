"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useChat } from "ai/react";
import { MoveRight, Loader2 } from "lucide-react";
import { FormEvent, useRef } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { NumberIcon } from "@/components/NumberIcon";

const formSchema = z.object({
  industry: z.string().min(1),
  jobTitle: z.string().min(1),
  skills: z.string(),
  achievements: z.string(),
  objectives: z.string(),
});

type FormSchemaKeys = keyof (typeof formSchema)["_input"];

interface FormField {
  name: FormSchemaKeys;
  label: string;
  placeholder: string;
}

const formFields: FormField[] = [
  {
    name: "industry",
    label: "Industry",
    placeholder: "[Outline your industry or field] e.g. EdTech",
  },
  {
    name: "jobTitle",
    label: "Job Title",
    placeholder: "[Specify your job title] e.g. Software Engineer",
  },
  {
    name: "skills",
    label: "Skills",
    placeholder:
      "[Mention 3-5 core skills you'd like to feature] e.g. React.js, NextJS",
  },
  {
    name: "achievements",
    label: "Experiences",
    placeholder: "[Summarize 2-3 remarkable experiences or achievements]",
  },
  {
    name: "objectives",
    label: "Objectives",
    placeholder: "e.g. networking, job hunting, personal brand development",
  },
];

export default function Home() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      industry: "",
      jobTitle: "",
      skills: "",
      achievements: "",
      objectives: "",
    },
  });
  const bioRef = useRef<null | HTMLDivElement>(null);

  const scrollToBios = () => {
    if (bioRef.current !== null) {
      bioRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const { handleSubmit, isLoading, messages } = useChat({
    body: {
      industry: form.getFieldState("industry"),
      jobTitle: form.getFieldState("jobTitle"),
      skills: form.getFieldState("skills"),
      achievements: form.getFieldState("achievements"),
      objectives: form.getFieldState("objectives"),
    },
    onResponse() {
      scrollToBios();
    },
  });

  const onSubmit = (e: any) => {
    console.log(e);
    handleSubmit(e);
  };

  const lastMessage = messages[messages.length - 1];
  const generatedBios =
    lastMessage?.role === "assistant" ? lastMessage.content : null;

  return (
    <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Header />
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-12 sm:mt-20">
        <h1 className="sm:text-6xl text-4xl max-w-[900px] font-bold text-slate-900">
          Generate your next LinkedIn bio using ChatGPT
        </h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((_, e) => onSubmit(e))}
            className="max-w-xl w-full space-y-8 mt-10"
          >
            {formFields.map(({ name, label, placeholder }, index) => (
              <FormField
                key={name}
                control={form.control}
                name={name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <NumberIcon label={index + 1} />
                      {label}
                    </FormLabel>
                    <FormControl>
                      <Input placeholder={placeholder} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                <>
                  Generate your bio
                  <MoveRight className="ml-2" />
                </>
              )}
            </Button>
          </form>
        </Form>
        <output className="space-y-10 my-10">
          {generatedBios && (
            <>
              <div>
                <h2
                  className="sm:text-4xl text-3xl font-bold text-slate-900 mx-auto"
                  ref={bioRef}
                >
                  Your generated bios
                </h2>
              </div>
              <div className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto">
                {generatedBios
                  .substring(generatedBios.indexOf("1") + 3)
                  .split("2.")
                  .map((generatedBio) => {
                    return (
                      <div
                        className="bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-copy border"
                        onClick={() => {
                          navigator.clipboard.writeText(generatedBio);
                          toast({
                            description: "Bio copied to clipboard",
                          });
                        }}
                        key={generatedBio}
                      >
                        <p>{generatedBio}</p>
                      </div>
                    );
                  })}
              </div>
            </>
          )}
        </output>
      </main>
      <Footer />
    </div>
  );
}
