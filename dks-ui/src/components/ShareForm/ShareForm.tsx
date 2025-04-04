import React, { FormEventHandler, useRef, useState } from "react";
import Image from "next/image";
import styles from "./ShareForm.module.scss";
import SubmitButton from "../SubmitButton/SubmitButton";
import LabeledInput, { iLabeledInput } from "../LabeledInput/LabeledInput";
import { z } from "zod";

export interface Props {
  enableImageURL: boolean;
  handleSubmit: Function;
}

export const ShareFormSchema = z.object({
  firstName: z
    .string()
    .min(1, {
      message: "Please enter a valid Contributor name; minimum 1 character",
    })
    .max(50, {
      message: "Please enter a valid Contributor name; maximum 50 characters",
    })
    .regex(/^[a-zA-Z.\s]*$/, {
      message:
        "Please enter a valid Contributor name; only letters, periods, and spaces allowed",
    })
    .trim(),
  title: z
    .string()
    .min(1, { message: "Please enter a valid Blog Title; minimum 1 character" })
    .max(100, {
      message: "Please enter a valid Blog Title; maximum 100 characters",
    })
    .trim(),
  link: z
    .string()
    .url()
    .regex(/^(http|https):\/\/[a-zA-Z0-9./?&=-]+$/, {
      message: "Please enter a valid Blog URL; starting with http or https",
    })
    .trim(),
  imageUrl: z
    .string()
    .url()
    .regex(/^(http|https|ftp):\/\/[a-zA-Z0-9./?&=-]+$/, {
      message:
        "Please enter a valid Image URL; starting with http, https or ftp",
    })
    .trim()
    .optional(),
});

const ShareForm = (props: Props) => {
  const labeledInput1 = useRef<iLabeledInput>(null);
  const labeledInput2 = useRef<iLabeledInput>(null);
  const labeledInput3 = useRef<iLabeledInput>(null);
  const labeledInput4 = useRef<iLabeledInput>(null);
  const [formErrors, setFormErrors] = useState<z.ZodError | null>(null);

  const handleSubmitForm: FormEventHandler<HTMLFormElement> = async (
    event: any
  ): Promise<void> => {
    event.preventDefault();
    try {
      ShareFormSchema.parse({
        firstName: labeledInput1.current?.getValue(),
        title: labeledInput2.current?.getValue(),
        link: labeledInput3.current?.getValue(),
        imageUrl: labeledInput4.current?.getValue(),
      });
      setFormErrors(null);
    } catch (e) {
      setFormErrors(e as z.ZodError);
      return;
    }
    await props.handleSubmit(event, {
      firstName: labeledInput1.current?.getValue(),
      title: labeledInput2.current?.getValue(),
      link: labeledInput3.current?.getValue(),
      imageUrl: labeledInput4.current?.getValue(),
    });
    clear();
  };

  const clear = () => {
    labeledInput1.current?.clear();
    labeledInput2.current?.clear();
    labeledInput3.current?.clear();
    labeledInput4.current?.clear();
  };

  return (
    <div className={styles.container}>
      <div className={styles.flexContainer}>
        <div className={styles.flexChildLeft}>
          <Image
            alt="exampleCompany Logo"
            src="/dojo-logo-sm.png"
            width="400"
            height="400"
            style={{
              maxWidth: "100%",
              height: "auto",
            }}
          />
        </div>
        <div className={styles.flexChildRight}>
          <form
            data-testid="shareForm"
            className={styles.container}
            onSubmit={(e) => handleSubmitForm(e)}
          >
            {formErrors && (
              <div>
                <p className={styles.zodError}>
                  {
                    formErrors?.errors?.find(
                      (error) => error.path[0] === "firstName"
                    )?.message
                  }
                </p>
              </div>
            )}
            <LabeledInput
              ref={labeledInput1}
              label="Contributor"
              name="firstName"
            />
            {formErrors && (
              <div>
                <p className={styles.zodError}>
                  {
                    formErrors?.errors?.find(
                      (error) => error.path[0] === "title"
                    )?.message
                  }
                </p>
              </div>
            )}
            <LabeledInput ref={labeledInput2} label="Blog Title" name="title" />
            {formErrors && (
              <div>
                <p className={styles.zodError}>
                  {
                    formErrors?.errors?.find(
                      (error) => error.path[0] === "link"
                    )?.message
                  }
                </p>
              </div>
            )}
            <LabeledInput ref={labeledInput3} label="Blog URL" name="link" />
            {props.enableImageURL && (
              <>
                {formErrors && (
                  <div>
                    <p className={styles.zodError}>
                      {
                        formErrors?.errors?.find(
                          (error) => error.path[0] === "imageUrl"
                        )?.message
                      }
                    </p>
                  </div>
                )}
                <LabeledInput
                  ref={labeledInput4}
                  label="Image URL"
                  name="imageUrl"
                />
              </>
            )}
            <SubmitButton label="Share" />
          </form>
        </div>
      </div>
    </div>
  );
};

export default ShareForm;
