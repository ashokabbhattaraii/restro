"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import Toggle from "@/components/ui/Toggle";
import ImageUploader from "@/components/admin/ImageUploader";
import { menuItemSchema } from "@/lib/validations";

type MenuItemFormValues = z.input<typeof menuItemSchema>;

const CATEGORIES = ["Nepali", "Indian", "Chinese", "BBQ & Grill", "Drinks & Bar", "Desserts"];

interface MenuItemFormProps {
  defaultValues?: Partial<MenuItemFormValues> & { featured?: boolean; visible?: boolean };
  image: string;
  onImageChange: (url: string) => void;
  onSubmit: (values: MenuItemFormValues) => void;
  isPending?: boolean;
  submitLabel?: string;
  onCancel?: () => void;
}

export default function MenuItemForm({
  defaultValues,
  image,
  onImageChange,
  onSubmit,
  isPending,
  submitLabel = "Save Item",
  onCancel,
}: MenuItemFormProps) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<MenuItemFormValues>({
    resolver: zodResolver(menuItemSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      category: CATEGORIES[0],
      description: "",
      price: "",
      dietary: [],
      image: "",
      featured: false,
      visible: true,
      ...defaultValues,
    },
  });

  // Watch fields so we can show relative hints and drive the toggles.
  const category = useWatch({ control, name: "category" });
  const featured = useWatch({ control, name: "featured" });
  const visible = useWatch({ control, name: "visible" });

  const categoryHint =
    category === "Drinks & Bar"
      ? "Bar items share the same IQD pricing format."
      : category === "Desserts"
        ? "Keep dessert descriptions short and tempting."
        : "Add spice level and dietary notes where relevant.";

  const imageError = errors.image?.message;

  return (
    <form
      className="admin-form menu-item-form"
      onSubmit={handleSubmit((values) => onSubmit({ ...values, image }))}
    >
      <label className={`admin-form-field ${errors.name ? "has-error" : ""}`}>
        <span>Name</span>
        <Input
          {...register("name")}
          className={errors.name ? "field-error" : ""}
          aria-invalid={!!errors.name}
          placeholder="e.g. Dal Bhat Set"
        />
        {errors.name && <span className="form-error">{errors.name.message}</span>}
      </label>

      <label className={`admin-form-field ${errors.category ? "has-error" : ""}`}>
        <span>Category</span>
        <Select
          {...register("category")}
          className={errors.category ? "field-error" : ""}
          aria-invalid={!!errors.category}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </Select>
        {errors.category && <span className="form-error">{errors.category.message}</span>}
        {category && <span className="field-hint">{categoryHint}</span>}
      </label>

      <label className={`admin-form-field ${errors.price ? "has-error" : ""}`}>
        <span>Price</span>
        <Input
          {...register("price")}
          className={errors.price ? "field-error" : ""}
          aria-invalid={!!errors.price}
          placeholder="IQD 10,000"
        />
        {errors.price && <span className="form-error">{errors.price.message}</span>}
      </label>

      <label className={`admin-form-field full-width ${errors.description ? "has-error" : ""}`}>
        <span>Description</span>
        <Textarea
          {...register("description")}
          rows={3}
          className={errors.description ? "field-error" : ""}
          aria-invalid={!!errors.description}
          placeholder="Short, appetizing description"
        />
        {errors.description && <span className="form-error">{errors.description.message}</span>}
      </label>

      <label className="admin-form-field full-width">
        <span>Image</span>
        <ImageUploader value={image} onChange={onImageChange} folder="menu" />
        {imageError && <span className="form-error">{imageError}</span>}
      </label>

      <div className="admin-toggle-row">
        <Toggle
          checked={Boolean(featured)}
          onChange={(v) => setValue("featured", v, { shouldValidate: true })}
          label="Featured"
        />
        <Toggle
          checked={Boolean(visible)}
          onChange={(v) => setValue("visible", v, { shouldValidate: true })}
          label="Visible"
        />
      </div>

      <div className="admin-detail-actions">
        <Button type="submit" variant="primary" disabled={isPending || !image}>
          {isPending ? "Saving…" : submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
