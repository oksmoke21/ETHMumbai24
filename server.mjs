import { getDocument } from 'pdfjs-dist/build/pdf.mjs';

const relativeUrlPath = `Experian-CreditReport-1005776529-1708252425966.pdf`

// Function to process PDF
const processPDF = (relativeUrlPath, password) => {
    let loadingTask = getDocument({ url: relativeUrlPath, password: password });
    loadingTask.promise.then(pdf => {
        console.log('PDF loaded');
        
        // Getting the PDF metadata
        pdf.getMetadata().then(({ info, metadata }) => {
            // Accessing the creation date from the info object
            console.log('Info:', info);
            if (info.CreationDate) {
                console.log('Creation Date:', info.CreationDate);
                // You might need to parse this date to a more readable format
            } else {
                console.log('Creation Date not found in PDF metadata.');
            }
        });

        // Processing first page of PDF
        pdf.getPage(1).then(page => {
            // Extracting text from the first page
            page.getTextContent().then(textContent => {
                let textOfFirstPage = textContent.items.map(item => item.str).join(' ');

                // Searching for the specific string and returning the next word
                let searchString = "Your Experian Credit Report is summarized in the form of Experian Credit Score which ranges from 300 - 900.";
                let nextWord = findNextWord(textOfFirstPage, searchString);
                if (nextWord != null) {
                    console.log('Credit Score:', nextWord);
                    return nextWord
                }
                else throw Error("Could not decode Experian PDF");
            });
        });
    }).catch(reason => {
        console.error(`Error: ${reason}`);
    });
};

// Function to find the next word after a specific string in the text
const findNextWord = (text, searchString) => {
    let index = text.indexOf(searchString);
    if (index !== -1) {
        // Split the text from the found index
        let substring = text.substring(index + searchString.length);

        // Extract the next word - assuming words are separated by spaces
        let match = substring.match(/\s+(\S+)/);
        if (match && match.length > 1) {
            return match[1]; // The next word
        }
    }
    return null; // Not found or no next word
};

const cibilScore = processPDF(relativeUrlPath, "RAJE7600");
console.log("Your credit score is: ", )