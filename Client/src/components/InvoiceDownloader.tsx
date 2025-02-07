import React from "react";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";

const InvoiceDownloader: React.FC<InvoiceDownloaderProps> = ({
  orderData,
  userId,
}) => {
  // Helper function to format currency
  const formatCurrency = (amount: number): string => {
    // Ensure to fix the currency symbol and format the number
    const formattedAmount = amount.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    return `INR${formattedAmount}`;
  };

  const generatePDF = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const imageData = "/logo.png";
    const doc = new jsPDF();

    // Add Arial font for better number rendering
    // doc.setFont("helvetica");
    doc.setFont("times"); // Looks formal and neat

    // Add company header
    doc.setFontSize(20);
    doc.setTextColor(44, 62, 80);
    doc.addImage(imageData, "PNG", 15, 2, 60, 20);
    doc.text("INVOICE RECEIPT", 120, 20, { align: "left" });

    // Add horizontal line
    doc.setDrawColor(220, 220, 220);
    doc.line(15, 25, 195, 25);

    // Add order details
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`Order ID: ${orderData.orderId}`, 15, 35);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 15, 40);

    // Add customer details section
    doc.setFontSize(12);
    doc.setTextColor(44, 62, 80);
    doc.text("Customer Details", 15, 50);

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`Name: ${userId.name}`, 15, 57);
    doc.text(`Email: ${userId.email}`, 15, 62);
    doc.text(`Phone: ${userId.mobile}`, 15, 67);

    let yPos = 72;

    // Add wholesaler info if applicable
    if (userId.isWholesaler) {
      doc.setFontSize(12);
      doc.setTextColor(44, 62, 80);
      doc.text("Business Details", 15, yPos + 5);

      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(`Company: ${userId.companyName || ""}`, 15, yPos + 12);
      doc.text(`GSTIN: ${userId.GSTIN || ""}`, 15, yPos + 17);
      yPos += 25;
    }

    // Add shipping address
    doc.setFontSize(12);
    doc.setTextColor(44, 62, 80);
    doc.text("Shipping Address", 15, yPos);

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(orderData.delivery_address.address_line, 15, yPos + 7);
    doc.text(
      `${orderData.delivery_address.state}, ${orderData.delivery_address.country} - ${orderData.delivery_address.pincode}`,
      15,
      yPos + 12,
    );

    // Prepare table data
    let tableData = [];

    // Add variant quantities if they exist
    if (
      orderData.product_details.variantQty &&
      orderData.product_details.variantQty.length > 0
    ) {
      tableData = orderData.product_details.variantQty.map((item) => [
        orderData.product_details.name,
        item.materialType,
        item.brandName,
        formatCurrency(orderData.product_details.price),
        // `${orderData.product_details.price}`,
        item.quantity.toString(),
        formatCurrency(item.quantity * orderData.product_details.price),
      ]);
    } else {
      // Add single product if no variants
      tableData = [
        [
          orderData.product_details.name,
          "-",
          "-",
          formatCurrency(orderData.product_details.price),
          orderData.product_details.quantity?.toString() || "1",
          formatCurrency(
            Number(orderData.product_details.quantity || 1) *
              orderData.product_details.price,
          ),
        ],
      ];
    }

    // Add product table
    // @ts-ignore (jspdf-autotable types)
    doc.autoTable({
      startY: yPos + 20,
      head: [["Product", "Material", "Brand", "Price", "Qty", "Total"]],
      body: tableData,
      theme: "grid",
      headStyles: {
        fillColor: [34, 139, 34],
        fontSize: 8,
        halign: "center",
        fontStyle: "bold",
      },
      styles: {
        fontSize: 9,
        cellPadding: 5,
        halign: "center",
        font: "helvetica",
      },
      columnStyles: {
        0: { cellWidth: 60 }, // Product name
        3: { halign: "left", fontStyle: "bold" }, // Price
        5: { halign: "left", fontStyle: "bold" }, // Total
      },
    });

    // Get the last Y position after the table
    // @ts-ignore (jspdf-autotable types)
    const finalY = doc.lastAutoTable.finalY || 150;

    // Add totals section with better styling
    doc.setDrawColor(220, 220, 220);
    doc.line(120, finalY + 5, 195, finalY + 5);

    // Create totals table with improved number formatting
    // @ts-ignore (jspdf-autotable types)
    doc.autoTable({
      startY: finalY + 10,
      head: [],
      body: [
        ["Sub-Total:", formatCurrency(orderData.subTotalAmt)],
        ["Shipping Cost:", formatCurrency(50)],
        ["Grand Total:", formatCurrency(orderData.totalAmt)],
      ],
      theme: "plain",
      styles: {
        fontSize: 8,
        cellPadding: 1,
        font: "helvetica",
      },
      columnStyles: {
        0: { cellWidth: 50, fontStyle: "bold", halign: "left" },
        1: { cellWidth: 30, halign: "left", fontStyle: "bold" },
      },
      margin: { left: 120 },
    });

    // Add payment and order status
    // @ts-ignore (jspdf-autotable types)
    const totalsEndY = doc.lastAutoTable.finalY + 10;

    doc.setFontSize(10);
    doc.setTextColor(44, 62, 80);
    doc.text(
      `Payment Method: ${orderData.payment_status === "CASH ON DELIVERY" ? "Cash on Delivery" : "Online Payment"}`,
      15,
      totalsEndY,
    );
    doc.text(`Order Status: ${orderData.order_status}`, 15, totalsEndY + 5);

    // Add footer line
    doc.setDrawColor(220, 220, 220);
    doc.line(15, totalsEndY + 15, 195, totalsEndY + 15);

    // Download the PDF
    doc.save(`Invoice-${orderData.orderId}.pdf`);
  };

  return (
    <Button
      onClick={generatePDF}
      variant="outline"
      className="ml-2 flex items-center gap-2"
      type="button"
    >
      <FileDown className="h-4 w-4" />
      Download Invoice
    </Button>
  );
};

