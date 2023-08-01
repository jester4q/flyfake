declare module '*.svg' {
    const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
    export default content;
}

declare module 'pdfmake-to-html' {
    export default function PdfmakeToHTML(desc: TDocumentDefinitions);
}
