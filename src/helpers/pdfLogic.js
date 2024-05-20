import jsPDF from "jspdf";
import 'jspdf-autotable';

export const getQuizPdf = (quiz) => {
    // Initialize jsPDF document
    const doc = new jsPDF('p', 'pt', 'a4');

    // Set up header
    const header = (data) => {
        doc.setFontSize(18);
        doc.setTextColor(40);
        doc.setFont('helvetica', 'bold');
        // Display quiz code below title on the first page
        if (data.pageNumber === 1) {
            doc.text(`Quiz: ${quiz.title.length > 40 ? `${quiz.title.slice(0,39)}...`:quiz.title}`, data.settings.margin.left, 50);
            doc.setFontSize(12);
            doc.text(`Code: ${quiz.code}`, data.settings.margin.left, 70);
        }
    };

    // Set up footer
    const footer = (data) => {
        const pageCount = doc.internal.getNumberOfPages();
        doc.setFontSize(12);
        doc.text(`Page ${data.pageNumber} of ${pageCount}`, data.settings.margin.left, doc.internal.pageSize.height - 20);
    };

    // Configuration for autoTable
    let tableRows = [];
    let questionNumber = 1;

    // Iterate through each question
    quiz.questions.forEach((question, index) => {
        const { questionText, options, correctIndex } = question;

        // Prepare question text with wrapping for long titles
        const questionLines = doc.splitTextToSize(`Q${questionNumber}: ${questionText}. ${question.questionImgUrl?'<IMAGE>':''}`, 520);
        tableRows.push([{ content: questionLines, colSpan: 3, styles: { fontStyle: 'bold' } }]);

        // Add options
        options.forEach((option, idx) => {
            let isCorrect = idx === correctIndex;
            let optionLabel = String.fromCharCode(97 + idx).toUpperCase() + ')';
            let optionText = `${optionLabel} ${option}`;
            tableRows.push([optionText, isCorrect ? '(Correct)' : '', '']);
        });

        // Add time per question
        let timePerQuestion = `${question.duration}s`; // You can customize this based on your needs
        tableRows.push(['Time:', timePerQuestion, '']);

        // Add empty row as separator
        tableRows.push(['', '', '']);

        // Increase question number
        questionNumber++;

        // Check if there's enough space for the next question
        const pageHeight = doc.internal.pageSize.height;
        if (doc.lastAutoTable.finalY > pageHeight - 60) {
            doc.addPage();
        }
    });

    // Add content using autoTable
    doc.autoTable({
        body: tableRows,
        startY: 90, // Increased startY to accommodate the title and code
        theme: 'grid',
        styles: {
            cellPadding: 5,
            fontSize: 12,
            valign: 'middle',
            halign: 'center'
        },
        columnStyles: {
            0: { fontStyle: 'bold', halign: 'left' },
            1: { fontStyle: 'italic', halign: 'left' },
            2: { halign: 'left' }
        },
        didDrawPage: function (data) {
            // Header and footer
            header(data);
            footer(data);
        }
    });

    // Save the PDF
    const pdfName = `Quiz_${quiz.title.length < 20 ? quiz.title : quiz.code}.pdf`;
    doc.save(pdfName);
};