// const InvoiceDownloader: React.FC<InvoiceDownloaderProps> = ({
//   orderData,
//   userId,
// }) => {
//   // Helper function to format currency
//   const formatCurrency = (amount: number): string => {
//     return new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2,
//     })
//       .format(amount)
//       .replace("INR", "₹");
//   };
//   const generatePDF = (e: React.MouseEvent<HTMLButtonElement>) => {
//     e.preventDefault();

//     const doc = new jsPDF();
//     const greenColor = [34, 139, 34]; // Forest green color

//     // Set font
//     doc.setFont("helvetica");

//     // Add header with green theme
//     doc.setFontSize(28);
//     doc.setTextColor(greenColor[0], greenColor[1], greenColor[2]);
//     doc.text("Invoice", 15, 25);

//     // Logo placeholder (top right)
//     doc.rect(160, 15, 35, 35);
//     doc.setFontSize(8);
//     doc.text("Company Logo", 170, 35);

//     // Add From section
//     doc.setFontSize(10);
//     doc.setTextColor(80, 80, 80);
//     doc.text("From", 15, 45);
//     doc.setFontSize(11);
//     doc.setTextColor(0, 0, 0);
//     doc.text(userId.companyName || "Your Company Name", 15, 52);
//     doc.setFontSize(10);
//     doc.text(userId.email || "", 15, 59);
//     doc.text(userId.officeAddress || "", 15, 66);
//     doc.text(`Phone: ${userId.mobile || ""}`, 15, 73);

//     let yPos = 72;
//     if (userId.isWholesaler) {
//       doc.setFontSize(12);
//       doc.setTextColor(44, 62, 80);
//       doc.text("Business Details", 15, yPos + 5);

//       doc.setFontSize(10);
//       doc.setTextColor(0, 0, 0);
//       doc.text(`Company: ${userId.companyName || ""}`, 15, yPos + 12);
//       doc.text(`GSTIN: ${userId.GSTIN || ""}`, 15, yPos + 17);
//       yPos += 25;
//     }

//     // Add For section
//     doc.setFontSize(10);
//     doc.setTextColor(80, 80, 80);
//     doc.text("For", 120, 45);
//     doc.setFontSize(11);
//     doc.setTextColor(0, 0, 0);
//     doc.text(orderData.delivery_address.address_title, 120, 52);
//     doc.setFontSize(10);
//     doc.text(orderData.delivery_address.address_line, 120, 59);
//     doc.text(
//       `${orderData.delivery_address.city}, ${orderData.delivery_address.state}`,
//       120,
//       66,
//     );
//     doc.text(`Phone: ${orderData.delivery_address.mobile}`, 120, 73);

