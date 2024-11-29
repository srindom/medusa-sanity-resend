import * as React from "react"
import { Text, Column, Container, Heading, Html, Img, Row, Section, Tailwind, Button, Head, Preview, Body, Link } from "@react-email/components"
import { CustomerDTO, OrderDTO } from "@medusajs/framework/types"

type OrderPlacedEmailProps = {
  order: OrderDTO & {
    customer: CustomerDTO
  }
  email_banner?: {
    body: string
    title: string
    url: string
  }
}

function Email({ order, email_banner }: OrderPlacedEmailProps) {
  const shouldDisplayBanner = email_banner && "title" in email_banner

  const formatter = new Intl.NumberFormat([], {
    style: "currency",
    currencyDisplay: "narrowSymbol",
    currency: order.currency_code,
  })

  return (
    <Tailwind>
      <Html className="font-sans bg-gray-100">
        <Head />
        <Preview>Thank you for your order from Medusa</Preview>
        <Body className="bg-white my-10 mx-auto w-full max-w-2xl">
          {/* Header */}
          <Section className="bg-[#27272a] text-white px-6 py-4">
            <svg width="15" height="15" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.2447 3.92183L12.1688 1.57686C10.8352 0.807712 9.20112 0.807712 7.86753 1.57686L3.77285 3.92183C2.45804 4.69098 1.63159 6.11673 1.63159 7.63627V12.345C1.63159 13.8833 2.45804 15.2903 3.77285 16.0594L7.84875 18.4231C9.18234 19.1923 10.8165 19.1923 12.15 18.4231L16.2259 16.0594C17.5595 15.2903 18.3672 13.8833 18.3672 12.345V7.63627C18.4048 6.11673 17.5783 4.69098 16.2447 3.92183ZM10.0088 14.1834C7.69849 14.1834 5.82019 12.3075 5.82019 10C5.82019 7.69255 7.69849 5.81657 10.0088 5.81657C12.3191 5.81657 14.2162 7.69255 14.2162 10C14.2162 12.3075 12.3379 14.1834 10.0088 14.1834Z" fill="currentColor"></path></svg>
          </Section>

          {/* Thank You Message */}
          <Container className="p-6">
            <Heading className="text-2xl font-bold text-center text-gray-800">
              Thank you for your order, {order.customer?.first_name || order.shipping_address?.first_name}
            </Heading>
            <Text className="text-center text-gray-600 mt-2">
              We're processing your order and will notify you when it ships.
            </Text>
          </Container>

          {/* Promotional Banner */}
          {shouldDisplayBanner && (
            <Container
              className="mb-4 rounded-lg p-7"
              style={{
                background: 'linear-gradient(to right, #3b82f6, #4f46e5)'
              }}
            >
              <Section>
                <Row>
                  <Column align="left">
                    <Heading className="text-white text-xl font-semibold">
                      {email_banner.title}
                    </Heading>
                    <Text className="text-white mt-2">{email_banner.body}</Text>
                  </Column>
                  <Column align="right">
                    <Link href={email_banner.url} className="font-semibold px-2 text-white underline">
                      Shop Now
                    </Link>
                  </Column>
                </Row>
              </Section>
            </Container>
          )}

          {/* Order Items */}
          <Container className="px-6">
            <Heading className="text-xl font-semibold text-gray-800 mb-4">
              Your Items
            </Heading>
            <Row>
              <Column>
                <Text className="text-sm m-0 my-2 text-gray-500">Order ID: #{order.display_id}</Text>
              </Column>
            </Row>
            {order.items?.map((item) => (
              <Section key={item.id} className="border-b border-gray-200 py-4">
                <Row>
                  <Column className="w-1/3">
                    <Img
                      src={item.thumbnail ?? ''}
                      alt={item.product_title ?? ''}
                      className="rounded-lg"
                      width="100%"
                    />
                  </Column>
                  <Column className="w-2/3 pl-4">
                    <Text className="text-lg font-semibold text-gray-800">
                      {item.product_title}
                    </Text>
                    <Text className="text-gray-600">{item.variant_title}</Text>
                    <Text className="text-gray-800 mt-2 font-bold">
                      {formatter.format(item.total.toString())}
                    </Text>
                  </Column>
                </Row>
              </Section>
            ))}

            {/* Order Summary */}
            <Section className="mt-8">
              <Heading className="text-xl font-semibold text-gray-800 mb-4">
                Order Summary
              </Heading>
              <Row className="text-gray-600">
                <Column className="w-1/2">
                  <Text className="m-0">Subtotal</Text>
                </Column>
                <Column className="w-1/2 text-right">
                  <Text className="m-0">
                    {formatter.format(order.item_total)}
                  </Text>
                </Column>
              </Row>
              {order.shipping_methods?.map((method) => (
                <Row className="text-gray-600" key={method.id}>
                  <Column className="w-1/2">
                    <Text className="m-0">{method.name}</Text>
                  </Column>
                  <Column className="w-1/2 text-right">
                    <Text className="m-0">{formatter.format(method.total)}</Text>
                  </Column>
                </Row>
              ))}
              <Row className="text-gray-600">
                <Column className="w-1/2">
                  <Text className="m-0">Tax</Text>
                </Column>
                <Column className="w-1/2 text-right">
                  <Text className="m-0">{formatter.format(order.tax_total || 0)}</Text>
                </Column>
              </Row>
              <Row className="border-t border-gray-200 mt-4 text-gray-800 font-bold">
                <Column className="w-1/2">
                  <Text>Total</Text>
                </Column>
                <Column className="w-1/2 text-right">
                  <Text>{formatter.format(order.total)}</Text>
                </Column>
              </Row>
            </Section>
          </Container>

          {/* Footer */}
          <Section className="bg-gray-50 p-6 mt-10">
            <Text className="text-center text-gray-500 text-sm">
              If you have any questions, reply to this email or contact our support team at support@medusajs.com.
            </Text>
            <Text className="text-center text-gray-500 text-sm">
              Order Token: {order.id}
            </Text>
            <Text className="text-center text-gray-400 text-xs mt-4">
              © {new Date().getFullYear()} Medusajs, Inc. All rights reserved.
            </Text>
          </Section>
        </Body>
      </Html>
    </Tailwind >
  )
}

