import { Story } from "../types";
import { jsPDF } from "jspdf";

export const generatePDF = async (story: Story): Promise<void> => {
  // Initialize jsPDF with standard A4 portrait configuration
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;

  // --- Cover Page ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.text("My Christian", pageWidth / 2, 60, { align: "center" });
  doc.text("Coloring Storybook", pageWidth / 2, 75, { align: "center" });

  doc.setFontSize(16);
  doc.setFont("helvetica", "normal");
  doc.text(`Made especially for`, pageWidth / 2, 100, { align: "center" });
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.text(story.childName, pageWidth / 2, 115, { align: "center" });

  doc.setLineWidth(1);
  doc.rect(margin, margin, pageWidth - (margin * 2), pageHeight - (margin * 2));
  
  // Decorative Cross (Simple lines)
  const cx = pageWidth / 2;
  const cy = 160;
  doc.setLineWidth(2);
  doc.line(cx, cy - 30, cx, cy + 30); // Vertical
  doc.line(cx - 15, cy - 10, cx + 15, cy - 10); // Horizontal
  
  doc.setFontSize(14);
  doc.setFont("courier", "italic");
  doc.text(`"${story.title}"`, pageWidth / 2, 220, { align: "center" });

  // --- Story Pages ---
  for (let i = 0; i < story.scenes.length; i++) {
    doc.addPage();
    const scene = story.scenes[i];

    // Border
    doc.setLineWidth(0.5);
    doc.rect(margin, margin, pageWidth - (margin * 2), pageHeight - (margin * 2));

    // Image
    if (scene.imageData) {
      const imgProps = doc.getImageProperties(scene.imageData);
      const imgWidth = pageWidth - (margin * 3);
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
      
      // Center image vertically in the top 2/3rds
      const x = margin + (margin / 2);
      const y = margin + 10;
      
      doc.addImage(scene.imageData, "PNG", x, y, imgWidth, imgHeight);
    }

    // Text Area at bottom
    const textY = pageHeight - 80;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(18);
    
    // Split text to fit
    const splitText = doc.splitTextToSize(scene.storyText, pageWidth - (margin * 3));
    doc.text(splitText, pageWidth / 2, textY, { align: "center" });

    // Page Number
    doc.setFontSize(10);
    doc.text(`Page ${i + 1}`, pageWidth / 2, pageHeight - 15, { align: "center" });
  }

  // --- Back Cover / Moral ---
  doc.addPage();
  doc.rect(margin, margin, pageWidth - (margin * 2), pageHeight - (margin * 2));
  
  doc.setFontSize(22);
  doc.text("The Lesson", pageWidth / 2, 80, { align: "center" });
  
  doc.setFontSize(16);
  const moralText = doc.splitTextToSize(story.moral, pageWidth - (margin * 4));
  doc.text(moralText, pageWidth / 2, 100, { align: "center" });

  doc.save(`${story.childName.replace(/\s+/g, '_')}_Coloring_Book.pdf`);
};