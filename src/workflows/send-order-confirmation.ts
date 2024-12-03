import { createStep, createWorkflow, StepResponse, transform, WorkflowResponse } from "@medusajs/framework/workflows-sdk";
import { useQueryGraphStep } from "@medusajs/medusa/core-flows";
import { Modules } from "@medusajs/framework/utils"
import { CreateNotificationDTO, OrderDTO } from "@medusajs/framework/types"

export const sendNotificationStep = createStep(
  "send-notification",
  async (data: CreateNotificationDTO, { container, idempotencyKey }) => {
    const notificationModuleService = container.resolve(
      Modules.NOTIFICATION
    )
    const notification = await notificationModuleService.createNotifications({
      ...data,
      idempotency_key: idempotencyKey,
    })
    return new StepResponse(notification)
  }
)

type WorkflowInput = {
  id: string
}

export const sendOrderConfirmationWorkflow = createWorkflow(
  "send-order-confirmation",
  ({ id }: WorkflowInput) => {
    // @ts-ignore
    const { data: orders } = useQueryGraphStep({
      entity: "order",
      fields: [
        "id",
        // @ts-ignore
        "display_id",
        "email",
        "currency_code",
        "total",
        "items.*",
        "shipping_address.*",
        "billing_address.*",
        "shipping_methods.*",
        // @ts-ignore
        "customer.*",
        "total",
        "subtotal",
        "discount_total",
        "shipping_total",
        "tax_total",
        "item_subtotal",
        "item_total",
        "item_tax_total",
      ],
      filters: {
        id
      }
    })

    // @ts-ignore
    const { data: emailBanner } = useQueryGraphStep({
      entity: "sanity",
      fields: [
        "id",
        "body",
        "title",
        "url",
      ],
      filters: {
        doc_type: "email_banner"
      }
    }).config({ name: "get-email-banner" })
    
    const notification = sendNotificationStep({
      to: orders[0].email,
      channel: "email",
      template: "order-placed",
      data: {
        email_banner: emailBanner[0],
        order: orders[0]
      },
    })

    return new WorkflowResponse(notification)
  }
)