const mockData = { "email_banner": { "id": "f710929c-3b63-4e50-9869-d7286f6d2e66", "body": "Enjoy Black Friday deals until December 10th", "title": "Black Friday Sale Extended", "url": "my-store.com/black-friday-sale" }, "order": { "id": "order_01JDSSRHAYZQZ1H4A8JV00HG7S", "display_id": 1, "email": "seb@medusajs.com", "currency_code": "usd", "total": 25, "subtotal": 25, "discount_total": 0, "shipping_total": 10, "tax_total": 0, "item_subtotal": 15, "item_total": 15, "item_tax_total": 0, "customer_id": "cus_01JDSSNR6B82RZ3FXYVBR5C9WK", "items": [{ "id": "ordli_01JDSSRHAZ6VZGDMJ3K85SG2RH", "title": "L / Black", "subtitle": "Medusa T-Shirt", "thumbnail": "https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-black-front.png", "variant_id": "variant_01JDSQGP92KD5A1MRY70VHGTJN", "product_id": "prod_01JDSQGP7XPQ1JSC6AZKGTHA4Y", "product_title": "Medusa T-Shirt", "product_description": "Reimagine the feeling of a classic T-shirt. With our cotton T-shirts, everyday essentials no longer have to be ordinary.", "product_subtitle": null, "product_type": null, "product_type_id": null, "product_collection": null, "product_handle": "t-shirt", "variant_sku": "SHIRT-L-BLACK", "variant_barcode": null, "variant_title": "L / Black", "variant_option_values": null, "requires_shipping": true, "is_discountable": true, "is_tax_inclusive": false, "raw_compare_at_unit_price": null, "raw_unit_price": { "value": "15", "precision": 20 }, "is_custom_price": false, "metadata": {}, "created_at": "2024-11-28T16:30:41.504Z", "updated_at": "2024-11-28T16:30:41.504Z", "deleted_at": null, "tax_lines": [], "adjustments": [], "compare_at_unit_price": null, "unit_price": 15, "quantity": 1, "raw_quantity": { "value": "1", "precision": 20 }, "detail": { "id": "orditem_01JDSSRHAZY05XKTN40ASSBD2Z", "order_id": "order_01JDSSRHAYZQZ1H4A8JV00HG7S", "version": 1, "item_id": "ordli_01JDSSRHAZ6VZGDMJ3K85SG2RH", "raw_unit_price": null, "raw_compare_at_unit_price": null, "raw_quantity": { "value": "1", "precision": 20 }, "raw_fulfilled_quantity": { "value": "0", "precision": 20 }, "raw_delivered_quantity": { "value": "0", "precision": 20 }, "raw_shipped_quantity": { "value": "0", "precision": 20 }, "raw_return_requested_quantity": { "value": "0", "precision": 20 }, "raw_return_received_quantity": { "value": "0", "precision": 20 }, "raw_return_dismissed_quantity": { "value": "0", "precision": 20 }, "raw_written_off_quantity": { "value": "0", "precision": 20 }, "metadata": null, "created_at": "2024-11-28T16:30:41.504Z", "updated_at": "2024-11-28T16:30:41.504Z", "deleted_at": null, "unit_price": null, "compare_at_unit_price": null, "quantity": 1, "fulfilled_quantity": 0, "delivered_quantity": 0, "shipped_quantity": 0, "return_requested_quantity": 0, "return_received_quantity": 0, "return_dismissed_quantity": 0, "written_off_quantity": 0 }, "subtotal": 15, "total": 15, "original_total": 15, "discount_total": 0, "discount_subtotal": 0, "discount_tax_total": 0, "tax_total": 0, "original_tax_total": 0, "refundable_total_per_unit": 15, "refundable_total": 15, "fulfilled_total": 0, "shipped_total": 0, "return_requested_total": 0, "return_received_total": 0, "return_dismissed_total": 0, "write_off_total": 0, "raw_subtotal": { "value": "15", "precision": 20 }, "raw_total": { "value": "15", "precision": 20 }, "raw_original_total": { "value": "15", "precision": 20 }, "raw_discount_total": { "value": "0", "precision": 20 }, "raw_discount_subtotal": { "value": "0", "precision": 20 }, "raw_discount_tax_total": { "value": "0", "precision": 20 }, "raw_tax_total": { "value": "0", "precision": 20 }, "raw_original_tax_total": { "value": "0", "precision": 20 }, "raw_refundable_total_per_unit": { "value": "15", "precision": 20 }, "raw_refundable_total": { "value": "15", "precision": 20 }, "raw_fulfilled_total": { "value": "0", "precision": 20 }, "raw_shipped_total": { "value": "0", "precision": 20 }, "raw_return_requested_total": { "value": "0", "precision": 20 }, "raw_return_received_total": { "value": "0", "precision": 20 }, "raw_return_dismissed_total": { "value": "0", "precision": 20 }, "raw_write_off_total": { "value": "0", "precision": 20 } }], "shipping_address": { "id": "caaddr_01JDSSR9D9KC93DBRG1K6MK5C1", "customer_id": null, "company": "", "first_name": "Seb", "last_name": "Rindom", "address_1": "FG 9", "address_2": "", "city": "New York", "country_code": "us", "province": "NY", "postal_code": "11092", "phone": "11999222", "metadata": null, "created_at": "2024-11-28T16:30:33.385Z", "updated_at": "2024-11-28T16:30:33.385Z" }, "billing_address": { "id": "caaddr_01JDSSR9D9YMQD54E9KE7MTNAK", "customer_id": null, "company": "", "first_name": "Seb", "last_name": "Rindom", "address_1": "FG 9", "address_2": "", "city": "New York", "country_code": "us", "province": "NY", "postal_code": "11092", "phone": "11999222", "metadata": null, "created_at": "2024-11-28T16:30:33.385Z", "updated_at": "2024-11-28T16:30:33.385Z" }, "shipping_methods": [{ "id": "ordsm_01JDSSRHAYE6RY9A5RS9GVE9ZF", "name": "Express Shipping", "description": null, "raw_amount": { "value": "10", "precision": 20 }, "is_tax_inclusive": false, "is_custom_amount": false, "shipping_option_id": "so_01JDSSR3035MQVF0YN0HZ6P3FP", "data": {}, "metadata": null, "created_at": "2024-11-28T16:30:41.504Z", "updated_at": "2024-11-28T16:30:41.504Z", "deleted_at": null, "tax_lines": [], "adjustments": [], "amount": 10, "order_id": "order_01JDSSRHAYZQZ1H4A8JV00HG7S", "detail": { "id": "ordspmv_01JDSSRHAY7FW8MYQ1Z9HH76WE", "order_id": "order_01JDSSRHAYZQZ1H4A8JV00HG7S", "version": 1, "shipping_method_id": "ordsm_01JDSSRHAYE6RY9A5RS9GVE9ZF", "created_at": "2024-11-28T16:30:41.504Z", "updated_at": "2024-11-28T16:30:41.504Z", "deleted_at": null }, "subtotal": 10, "total": 10, "original_total": 10, "discount_total": 0, "discount_subtotal": 0, "discount_tax_total": 0, "tax_total": 0, "original_tax_total": 0, "raw_subtotal": { "value": "10", "precision": 20 }, "raw_total": { "value": "10", "precision": 20 }, "raw_original_total": { "value": "10", "precision": 20 }, "raw_discount_total": { "value": "0", "precision": 20 }, "raw_discount_subtotal": { "value": "0", "precision": 20 }, "raw_discount_tax_total": { "value": "0", "precision": 20 }, "raw_tax_total": { "value": "0", "precision": 20 }, "raw_original_tax_total": { "value": "0", "precision": 20 } }], "customer": { "id": "cus_01JDSSNR6B82RZ3FXYVBR5C9WK", "company_name": null, "first_name": null, "last_name": null, "email": "seb@medusajs.com", "phone": null, "has_account": false, "metadata": null, "created_at": "2024-11-28T16:29:10.220Z", "updated_at": "2024-11-28T16:29:10.220Z", "deleted_at": null, "created_by": null } } }
export default () => <Email {...mockData} />


export const orderPlacedEmail = (props: OrderPlacedEmailProps) => (
  <Email {...props} />
)
