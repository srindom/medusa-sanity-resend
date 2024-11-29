import { sendOrderConfirmationWorkflow } from "../workflows/send-order-confirmation"

export default async function orderPlacedHandler({
  event: { data },
  container,
}) {
  await sendOrderConfirmationWorkflow(container)
    .run({
      input: {
        id: data.id
      }
    })
}

export const config = {
  event: "order.placed",
}
