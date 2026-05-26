import { db } from "@repo/database";
import { formFields, fieldOptions, formsTable } from "@repo/database/schema";
import { eq, asc, inArray } from "drizzle-orm";
import {
  InternalServerError,
  ForbiddenError,
  ResourceNotFoundError,
} from "../../trpc/server/utils/errors";
import { logger } from "@repo/logger";
import { FIELD_DEFINITIONS } from "@repo/shared";

export interface CreateFieldInput {
  formId: string;
  type: string;
  label: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  orderIndex: number;
  options?: Array<{
    label: string;
    value: string;
    orderIndex: number;
  }>;
}

export interface UpdateFieldInput {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  orderIndex: number;
  options?: Array<{
    label: string;
    value: string;
    orderIndex: number;
  }>;
}

export interface UpsertFieldsInput {
  formId: string;
  fields: CreateFieldInput[];
}

class FormFieldService {
  /**
   * Ensure form exists and belongs to user
   */
  private async validateFormOwnership(formId: string, userId: string) {
    const [form] = await db
        .select()
        .from(formsTable)
        .where(eq(formsTable.id, formId))
        .limit(1);

    if (!form) {
      throw new ResourceNotFoundError("Form not found");
    }

    if (form.creatorId !== userId) {
      throw new ForbiddenError(
        "You do not have permission to access this form"
      );
    }

    return form;
  }

  /**
   * Ensure field exists and belongs to user
   */
  private async validateFieldOwnership(fieldId: string, userId: string) {
    const [field] = await db
        .select()
        .from(formFields)
        .where(eq(formFields.id, fieldId))
        .limit(1);

    if (!field) {
      throw new ResourceNotFoundError("Field not found");
    }

    await this.validateFormOwnership(field.formId, userId);

    return field;
  }

  /**
   * Create a single field
   */
  public async createField(input: CreateFieldInput, userId: string) {
    try {
      await this.validateFormOwnership(input.formId, userId);

      const def =
        FIELD_DEFINITIONS[
          input.type as keyof typeof FIELD_DEFINITIONS
        ];

      if (
        def &&
        def.hasOptions &&
        (!input.options || input.options.length < 2)
      ) {
        throw new Error(
          `Field "${input.label}" needs at least 2 options`
        );
      }

      return await db.transaction(async (tx) => {
        const [inserted] = await tx
          .insert(formFields)
          .values({
            formId: input.formId,
            type: input.type,
            label: input.label,
            placeholder: input.placeholder,
            description: input.description,
            required: input.required ?? false,
            orderIndex: input.orderIndex,
          })
          .returning();

        if (!inserted) {
          throw new InternalServerError("Could not create field");
        }

        if (input.options?.length) {
          await tx.insert(fieldOptions).values(
            input.options.map((opt) => ({
              fieldId: inserted.id,
              label: opt.label,
              value: opt.value,
              orderIndex: opt.orderIndex,
            }))
          );
        }

        return inserted;
      });
    } catch (error) {
      logger.error("Error creating field:", error);
      throw error;
    }
  }

  /**
   * Get field by ID
   */
  public async getFieldById(fieldId: string, userId: string) {
    try {
      const field = await this.validateFieldOwnership(
        fieldId,
        userId
      );

      const options = await db
        .select()
        .from(fieldOptions)
        .where(eq(fieldOptions.fieldId, fieldId))
        .orderBy(asc(fieldOptions.orderIndex));

      return {
        ...field,
        options,
      };
    } catch (error) {
      logger.error("Error getting field:", error);
      throw error;
    }
  }