//     // Add invoice details
//     doc.setFontSize(10);
//     doc.setTextColor(80, 80, 80);
//     doc.text("Number:", 15, 90);
//     doc.text("Date:", 15, 97);
//     doc.text("Due:", 15, 104);

//     doc.setTextColor(0, 0, 0);
//     doc.text(orderData.orderId, 50, 90);
//     doc.text(new Date().toLocaleDateString(), 50, 97);
//     doc.text(
//       new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
//       50,
//       104,
//     );

//     // Add items table with green header
//     const tableData = orderData.product_details.variantQty?.map((item) => [
//       orderData.product_details.name,
//       item.materialType,
//       item.quantity.toString(),
//       formatCurrency(orderData.product_details.price),
//       formatCurrency(item.quantity * orderData.product_details.price),
//     ]) || [
//       [
//         orderData.product_details.name,
//         "-",
//         orderData.product_details.quantity?.toString() || "1",
//         formatCurrency(orderData.product_details.price),
//         formatCurrency(
//           Number(orderData.product_details.quantity || 1) *
//             orderData.product_details.price,
//         ),
//       ],
//     ];

//     // @ts-ignore
//     doc.autoTable({
//       startY: 120,
//       head: [["Description", "Type", "Qty", "Price", "Amount"]],
//       body: tableData,
//       theme: "grid",
//       headStyles: {
//         fillColor: greenColor,
//         textColor: 255,
//         fontSize: 10,
//         fontStyle: "bold",
//       },
//       styles: {
//         fontSize: 9,
//         cellPadding: 5,
//       },
//       columnStyles: {
//         3: { halign: "right" },
//         4: { halign: "right" },
//       },
//     });

//     // Add totals section
//     // @ts-ignore
//     const finalY = doc.lastAutoTable.finalY || 150;

//     // @ts-ignore
//     doc.autoTable({
//       startY: finalY + 10,
//       head: [],
//       body: [
//         ["Subtotal", formatCurrency(orderData.subTotalAmt)],
//         ["Tax (17%)", formatCurrency(orderData.subTotalAmt * 0.17)],
//         ["Total", formatCurrency(orderData.totalAmt)],
//       ],
//       theme: "plain",
//       styles: {
//         fontSize: 10,
//         cellPadding: 4,
//       },
//       columnStyles: {
//         0: { cellWidth: 150, fontStyle: "bold" },
//         1: { cellWidth: 40, halign: "right", fontStyle: "bold" },
//       },
//       margin: { left: 120 },
//     });

//     // Add notes section
//     // @ts-ignore
//     const totalsEndY = doc.lastAutoTable.finalY + 20;

//     doc.setFontSize(10);
//     doc.setTextColor(80, 80, 80);
//     doc.text("Notes", 15, totalsEndY);
//     doc.setTextColor(0, 0, 0);
//     doc.text("Please pay within 20 days by PayPal.", 15, totalsEndY + 7);
//     doc.text("Thank you!", 15, totalsEndY + 14);

//     // Download the PDF
//     doc.save(`Invoice-${orderData.orderId}.pdf`);
//   };

//      // Add payment and order status
// //     // @ts-ignore (jspdf-autotable types)
// //     const totalsEndY = doc.lastAutoTable.finalY + 10;

// //     doc.setFontSize(10);
// //     doc.setTextColor(44, 62, 80);
// //     doc.text(
// //       `Payment Method: ${orderData.payment_status === "CASH ON DELIVERY" ? "Cash on Delivery" : "Online Payment"}`,
// //       15,
// //       totalsEndY,
// //     );
// //     doc.text(`Order Status: ${orderData.order_status}`, 15, totalsEndY + 5);

// //     // Add footer line
// //     doc.setDrawColor(220, 220, 220);
// //     doc.line(15, totalsEndY + 15, 195, totalsEndY + 15);

// //     // Download the PDF
// //     doc.save(`Invoice-${orderData.orderId}.pdf`);
// //   };

//   return (
//     <Button
//       onClick={generatePDF}
//       variant="outline"
//       className="ml-2 flex items-center gap-2"
//       type="button"
//     >
//       <FileDown className="h-4 w-4" />
//       Download Invoice
//     </Button>
//   );
// };

export default InvoiceDownloader;
