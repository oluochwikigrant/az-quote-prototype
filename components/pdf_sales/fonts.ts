// components/pdf_templates/fonts.ts
import { Font } from "@react-pdf/renderer";
import path from "path";

// Build absolute paths to ARIAL TTF files
const publicDir = path.join(process.cwd(), "public");
const arialRegular = path.join(publicDir, "fonts/Arial/arial_regular.ttf");
const arialBold = path.join(publicDir, "fonts/Arial/arialbd.ttf");
const arialItalic = path.join(publicDir, "fonts/Arial/ariali.ttf");
const arialBoldItalic = path.join(publicDir, "fonts/Arial/arialbi.ttf");

// Build absolute paths to Times New Roman TTF files
const timesNewRoman = path.join(
  publicDir,
  "fonts/TimesNewRoman/timesNewRoman.ttf"
);
const timesNewRomanBold = path.join(
  publicDir,
  "fonts/TimesNewRoman/timesNewRomanBold.ttf"
);
const timesNewRomanBoldItalic = path.join(
  publicDir,
  "fonts/TimesNewRoman/timesNewRomanBoldItalic.ttf"
);
const timesNewRomanItalic = path.join(
  publicDir,
  "fonts/TimesNewRoman/timesNewRomanItalic.ttf"
);

// Register them under the family “Arial”
Font.register({
  family: "Arial",
  fonts: [
    { src: arialRegular },
    { src: arialBold, fontWeight: "bold" },
    { src: arialItalic, fontStyle: "italic" },
    { src: arialBoldItalic, fontWeight: "bold", fontStyle: "italic" },
  ],
});

// Register them under the family “Times New Roman”
Font.register({
  family: "TimesNewRoman",
  fonts: [
    { src: timesNewRoman },
    { src: timesNewRomanBold, fontWeight: "bold" },
    { src: timesNewRomanBoldItalic, fontWeight: "bold", fontStyle: "italic" },
    { src: timesNewRomanItalic, fontStyle: "italic" },
  ],
});