  /**
   * Get all fields for form
   */
  public async getFieldsByFormId(
    formId: string,
    userId: string
  ) {
    try {
      await this.validateFormOwnership(formId, userId);

      const fields = await db
        .select()
        .from(formFields)
        .where(eq(formFields.formId, formId))
        .orderBy(asc(formFields.orderIndex));

      if (fields.length === 0) {
        return [];
      }

      const fieldIds = fields.map((f) => f.id);

      const options = await db
        .select()
        .from(fieldOptions)
        .where(inArray(fieldOptions.fieldId, fieldIds))
        .orderBy(asc(fieldOptions.orderIndex));

      const optionsMap = new Map<string, typeof options>();

      for (const option of options) {
        const existing = optionsMap.get(option.fieldId) || [];
        existing.push(option);
        optionsMap.set(option.fieldId, existing);
      }

      return fields.map((field) => ({
        ...field,
        options: optionsMap.get(field.id) || [],
      }));
    } catch (error) {
      logger.error("Error getting fields by form:", error);
      throw error;
    }
  }

  /**
   * Update field
   */
  public async updateField(
    input: UpdateFieldInput,
    userId: string
  ) {
    try {
      const existingField = await this.validateFieldOwnership(
        input.id,
        userId
      );

      const def =
        FIELD_DEFINITIONS[
          input.type as keyof typeof FIELD_DEFINITIONS
        ];

      if (
        def &&
        def.hasOptions &&
        (!input.options || input.options.length < 2)
      ) {
        throw new Error(
          `Field "${input.label}" needs at least 2 options`
        );
      }

      return await db.transaction(async (tx) => {
        const [updated] = await tx
          .update(formFields)
          .set({
            type: input.type,
            label: input.label,
            placeholder: input.placeholder,
            description: input.description,
            required: input.required,
            orderIndex: input.orderIndex,
          })
          .where(eq(formFields.id, existingField.id))
          .returning();

        if (!updated) {
          throw new ResourceNotFoundError("Field not found");
        }

        if (input.options) {
          await tx
            .delete(fieldOptions)
            .where(eq(fieldOptions.fieldId, input.id));

          if (input.options.length > 0) {
            await tx.insert(fieldOptions).values(
              input.options.map((opt) => ({
                fieldId: input.id,
                label: opt.label,
                value: opt.value,
                orderIndex: opt.orderIndex,
              }))
            );
          }
        }

        return updated;
      });
    } catch (error) {
      logger.error("Error updating field:", error);
      throw error;
    }
  }

  /**
   * Delete field
   */
  public async deleteField(fieldId: string, userId: string) {
    try {
      await this.validateFieldOwnership(fieldId, userId);

      const [deleted] = await db
        .delete(formFields)
        .where(eq(formFields.id, fieldId))
        .returning();

      if (!deleted) {
        throw new ResourceNotFoundError("Field not found");
      }

      return deleted;
    } catch (error) {
      logger.error("Error deleting field:", error);
      throw error;
    }
  }

  /**
   * Replace all fields for form
   */
  public async upsertFieldsByForm(
    input: UpsertFieldsInput,
    userId: string
  ) {
    try {
      await this.validateFormOwnership(
        input.formId,
        userId
      );

      return await db.transaction(async (tx) => {
        for (const field of input.fields) {
          const def =
            FIELD_DEFINITIONS[
              field.type as keyof typeof FIELD_DEFINITIONS
            ];

          if (
            def &&
            def.hasOptions &&
            (!field.options || field.options.length < 2)
          ) {
            throw new Error(
              `Field "${field.label}" needs at least 2 options`
            );
          }
        }

        await tx
          .delete(formFields)
          .where(eq(formFields.formId, input.formId));

        const createdFields = [];

        for (const field of input.fields) {
          const [inserted] = await tx
            .insert(formFields)
            .values({
              formId: input.formId,
              type: field.type,
              label: field.label,
              placeholder: field.placeholder,
              description: field.description,
              required: field.required ?? false,
              orderIndex: field.orderIndex,
            })
            .returning();

          if (!inserted) {
            throw new InternalServerError(
              "Could not create field"
            );
          }

          if (field.options?.length) {
            await tx.insert(fieldOptions).values(
              field.options.map((opt) => ({
                fieldId: inserted.id,
                label: opt.label,
                value: opt.value,
                orderIndex: opt.orderIndex,
              }))
            );
          }

          createdFields.push(inserted);
        }

        return createdFields;
      });
    } catch (error) {
      logger.error("Error upserting fields:", error);
      throw error;
    }
  }
}

export default FormFieldService;