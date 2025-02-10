import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import xlsx from 'xlsx';

async function generateContent() {
  try {
    const workbook = xlsx.readFile('template.xlsx');
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);

    const content = {
      clientName: data[0].clientName,
      projectTitle: data[0].projectTitle,
      industry: data[0].industry,
      description: data[0].description,
      loomVideoUrl: data[0].loomVideoUrl,
      password: data[0].password,
      projectType: data[0].projectType,
      stripePaymentLink: data[0].stripePaymentLink,
      pricingTiers: JSON.parse(data[0].pricingTiers || '[]'),
      problemStatement: data[0].problemStatement,
      solutionDescription: data[0].solutionDescription,
      benefits: JSON.parse(data[0].benefits || '[]'),
      faqs: JSON.parse(data[0].faqs || '[]'),
      processSteps: JSON.parse(data[0].processSteps || '[]'),
      timelineEvents: JSON.parse(data[0].timelineEvents || '[]')
    };

    await writeFile(
      join(process.cwd(), 'src', 'content.json'),
      JSON.stringify(content, null, 2)
    );

    console.log('Content generated successfully!');
  } catch (error) {
    console.error('Error generating content:', error);
    process.exit(1);
  }
}